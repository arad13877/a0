# AI Code Generation Agent

## Overview

An intelligent AI coding agent web application that helps users generate professional code through natural language conversations. The application specializes in modern web development with React, Next.js, Tailwind CSS, Node.js, and includes the ability to analyze design screenshots (Figma/mockups) and convert them into working code. Built as a three-panel productivity tool featuring chat interface, code editor, and live preview capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching

**UI Component System**
- shadcn/ui components built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Custom CSS variables for theming (light/dark mode support)
- Design system follows "New York" style variant
- Spacing system uses standardized Tailwind units (2, 3, 4, 6, 8, 12, 16)

**Layout System**
- Three-panel application layout:
  - Left sidebar: File explorer and project navigation (w-64)
  - Center workspace: Code editor or chat interface (flexible)
  - Right panel: Collapsible live preview (w-1/2)
- Responsive breakpoints for desktop (lg+), tablet (md), and mobile
- Component-based architecture with reusable UI elements

**Key Features**
- Real-time chat interface for AI interactions
- Multi-tab code editor with syntax highlighting
- Responsive preview panel with device simulation (desktop/tablet/mobile)
- Drag-and-drop file upload for design analysis
- Project templates system (e-commerce, landing page, dashboard, etc.)

### Backend Architecture

**Runtime & Framework**
- Node.js with Express.js REST API
- TypeScript throughout for type safety
- ES modules (type: "module")

**API Design**
- RESTful endpoints under `/api` namespace
- Project CRUD operations: `/api/projects`, `/api/projects/:id`
- File management: `/api/projects/:id/files`
- Message history: `/api/projects/:id/messages`
- AI operations: `/api/generate`, `/api/chat`, `/api/analyze-design`

**Request/Response Handling**
- JSON body parsing with raw buffer capture for webhook verification
- Express middleware for request logging and timing
- Centralized error handling with appropriate HTTP status codes

**Storage Layer**
- Abstracted storage interface (IStorage) for flexibility
- In-memory storage implementation (MemStorage) as default
- Prepared for PostgreSQL integration via Drizzle ORM
- Schema defines projects, files, and messages with foreign key relationships

### Data Storage Solutions

**Database Schema (Drizzle ORM)**
- `projects` table: Stores project metadata (name, description, template)
- `files` table: Contains generated code files with project association
- `messages` table: Maintains conversation history per project
- Timestamps for created_at and updated_at tracking

**Schema Validation**
- Zod schemas for runtime validation
- Type inference from Drizzle schema for TypeScript integration
- Insert schemas omit auto-generated fields (id, timestamps)

**Migration Strategy**
- Drizzle Kit configured for PostgreSQL dialect
- Migrations output to `./migrations` directory
- Schema source at `./shared/schema.ts`
- Database URL from environment variable

**Current State**
- In-memory storage active for development
- PostgreSQL connection configured via @neondatabase/serverless
- Prepared for production database migration

### External Dependencies

**AI Service Integration**
- Google Gemini AI via @google/genai SDK
- API key required via GEMINI_API_KEY environment variable
- Functions: code generation, chat conversations, design analysis
- System prompts configure AI as full-stack web development expert
- Response format: Structured JSON with file arrays and explanations

**Database Service**
- Neon PostgreSQL (serverless) via @neondatabase/serverless
- Connection pooling for serverless environments
- DATABASE_URL environment variable required
- Drizzle ORM as the query builder and migration tool

**Session Management**
- connect-pg-simple for PostgreSQL session storage (prepared)
- Session configuration ready for production deployment

**Development Tools**
- Replit-specific plugins for development environment:
  - @replit/vite-plugin-runtime-error-modal
  - @replit/vite-plugin-cartographer
  - @replit/vite-plugin-dev-banner
- Conditional loading based on NODE_ENV and REPL_ID

**Build & Development**
- tsx for TypeScript execution in development
- esbuild for server-side bundling (production builds)
- Custom fonts: Inter (UI) and JetBrains Mono (code)

### Configuration Files

**Path Aliases**
- `@/*` → `./client/src/*`
- `@shared/*` → `./shared/*`
- `@assets/*` → `./attached_assets/*`

**Build Output**
- Frontend: `dist/public`
- Backend: `dist/index.js`
- Shared types available across client and server