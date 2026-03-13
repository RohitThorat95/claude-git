# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup       # Initial setup: install deps, generate Prisma client, migrate DB
npm run dev         # Start dev server with Turbopack
npm run build       # Production build
npm run lint        # ESLint
npm run test        # Run Vitest tests
npm run db:reset    # Reset database (destructive)
```

Run a single test file: `npx vitest run src/path/to/file.test.ts`

## Architecture

**UIGen** is an AI-powered React component generator with live preview. Users describe components in chat, Claude generates code using tool calls, and the result renders in a live preview — all without writing files to disk.

### Request Flow

1. Chat message → `POST /api/chat` ([src/app/api/chat/route.ts](src/app/api/chat/route.ts))
2. Route streams a Claude response using the Vercel AI SDK with two tools:
   - `str_replace_editor` — create/view/edit/insert text in virtual files
   - `file_manager` — rename/delete files and directories
3. Tool calls update the **virtual file system** (in-memory, no disk writes)
4. If user is authenticated, the project (messages + file system) is persisted to SQLite via Prisma
5. Client receives streaming response; `FileSystemProvider` updates state, triggering live preview

### Virtual File System

[src/lib/file-system.ts](src/lib/file-system.ts) — an in-memory tree structure that is serializable to JSON for database persistence. The AI always generates `/App.jsx` as the entry point and uses `@/` import aliases for inter-file imports.

### State Management

Two React contexts drive the UI:
- `ChatProvider` ([src/lib/contexts/chat-context.tsx](src/lib/contexts/chat-context.tsx)) — chat messages, streaming state, API calls
- `FileSystemProvider` ([src/lib/contexts/file-system-context.tsx](src/lib/contexts/file-system-context.tsx)) — virtual file system state shared between editor, file tree, and preview

### AI Provider

[src/lib/provider.ts](src/lib/provider.ts) — returns the Anthropic provider (claude-haiku-4-5) when `ANTHROPIC_API_KEY` is set, otherwise falls back to a mock language model so the UI works without an API key.

### Authentication

JWT-based (HS256, 7-day expiry) stored in httpOnly cookies. [src/middleware.ts](src/middleware.ts) protects routes; [src/actions/index.ts](src/actions/index.ts) handles signup/signin/signout as server actions.

### Database

Prisma + SQLite. Schema: `User` (id, email, password) has many `Project` (id, name, messages JSON, data JSON). Run `npx prisma studio` to inspect data.

### System Prompt

[src/lib/prompts/generation.tsx](src/lib/prompts/generation.tsx) — instructs Claude to keep responses brief, use Tailwind CSS, always produce `/App.jsx` as the entry point, and use `@/` aliases for non-library imports.
