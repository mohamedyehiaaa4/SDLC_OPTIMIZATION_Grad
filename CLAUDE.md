# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Repository state

This is a graduation project ("RepoMind": a repository-intelligent AI platform for SDLC assistance) in its **pre-implementation** stage. There is no source code, build system, or test suite yet, so there are no build/lint/test commands. Update this file with real commands once a stack is chosen and scaffolded.

The authoritative spec for the current work is `phase_1_planning_requirements_final_latest.md` (Phase 1: Planning and Requirements). Read it before designing or implementing anything in Phase 1. Per `AGENTS.md`, it is a private planning document: do not commit it, and do not copy its detailed requirements into tracked files (including this one).

## Phase 1 architecture (big picture)

The core rule: **AI proposes → authorized human reviews → Project Manager approves → approved artifacts are persisted → dependent work becomes eligible.** AI components never approve their own output and never get unrestricted database or Jira access.

Layering (framework choices are recommended, not frozen — LangGraph for orchestration and PostgreSQL for persistence are candidates; pgvector is optional):

```
Web/Chat UI → Planning Orchestrator (workflow state, approval gates)
            → AI agents (draft/analyze only)
            → Application services (permissions, validation, persistence, history, traceability, stale flags)
            → Project Intelligence Memory (consumed by Phase 2)
```

Keep these concerns in separate modules — AI generation, persistence, workflow control, and external integrations. Suggested layout: `app/planning/{workflow,agents_or_capabilities,services,repositories,schemas,tools,api}`, `app/integrations/jira`, `app/project_memory` (names are flexible).

Current agent structure (the spec's final section, §13, is the latest decision and supersedes the earlier grouping in §6):

- Planning Orchestrator — controls state and gates; makes no business-content decisions
- Requirements Discovery Agent, Requirements Authoring Agent, Story & Acceptance Criteria Agent
- Planning Agent with two nodes: Sprint Planning and Task Assignment
- Non-agents: application/planning services, persistence layer, and the **Jira Integration Service, which is deterministic backend code, not an AI agent**
- There is no separate Quality Evaluator agent; quality checks are automatic and passing them never approves an artifact

Invariants to preserve in any implementation:

- Workflow state references persisted artifacts by ID; workflow memory is not the source of truth.
- Only the Project Manager edits/approves planning artifacts; the Software Architect can review and suggest but not edit or approve.
- Material upstream edits mark dependent downstream artifacts as needing re-review (requirement → story → acceptance-criteria traceability).
- Jira is optional. Every Jira write requires a preview plus explicit PM confirmation; Jira refresh is manual and yields a fresh proposal before further writes.
- Credentials/integration tokens must never be placed in model prompts.
- No false-success states: model failures, invalid structured output, Jira partial success, etc. must surface explicitly.
