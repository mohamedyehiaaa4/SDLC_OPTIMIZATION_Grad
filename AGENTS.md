# Agent Guidance

Use relevant installed skills automatically when the task matches their scope. Do not require the user to name a skill explicitly.

## Skill routing

- Use `planning-and-task-breakdown` for large features, implementation plans, milestones, and work decomposition.
- Use `improve-codebase-architecture` when reviewing or restructuring code architecture, if that skill is available in the current environment.
- Use `supabase` for any task involving Supabase products, configuration, authentication, database access, storage, APIs, or integrations.
- Use `supabase-postgres-best-practices` alongside `supabase` when designing or reviewing PostgreSQL schemas, queries, indexes, migrations, RLS, or performance.
- Use `obsidian-vault` only when the task involves an Obsidian vault, notes, wikilinks, or knowledge organization.
- Use `find-skills` when the required capability is missing or the user asks whether another suitable skill exists.

Apply only the skills relevant to the current task. Follow each selected skill's instructions and avoid invoking unrelated skills.

## Confidentiality

Do not add private business requirements, planning documents, credentials, secrets, or internal operational data to version control.
