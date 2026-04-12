# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Run all Vitest tests
npm run setup        # Install deps + Prisma generate + migrate
npm run db:reset     # Reset database
```

**Run a single test file:**
```bash
npm test -- src/lib/__tests__/file-system.test.ts
```

## Architecture Overview

UIGen is an AI-powered React component generator. Users describe components in natural language; Claude generates code that renders live in an iframe — no files are written to disk.

### Request Flow

1. User types in `ChatInterface` → POST to `/api/chat/route.ts`
2. Route calls Claude (`claude-haiku-4-5`) with the current virtual file system state as context
3. Claude responds with tool calls:
   - `str_replace_editor` (`lib/tools/str-replace.ts`): create/view/edit files
   - `file_manager` (`lib/tools/file-manager.ts`): file operations
4. Tool results update `FileSystemContext` (`lib/contexts/file-system-context.tsx`)
5. `PreviewFrame` re-renders the iframe, which compiles JSX client-side via `@babel/standalone`

### Key Abstractions

- **`lib/file-system.ts`** — `VirtualFileSystem` class: in-memory tree of files; all file mutations go through this class
- **`lib/transform/jsx-transformer.ts`** — Converts the virtual FS contents into a self-contained HTML blob the iframe can run
- **`lib/contexts/`** — Two React contexts thread state through the app: `ChatContext` (messages, streaming state) and `FileSystemContext` (file tree, active file)
- **`lib/prompts/generation.tsx`** — System prompt sent to Claude; controls how it uses the editor tools
- **`lib/provider.ts`** — Single place that sets the Claude model (`claude-haiku-4-5`) and exports the AI provider instance

### UI Layout

`app/main-content.tsx` renders a 3-panel resizable layout (react-resizable-panels):
- Left (35%): `ChatInterface` with streaming message list
- Right top (65%): `PreviewFrame` (iframe live preview)
- Right bottom: `CodeEditor` (Monaco) + `FileTree` in a tabbed view

### Auth & Persistence

- Auth uses JWT (`jose`) stored in cookies; middleware (`src/middleware.ts`) guards API routes
- Passwords hashed with `bcrypt`
- Server actions in `actions/` handle sign-up/sign-in and Prisma mutations
- Authenticated users: projects saved to SQLite (Prisma) after each chat turn
- Anonymous users: tracked in `localStorage` via `anon-work-tracker.ts`

### Database

Prisma with SQLite. Schema has two models: `User` and `Project`. Run `npm run setup` after pulling changes that include new migrations.

## Environment

Requires `ANTHROPIC_API_KEY` in `.env`. The app falls back gracefully if absent (mock responses in dev).

## Tech Stack

- **Next.js 15** (App Router, Server Actions), **React 19**, **TypeScript**
- **Vercel AI SDK** (`ai` package) — streaming, `useChat` hook, tool-call parsing
- **Tailwind CSS v4**, **Radix UI** primitives, **shadcn/ui** components
- **Monaco Editor** for code display, **Babel standalone** for client-side JSX compilation
- **Vitest** + **React Testing Library** for tests; jsdom environment
- Path alias: `@/*` → `src/*`
