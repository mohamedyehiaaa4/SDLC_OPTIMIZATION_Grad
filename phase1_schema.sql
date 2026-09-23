-- =====================================================
-- RepoMind Phase 1 Database Schema
-- Planning & Requirements Module
-- PostgreSQL (Supabase)
--
-- How the backend is expected to use these tables:
--   * Clients (anon / authenticated) can only READ projects they are
--     members of. All writes go through the backend (service role).
--   * Artifacts are never deleted: set deleted_at instead.
--   * Always set updated_by when updating an artifact
--     (NULL means the change came from the AI / system).
--   * Artifacts are approved or rejected ONLY by inserting a row into
--     approvals, for the artifact's current version.
--   * display_key (FR-001, US-004, ...), version, history rows, and
--     "needs review" flags on dependents are maintained by triggers.
--   * Optional: SELECT set_config('app.change_reason', '<text>', true)
--     inside a transaction to record a reason in artifact_history.
-- =====================================================


-- =====================================================
-- ENUM TYPES
-- =====================================================


CREATE TYPE project_role AS ENUM (
    'PROJECT_MANAGER',
    'SOFTWARE_ARCHITECT',
    'DEVELOPER',
    'TESTER'
);


CREATE TYPE project_status AS ENUM (
    'ACTIVE',
    'COMPLETED',
    'ARCHIVED'
);


CREATE TYPE artifact_type AS ENUM (
    'PRD',
    'FUNCTIONAL_REQUIREMENT',
    'NON_FUNCTIONAL_REQUIREMENT',
    'ASSUMPTION',
    'OPEN_ISSUE',
    'USER_STORY',
    'ACCEPTANCE_CRITERIA'
);


CREATE TYPE artifact_status AS ENUM (
    'DRAFT',
    'NEEDS_REVIEW',
    'APPROVED',
    'SUPERSEDED',
    'REJECTED'
);


CREATE TYPE approval_decision AS ENUM (
    'APPROVED',
    'REJECTED',
    'REQUEST_CHANGES'
);


CREATE TYPE relationship_type AS ENUM (
    'IMPLEMENTS',               -- source = requirement, target = user story
    'HAS_ACCEPTANCE_CRITERIA',  -- source = user story,  target = acceptance criteria
    'DERIVED_FROM',
    'RELATED_TO'
);



-- =====================================================
-- USERS
-- One row per Supabase Auth user, created on signup
-- =====================================================

CREATE TABLE users (

    id UUID PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),


    CONSTRAINT fk_user_auth
        FOREIGN KEY(id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE

);



-- =====================================================
-- PROJECTS
-- =====================================================

CREATE TABLE projects (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(255) NOT NULL,

    description TEXT,

    status project_status NOT NULL DEFAULT 'ACTIVE',

    created_by UUID NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),


    CONSTRAINT fk_project_creator
        FOREIGN KEY(created_by)
        REFERENCES users(id)

);



-- =====================================================
-- PROJECT MEMBERS
-- Roles are per project, not global
-- =====================================================

CREATE TABLE project_members (

    project_id UUID NOT NULL,

    user_id UUID NOT NULL,

    role project_role NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),


    PRIMARY KEY (project_id, user_id),


    CONSTRAINT fk_member_project
        FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,


    CONSTRAINT fk_member_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE

);



-- =====================================================
-- ARTIFACTS
-- Core Planning Memory
-- =====================================================

CREATE TABLE artifacts (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL,

    artifact_type artifact_type NOT NULL,

    display_key VARCHAR(20) NOT NULL,           -- FR-001, US-004, ... (set by trigger)

    title VARCHAR(255),

    content JSONB NOT NULL,

    status artifact_status NOT NULL DEFAULT 'DRAFT',

    version INTEGER NOT NULL DEFAULT 1,         -- +1 on every content/title change (trigger)

    created_by UUID NOT NULL,

    updated_by UUID,                            -- NULL = last change by AI / system

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    deleted_at TIMESTAMPTZ,                     -- soft delete


    CONSTRAINT uq_artifact_display_key
        UNIQUE (project_id, display_key),


    CONSTRAINT uq_artifact_project
        UNIQUE (id, project_id),


    CONSTRAINT fk_artifact_project
        FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,


    CONSTRAINT fk_artifact_creator
        FOREIGN KEY(created_by)
        REFERENCES users(id),


    CONSTRAINT fk_artifact_updater
        FOREIGN KEY(updated_by)
        REFERENCES users(id)

);



-- Per-project counters used to generate display keys.
-- Keys are never reused, even after an artifact is deleted.
CREATE TABLE artifact_key_counters (

    project_id UUID NOT NULL,

    prefix VARCHAR(10) NOT NULL,

    last_value INTEGER NOT NULL,


    PRIMARY KEY (project_id, prefix),


    CONSTRAINT fk_counter_project
        FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE

);



-- =====================================================
-- ARTIFACT RELATIONSHIPS
-- Requirement -> Story -> Acceptance Criteria
-- =====================================================

CREATE TABLE artifact_relationships (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL,

    source_artifact_id UUID NOT NULL,

    target_artifact_id UUID NOT NULL,

    relationship_type relationship_type NOT NULL,

    created_by UUID,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),


    -- Composite keys guarantee both artifacts belong to the same project
    CONSTRAINT fk_source_artifact
        FOREIGN KEY(source_artifact_id, project_id)
        REFERENCES artifacts(id, project_id)
        ON DELETE CASCADE,


    CONSTRAINT fk_target_artifact
        FOREIGN KEY(target_artifact_id, project_id)
        REFERENCES artifacts(id, project_id)
        ON DELETE CASCADE,


    CONSTRAINT fk_relationship_creator
        FOREIGN KEY(created_by)
        REFERENCES users(id),


    CONSTRAINT different_artifacts
        CHECK(source_artifact_id <> target_artifact_id),


    CONSTRAINT uq_relationship
        UNIQUE (source_artifact_id, target_artifact_id, relationship_type)

);


-- Each acceptance criterion belongs to exactly one story
CREATE UNIQUE INDEX uq_criteria_single_story
ON artifact_relationships(target_artifact_id)
WHERE relationship_type = 'HAS_ACCEPTANCE_CRITERIA';



-- =====================================================
-- APPROVALS
-- Human approval workflow, tied to an artifact version
-- =====================================================

CREATE TABLE approvals (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    artifact_id UUID NOT NULL,

    artifact_version INTEGER NOT NULL,

    decided_by UUID NOT NULL,

    decision approval_decision NOT NULL,

    comments TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),


    CONSTRAINT fk_approval_artifact
        FOREIGN KEY(artifact_id)
        REFERENCES artifacts(id)
        ON DELETE CASCADE,


    CONSTRAINT fk_approval_user
        FOREIGN KEY(decided_by)
        REFERENCES users(id)

);



-- =====================================================
-- ARTIFACT HISTORY
-- Audit Trail (written by triggers only)
-- =====================================================

CREATE TABLE artifact_history (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    artifact_id UUID NOT NULL,

    artifact_version INTEGER NOT NULL,          -- version after this change

    action VARCHAR(20) NOT NULL
        CHECK (action IN ('CREATED', 'UPDATED', 'STATUS_CHANGED', 'DELETED')),

    old_content JSONB,

    new_content JSONB,

    old_status artifact_status,

    new_status artifact_status,

    changed_by UUID,                            -- NULL = AI / system

    reason TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),


    CONSTRAINT fk_history_artifact
        FOREIGN KEY(artifact_id)
        REFERENCES artifacts(id)
        ON DELETE CASCADE,


    CONSTRAINT fk_history_user
        FOREIGN KEY(changed_by)
        REFERENCES users(id)

);



-- =====================================================
-- QUALITY CHECKS
-- AI evaluation results (informational, never approve)
-- =====================================================

CREATE TABLE quality_checks (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    artifact_id UUID NOT NULL,

    artifact_version INTEGER NOT NULL,

    check_type VARCHAR(100) NOT NULL,

    result VARCHAR(50),

    score NUMERIC(5,2),

    details JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),


    CONSTRAINT fk_quality_artifact
        FOREIGN KEY(artifact_id)
        REFERENCES artifacts(id)
        ON DELETE CASCADE

);



-- =====================================================
-- INDEXES
-- =====================================================


CREATE UNIQUE INDEX uq_one_pm_per_project
ON project_members(project_id)
WHERE role = 'PROJECT_MANAGER';



CREATE INDEX idx_members_user
ON project_members(user_id);



CREATE INDEX idx_projects_creator
ON projects(created_by);



CREATE INDEX idx_artifacts_project_type_status
ON artifacts(project_id, artifact_type, status)
WHERE deleted_at IS NULL;



CREATE INDEX idx_relationship_source
ON artifact_relationships(source_artifact_id);



CREATE INDEX idx_relationship_target
ON artifact_relationships(target_artifact_id);



CREATE INDEX idx_history_artifact
ON artifact_history(artifact_id, created_at);



CREATE INDEX idx_quality_artifact
ON quality_checks(artifact_id, artifact_version);



CREATE INDEX idx_approval_artifact
ON approvals(artifact_id, created_at);



-- =====================================================
-- TRIGGERS: users and projects
-- =====================================================


-- Create a public.users row whenever someone signs up with Supabase Auth
CREATE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.users (id, name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
        NEW.email
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();



CREATE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION set_updated_at();



-- The user who creates a project becomes its Project Manager
CREATE FUNCTION add_project_creator_as_pm()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.project_members (project_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'PROJECT_MANAGER');
    RETURN NULL;
END;
$$;

CREATE TRIGGER trg_projects_add_pm
AFTER INSERT ON projects
FOR EACH ROW EXECUTE FUNCTION add_project_creator_as_pm();



-- =====================================================
-- TRIGGERS: artifacts
-- =====================================================


-- Mark approved requirements -> stories -> criteria downstream of an
-- artifact as NEEDS_REVIEW (spec: change impact rule)
CREATE FUNCTION mark_dependents_needs_review(p_artifact_id UUID, p_reason TEXT)
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
    v_previous_reason TEXT := current_setting('app.change_reason', true);
BEGIN
    PERFORM set_config('app.change_reason', p_reason, true);

    WITH RECURSIVE dependents AS (
        SELECT r.target_artifact_id AS id
        FROM public.artifact_relationships r
        WHERE r.source_artifact_id = p_artifact_id
          AND r.relationship_type IN ('IMPLEMENTS', 'HAS_ACCEPTANCE_CRITERIA')
        UNION
        SELECT r.target_artifact_id
        FROM public.artifact_relationships r
        JOIN dependents d ON r.source_artifact_id = d.id
        WHERE r.relationship_type IN ('IMPLEMENTS', 'HAS_ACCEPTANCE_CRITERIA')
    )
    UPDATE public.artifacts a
    SET status = 'NEEDS_REVIEW',
        updated_by = NULL
    FROM dependents d
    WHERE a.id = d.id
      AND a.status = 'APPROVED'
      AND a.deleted_at IS NULL;

    PERFORM set_config('app.change_reason', COALESCE(v_previous_reason, ''), true);
END;
$$;

REVOKE EXECUTE ON FUNCTION mark_dependents_needs_review(UUID, TEXT) FROM PUBLIC;



CREATE FUNCTION artifacts_before_insert()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
    v_prefix TEXT;
    v_next INTEGER;
BEGIN
    IF NEW.status = 'APPROVED' THEN
        RAISE EXCEPTION 'Artifacts cannot be created as APPROVED; insert a row into approvals instead';
    END IF;

    v_prefix := CASE NEW.artifact_type
        WHEN 'PRD' THEN 'PRD'
        WHEN 'FUNCTIONAL_REQUIREMENT' THEN 'FR'
        WHEN 'NON_FUNCTIONAL_REQUIREMENT' THEN 'NFR'
        WHEN 'ASSUMPTION' THEN 'AS'
        WHEN 'OPEN_ISSUE' THEN 'OI'
        WHEN 'USER_STORY' THEN 'US'
        WHEN 'ACCEPTANCE_CRITERIA' THEN 'AC'
    END;

    INSERT INTO public.artifact_key_counters AS c (project_id, prefix, last_value)
    VALUES (NEW.project_id, v_prefix, 1)
    ON CONFLICT (project_id, prefix)
    DO UPDATE SET last_value = c.last_value + 1
    RETURNING last_value INTO v_next;

    NEW.display_key := v_prefix || '-' || lpad(v_next::TEXT, 3, '0');
    NEW.version := 1;
    NEW.deleted_at := NULL;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_artifacts_before_insert
BEFORE INSERT ON artifacts
FOR EACH ROW EXECUTE FUNCTION artifacts_before_insert();



CREATE FUNCTION artifacts_before_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF OLD.deleted_at IS NOT NULL THEN
        RAISE EXCEPTION 'Artifact % is deleted and cannot be changed', OLD.display_key;
    END IF;

    IF (NEW.id, NEW.project_id, NEW.artifact_type, NEW.display_key,
        NEW.version, NEW.created_by, NEW.created_at)
       IS DISTINCT FROM
       (OLD.id, OLD.project_id, OLD.artifact_type, OLD.display_key,
        OLD.version, OLD.created_by, OLD.created_at) THEN
        RAISE EXCEPTION 'id, project_id, artifact_type, display_key, version, created_by and created_at cannot be changed';
    END IF;

    -- Guard against accidental approval; the approvals trigger sets this flag
    IF NEW.status = 'APPROVED' AND OLD.status <> 'APPROVED'
       AND COALESCE(current_setting('app.approval_in_progress', true), '') <> 'on' THEN
        RAISE EXCEPTION 'Artifacts can only be approved by inserting a row into approvals';
    END IF;

    -- Any content change creates a new version that needs review again
    IF NEW.content IS DISTINCT FROM OLD.content OR NEW.title IS DISTINCT FROM OLD.title THEN
        NEW.version := OLD.version + 1;
        IF NEW.status = 'APPROVED' THEN
            NEW.status := 'NEEDS_REVIEW';
        END IF;
    END IF;

    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_artifacts_before_update
BEFORE UPDATE ON artifacts
FOR EACH ROW EXECUTE FUNCTION artifacts_before_update();



CREATE FUNCTION artifacts_after_write()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
    v_action TEXT;
    v_content_changed BOOLEAN;
    v_reason TEXT := NULLIF(current_setting('app.change_reason', true), '');
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.artifact_history
            (artifact_id, artifact_version, action, new_content, new_status, changed_by, reason)
        VALUES
            (NEW.id, NEW.version, 'CREATED', NEW.content, NEW.status, NEW.created_by, v_reason);
        RETURN NULL;
    END IF;

    v_content_changed := NEW.version <> OLD.version;

    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
        v_action := 'DELETED';
    ELSIF v_content_changed THEN
        v_action := 'UPDATED';
    ELSIF NEW.status <> OLD.status THEN
        v_action := 'STATUS_CHANGED';
    ELSE
        RETURN NULL;
    END IF;

    INSERT INTO public.artifact_history
        (artifact_id, artifact_version, action, old_content, new_content,
         old_status, new_status, changed_by, reason)
    VALUES
        (NEW.id, NEW.version, v_action,
         CASE WHEN v_content_changed THEN OLD.content END,
         CASE WHEN v_content_changed THEN NEW.content END,
         OLD.status, NEW.status, NEW.updated_by, v_reason);

    IF v_action IN ('UPDATED', 'DELETED') THEN
        PERFORM public.mark_dependents_needs_review(
            NEW.id,
            format('%s was %s (version %s)', NEW.display_key, lower(v_action), NEW.version)
        );
    END IF;

    RETURN NULL;
END;
$$;

CREATE TRIGGER trg_artifacts_after_write
AFTER INSERT OR UPDATE ON artifacts
FOR EACH ROW EXECUTE FUNCTION artifacts_after_write();



-- Direct DELETE is blocked (use deleted_at). Deleting a whole project
-- still works, because that delete arrives through the FK cascade.
CREATE FUNCTION artifacts_prevent_delete()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF pg_trigger_depth() <= 1 THEN
        RAISE EXCEPTION 'Artifacts are soft-deleted: set deleted_at instead of deleting the row';
    END IF;
    RETURN OLD;
END;
$$;

CREATE TRIGGER trg_artifacts_prevent_delete
BEFORE DELETE ON artifacts
FOR EACH ROW EXECUTE FUNCTION artifacts_prevent_delete();



-- =====================================================
-- TRIGGERS: relationships and approvals
-- =====================================================


CREATE FUNCTION validate_relationship()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
    v_source public.artifact_type;
    v_target public.artifact_type;
BEGIN
    SELECT artifact_type INTO v_source
    FROM public.artifacts
    WHERE id = NEW.source_artifact_id AND deleted_at IS NULL;

    SELECT artifact_type INTO v_target
    FROM public.artifacts
    WHERE id = NEW.target_artifact_id AND deleted_at IS NULL;

    IF v_source IS NULL OR v_target IS NULL THEN
        RAISE EXCEPTION 'Cannot link a deleted or missing artifact';
    END IF;

    IF NEW.relationship_type = 'IMPLEMENTS'
       AND NOT (v_source IN ('FUNCTIONAL_REQUIREMENT', 'NON_FUNCTIONAL_REQUIREMENT')
                AND v_target = 'USER_STORY') THEN
        RAISE EXCEPTION 'IMPLEMENTS must link a requirement (source) to a user story (target)';
    END IF;

    IF NEW.relationship_type = 'HAS_ACCEPTANCE_CRITERIA'
       AND NOT (v_source = 'USER_STORY' AND v_target = 'ACCEPTANCE_CRITERIA') THEN
        RAISE EXCEPTION 'HAS_ACCEPTANCE_CRITERIA must link a user story (source) to acceptance criteria (target)';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_relationship
BEFORE INSERT OR UPDATE ON artifact_relationships
FOR EACH ROW EXECUTE FUNCTION validate_relationship();



-- Validates who may decide, rejects decisions on outdated versions,
-- and updates the artifact status.
CREATE FUNCTION apply_approval()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
    v_artifact public.artifacts%ROWTYPE;
    v_role public.project_role;
BEGIN
    SELECT * INTO v_artifact
    FROM public.artifacts
    WHERE id = NEW.artifact_id
    FOR UPDATE;

    IF v_artifact.deleted_at IS NOT NULL THEN
        RAISE EXCEPTION 'Artifact % is deleted', v_artifact.display_key;
    END IF;

    IF NEW.artifact_version <> v_artifact.version THEN
        RAISE EXCEPTION 'Artifact % is at version %, not %: review the latest version',
            v_artifact.display_key, v_artifact.version, NEW.artifact_version;
    END IF;

    SELECT role INTO v_role
    FROM public.project_members
    WHERE project_id = v_artifact.project_id AND user_id = NEW.decided_by;

    IF v_role IS NULL THEN
        RAISE EXCEPTION 'User is not a member of this project';
    END IF;

    IF NEW.decision IN ('APPROVED', 'REJECTED') AND v_role <> 'PROJECT_MANAGER' THEN
        RAISE EXCEPTION 'Only the Project Manager can approve or reject artifacts';
    END IF;

    IF NEW.decision = 'REQUEST_CHANGES'
       AND v_role NOT IN ('PROJECT_MANAGER', 'SOFTWARE_ARCHITECT') THEN
        RAISE EXCEPTION 'Only the Project Manager or Software Architect can request changes';
    END IF;

    IF NEW.decision = 'REQUEST_CHANGES' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('app.approval_in_progress', 'on', true);

    UPDATE public.artifacts
    SET status = CASE NEW.decision
                     WHEN 'APPROVED' THEN 'APPROVED'::public.artifact_status
                     ELSE 'REJECTED'::public.artifact_status
                 END,
        updated_by = NEW.decided_by
    WHERE id = NEW.artifact_id;

    PERFORM set_config('app.approval_in_progress', 'off', true);

    RETURN NULL;
END;
$$;

CREATE TRIGGER trg_apply_approval
AFTER INSERT ON approvals
FOR EACH ROW EXECUTE FUNCTION apply_approval();



-- =====================================================
-- VIEWS
-- =====================================================


-- Phase 1 -> Phase 2 gate: PRD, stories and criteria approved,
-- and nothing left in DRAFT or NEEDS_REVIEW
CREATE VIEW phase1_gate_status
WITH (security_invoker = true)
AS
SELECT
    p.id AS project_id,
    COUNT(*) FILTER (WHERE a.artifact_type = 'PRD' AND a.status = 'APPROVED') > 0
        AS prd_approved,
    COUNT(*) FILTER (WHERE a.artifact_type = 'USER_STORY' AND a.status = 'APPROVED')
        AS approved_stories,
    COUNT(*) FILTER (WHERE a.artifact_type = 'ACCEPTANCE_CRITERIA' AND a.status = 'APPROVED')
        AS approved_criteria,
    COUNT(*) FILTER (WHERE a.status IN ('DRAFT', 'NEEDS_REVIEW'))
        AS pending_artifacts,
    (
        COUNT(*) FILTER (WHERE a.artifact_type = 'PRD' AND a.status = 'APPROVED') > 0
        AND COUNT(*) FILTER (WHERE a.artifact_type = 'USER_STORY' AND a.status = 'APPROVED') > 0
        AND COUNT(*) FILTER (WHERE a.artifact_type = 'ACCEPTANCE_CRITERIA' AND a.status = 'APPROVED') > 0
        AND COUNT(*) FILTER (WHERE a.status IN ('DRAFT', 'NEEDS_REVIEW')) = 0
    ) AS ready_for_phase2
FROM projects p
LEFT JOIN artifacts a
    ON a.project_id = p.id
   AND a.deleted_at IS NULL
GROUP BY p.id;



-- =====================================================
-- ROW LEVEL SECURITY
-- Members can read their projects; clients cannot write
-- (the backend uses the service role, which bypasses RLS)
-- =====================================================


CREATE FUNCTION is_project_member(p_project_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.project_members
        WHERE project_id = p_project_id
          AND user_id = (SELECT auth.uid())
    );
$$;


CREATE FUNCTION can_read_artifact(p_artifact_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.artifacts a
        JOIN public.project_members m ON m.project_id = a.project_id
        WHERE a.id = p_artifact_id
          AND m.user_id = (SELECT auth.uid())
    );
$$;


CREATE FUNCTION shares_project_with(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.project_members mine
        JOIN public.project_members theirs ON theirs.project_id = mine.project_id
        WHERE mine.user_id = (SELECT auth.uid())
          AND theirs.user_id = p_user_id
    );
$$;


ALTER TABLE users                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects               ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members        ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifact_key_counters  ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifact_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals              ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifact_history       ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_checks         ENABLE ROW LEVEL SECURITY;


CREATE POLICY users_read ON users
FOR SELECT TO authenticated
USING (id = (SELECT auth.uid()) OR shares_project_with(id));

CREATE POLICY projects_read ON projects
FOR SELECT TO authenticated
USING (is_project_member(id));

CREATE POLICY project_members_read ON project_members
FOR SELECT TO authenticated
USING (is_project_member(project_id));

CREATE POLICY artifacts_read ON artifacts
FOR SELECT TO authenticated
USING (is_project_member(project_id));

CREATE POLICY relationships_read ON artifact_relationships
FOR SELECT TO authenticated
USING (is_project_member(project_id));

CREATE POLICY approvals_read ON approvals
FOR SELECT TO authenticated
USING (can_read_artifact(artifact_id));

CREATE POLICY history_read ON artifact_history
FOR SELECT TO authenticated
USING (can_read_artifact(artifact_id));

CREATE POLICY quality_read ON quality_checks
FOR SELECT TO authenticated
USING (can_read_artifact(artifact_id));

-- artifact_key_counters: no policy, internal to the database



-- =====================================================
-- END OF PHASE 1 SPRINT 1 SCHEMA
-- =====================================================
