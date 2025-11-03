# Design Guidelines: AI Code Generation Agent Interface

## Design Approach

**Selected Approach:** Design System + Reference-Based Hybrid

Drawing inspiration from modern developer tools (Replit, VS Code, Linear, Cursor) while maintaining originality. This is a **utility-focused, productivity application** requiring clarity, efficiency, and professional polish.

**Key Design Principles:**
1. **Information Hierarchy:** Clear visual separation between chat, code, and preview areas
2. **Spatial Efficiency:** Maximize usable workspace while maintaining breathing room
3. **Professional Polish:** Crisp, modern interface that inspires confidence
4. **Functional Beauty:** Every element serves a clear purpose

---

## Layout System

### Spacing Primitives
Use Tailwind spacing units: **2, 3, 4, 6, 8, 12, 16**
- Component padding: p-4, p-6
- Section margins: my-6, my-8
- Tight spacing: gap-2, gap-3
- Generous spacing: gap-8, gap-12

### Core Layout Structure

**Three-Panel Application Layout:**

```
┌─────────────────────────────────────────────┐
│  Header (h-14)                              │
├────────┬──────────────────┬─────────────────┤
│ Side   │  Main Workspace  │  Preview Panel  │
│ Panel  │  (Editor/Chat)   │  (Collapsible)  │
│ (w-64) │                  │  (w-1/2)        │
│        │                  │                 │
└────────┴──────────────────┴─────────────────┘
```

**Responsive Breakpoints:**
- Desktop (lg+): Three-panel layout
- Tablet (md): Two-panel, collapsible preview
- Mobile: Single panel with tab navigation

### Grid System
- Main container: max-w-screen-2xl mx-auto
- Content areas: Natural flow, no forced viewport heights
- Panel divisions: flex with appropriate min/max widths

---

## Typography

### Font Families
**Primary (UI):** Inter or System UI stack
**Code:** JetBrains Mono or Fira Code (monospace)

### Type Scale

**Headers:**
- H1: text-2xl font-bold (Page titles, rarely used)
- H2: text-xl font-semibold (Section headers)
- H3: text-lg font-medium (Panel titles)
- H4: text-base font-medium (Component headers)

**Body Text:**
- Base: text-sm (Primary interface text)
- Small: text-xs (Labels, metadata)
- Code: font-mono text-sm (Code editor, file names)

**Chat Interface:**
- User message: text-sm font-medium
- AI response: text-sm leading-relaxed
- System messages: text-xs

### Text Hierarchy
- All-caps for labels: uppercase tracking-wide text-xs
- Medium weight for interactive elements
- Regular weight for body content
- Monospace for all file paths, code snippets, technical terms

---

## Component Library

### Header Component (h-14)
**Structure:**
- Logo/Brand (left): text-lg font-bold
- Project name (center): text-sm truncate max-w-xs
- Actions (right): Icon buttons in gap-2 arrangement
- Border separator at bottom: border-b

**Elements:**
- New Project button
- Settings icon
- API status indicator
- User menu (if applicable)

### Sidebar File Explorer (w-64, min-w-[240px])
**Structure:**
- Sticky header with "Files" title and action buttons
- Scrollable file tree area (overflow-y-auto)
- Resizable handle on right edge

**File Tree:**
- Nested indentation: pl-4 per level
- File item height: h-7
- Folder/file icon + name layout: flex items-center gap-2
- Hover state for entire row
- Selected file indicator (left border or background)

**Actions:**
- New file/folder icons (top right of sidebar header)
- Context menu on right-click
- Drag-and-drop reordering (visual)

### Main Workspace Area
**Dual Mode: Chat or Editor**

**Chat Mode:**
- Message container: space-y-4 p-6
- Message bubbles: max-w-3xl mx-auto
- User messages: ml-auto (right-aligned)
- AI responses: mr-auto (left-aligned)
- Input area (fixed bottom): sticky bottom-0 with border-t
- Input field: min-h-[120px] with auto-expand
- Send button: absolute bottom-3 right-3

**Editor Mode:**
- Full-height code editor container
- Tab bar for open files: h-10 border-b
- File tabs: px-4 py-2 with close button
- Editor area: Syntax highlighting, line numbers
- Status bar (bottom): h-8 border-t with file info

**Tab Navigation:**
- Chat/Editor toggle (if both visible)
- Subtle indicator for active mode

### Preview Panel (Collapsible)
**Structure:**
- Header: h-10 with "Preview" title and controls
- Device frame selector: Desktop/Tablet/Mobile icons
- Refresh/Open in new tab buttons
- Iframe container: w-full h-full border-l
- Resize handle on left edge
- Collapsible: Can hide to maximize editor space

**Preview Controls:**
- Device width presets: gap-1 icon buttons
- URL bar (read-only) showing current page
- Responsive iframe with proper scaling

### Templates Modal
**Structure:**
- Full-screen overlay or large centered modal
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Template cards: aspect-video preview + metadata

**Template Card:**
- Thumbnail image/gradient
- Title: text-base font-semibold
- Description: text-xs line-clamp-2
- Tags: flex gap-1 with small pills
- "Use Template" button on hover/always visible

**Template Categories:**
- E-commerce Store
- Landing Page
- News/Blog Site
- Dashboard/Admin
- Portfolio
- Custom (blank)

### Code Editor Component
**Features:**
- Line numbers (w-12 text-right pr-3)
- Syntax highlighting (use Monaco Editor or CodeMirror)
- Auto-completion dropdown
- Error/warning indicators in gutter
- Minimap (optional, on right): w-20

### Chat Message Components
**AI Message:**
- Avatar/icon (left): w-8 h-8 rounded-full
- Content area: flex-1 space-y-2
- Code blocks: Syntax highlighted, copy button
- Inline code: px-1.5 py-0.5 rounded font-mono text-xs
- Thinking indicator: Animated dots during generation

**User Message:**
- Simpler layout, right-aligned
- No avatar needed
- Rounded container: px-4 py-2 rounded-2xl

### Figma Import Component
**Structure:**
- Drag-and-drop zone: border-2 border-dashed p-12 rounded-lg
- "Upload Figma Design" heading
- File input or image paste area
- Preview thumbnails: grid-cols-2 md:grid-cols-4 gap-4
- "Analyze Design" action button

**Analysis Results:**
- Detected components list
- Suggested code structure
- "Generate Code" primary action

### Action Buttons
**Primary:** Prominent, used for main actions (Send, Generate, Create)
- Size: px-6 py-2.5 rounded-lg
- Typography: text-sm font-medium

**Secondary:** Used for auxiliary actions (Cancel, Reset)
- Size: px-4 py-2 rounded-md
- Typography: text-sm font-normal

**Icon Buttons:** Square, for toolbars
- Size: w-9 h-9 or w-8 h-8
- Rounded: rounded-md
- Icons: w-5 h-5 or w-4 h-4

### Context Menu
**Structure:**
- Dropdown: min-w-[180px] rounded-lg shadow-lg
- Menu items: h-9 px-3 flex items-center gap-3
- Icons (left): w-4 h-4
- Keyboard shortcuts (right): text-xs
- Dividers: my-1 border-t

### Status Indicators
**API Connection:**
- Dot indicator: w-2 h-2 rounded-full
- Label: text-xs
- States: Connected/Disconnected/Error

**File Status:**
- Modified indicator: Small dot next to file name
- Saving animation: Subtle pulse

---

## Navigation Patterns

**Primary Navigation:** Sidebar file tree
**Secondary Navigation:** Tab bar for open files
**Tertiary Navigation:** Breadcrumbs (if nested folders)

**Keyboard Shortcuts:**
- Display shortcuts in tooltips: text-xs
- Global shortcut palette: Cmd/Ctrl+K pattern

---

## Forms & Inputs

### Text Input Fields
- Height: h-10
- Padding: px-3
- Border: border rounded-md
- Focus state: Visible ring or border change

### Textarea (Chat Input)
- Min height: min-h-[120px]
- Max height: max-h-[300px] with scroll
- Padding: p-3
- Auto-resize as user types

### Select Dropdowns
- Height: h-10
- Chevron icon (right)
- Custom styled or use Headless UI

### Checkboxes/Radio
- Size: w-4 h-4
- Spacing: gap-2 with label

---

## Special UI Elements

### Loading States
- Skeleton screens for file tree
- Shimmer effect for loading content
- Spinner for active operations (w-5 h-5)

### Toast Notifications
- Position: fixed top-4 right-4
- Width: max-w-sm
- Auto-dismiss: 3-5 seconds
- Stack multiple toasts: space-y-2

### Empty States
- Centered icon (w-16 h-16)
- Heading: text-lg font-medium
- Description: text-sm max-w-md
- Call-to-action button

### Error States
- Inline validation messages: text-xs mt-1
- Error icons: w-4 h-4 inline
- Full-page errors: Centered with retry button

---

## Images

**No images needed for this application UI.** This is a code editor interface focused on functionality. All visual elements are UI components and icons.

**Icons:** Use Heroicons (outline for inactive, solid for active states)

---

## Accessibility

- All interactive elements: Proper focus states with visible ring
- Icon buttons: Include aria-labels
- Keyboard navigation: Full support with visible focus indicators
- Screen reader: Semantic HTML, ARIA labels where needed
- Form inputs: Associated labels (even if visually hidden)
- Contrast: Ensure all text meets WCAG AA standards

---

## Animations

**Minimal, purposeful animations:**
- Panel resize: Smooth transition (transition-all duration-200)
- Modal/dropdown entry: Fade + scale (duration-150)
- Tab switching: Crossfade (duration-100)
- File tree expansion: Slide down (duration-200)
- No decorative animations

**Avoid:**
- Scroll-triggered animations
- Parallax effects
- Excessive transitions on every interaction

---

## Quality Standards

- **Pixel-perfect alignment:** Use Tailwind's spacing system consistently
- **Visual hierarchy:** Clear distinction between primary, secondary, tertiary elements
- **Whitespace:** Generous breathing room between sections (p-6, p-8)
- **Consistency:** Same patterns for similar components across the app
- **Professional polish:** Crisp borders, proper shadows, refined details