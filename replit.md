# AI Code Generation Agent

## Overview

An intelligent AI coding agent web application that helps users generate professional code through natural language conversations. The application specializes in modern web development with React, Next.js, Tailwind CSS, Node.js, and includes the ability to analyze design screenshots (Figma/mockups) and convert them into working code. Built as a three-panel productivity tool featuring chat interface, code editor, and live preview capabilities.

## Recent Changes (November 4, 2025)

**Major Enhancements - Full Week + Month Sprint Completed:**

1. **PostgreSQL Database Migration** ✅
   - Migrated from in-memory storage (MemStorage) to production PostgreSQL database
   - Implemented DbStorage class with full Drizzle ORM integration
   - Schema pushed to database with proper indexes and foreign keys
   - Automatic fallback to MemStorage if DATABASE_URL not available

2. **Keyboard Shortcuts System** ✅
   - Comprehensive keyboard shortcuts hook (useKeyboardShortcuts)
   - Command Palette (Ctrl+K) with fuzzy search and keyboard navigation
   - Global shortcuts: Ctrl+/ (chat), Ctrl+S (save), Ctrl+P (preview), Ctrl+B (editor), Ctrl+Shift+E (export)
   - Extensible command system for future features

3. **Enhanced Error Handling** ✅
   - ErrorBoundary component for graceful error recovery
   - Toast notifications for user feedback
   - Proper error messages throughout the application
   - Prevents app crashes and improves stability

4. **Git Integration (Basic)** ⚠️
   - Git status, commits history, and branches endpoints
   - Frontend GitClient for Git operations
   - **Note**: Currently uses file versions as commit history
   - **Scope**: Basic implementation, not production Git - suitable for version tracking
   - **Future**: Can be extended with real Git repository integration

5. **Code Quality Tools** ✅
   - ESLint configuration with TypeScript and React rules
   - Prettier for consistent code formatting
   - Pre-configured rules for best practices

6. **Caching Layer** ✅
   - CacheManager with localStorage, sessionStorage, and memory support
   - TTL-based expiration
   - useCachedQuery hook for optimized data fetching
   - Reduces API calls and improves performance

## Recent Changes (Prior Updates)

**Project Analysis Feature**
- Added `/api/analyze-project` endpoint that scans project files to detect:
  - Framework (React/Next.js/Vue)
  - Language (JavaScript/TypeScript)
  - Styling solutions (Tailwind CSS, Styled Components, Emotion)
  - Libraries and dependencies (TanStack Query, Wouter, shadcn/ui, Framer Motion, Lucide Icons)
  - Component patterns and state management
  - File structure and directory organization
- Created modal UI in Header component to display analysis results
- Analysis results used to inform AI code generation for better consistency

**Multi-Solution Comparison System**
- Extended message schema with optional `metadata` field (JSON text) for storing solution options
- Updated `chatWithAI` function to return `{ response: string; metadata?: string }` object
- Enhanced SYSTEM_PROMPT with multi-solution guidelines and project analysis context
- Created SolutionOptions component to render interactive solution comparison cards with:
  - Complexity levels (simple, moderate, advanced)
  - Pros and cons for each approach
  - Clear recommendations
  - Selection buttons for user choice
- Updated `/api/chat` endpoint to persist metadata from AI responses
- ChatInterface component parses metadata and displays solution cards when available

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
- Intelligent project analysis: Analyzes codebase to detect framework, language, styling, libraries, and patterns
- Multi-solution recommendations: AI presents 2-3 solution options with pros/cons when multiple approaches exist

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
- AI operations: `/api/generate`, `/api/chat`, `/api/analyze-design`, `/api/analyze-project`

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
- `messages` table: Maintains conversation history per project with optional metadata field for solution options
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
- Functions: code generation, chat conversations, design analysis, project analysis
- System prompts configure AI as full-stack web development expert with project analysis awareness
- Response format: Structured JSON with file arrays, explanations, and optional solution metadata
- Multi-solution capability: AI can present 2-3 options with complexity levels and trade-offs

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