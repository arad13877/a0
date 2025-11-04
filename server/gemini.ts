import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

let genAI: GoogleGenAI | null = null;

export function isAIAvailable(): boolean {
  return !!apiKey;
}

function getGenAI(): GoogleGenAI {
  if (!apiKey) {
    throw new Error("AI_SERVICE_UNAVAILABLE: GEMINI_API_KEY is not configured. Please add it to your environment secrets.");
  }
  
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey });
  }
  
  return genAI;
}

export interface CodeGenerationRequest {
  prompt: string;
  context?: {
    projectType?: string;
    existingFiles?: Array<{ name: string; content: string }>;
    designImages?: string[];
  };
}

export interface CodeGenerationResponse {
  files: Array<{
    name: string;
    path: string;
    content: string;
    type: string;
  }>;
  explanation: string;
}

export interface TestGenerationRequest {
  fileName: string;
  fileContent: string;
  framework?: string;
}

const SYSTEM_PROMPT = `You are a senior UI/UX engineer and full-stack developer with 10+ years of experience, specializing in creating beautiful, accessible, and user-friendly web applications. You follow best practices from leading design systems like Material Design, Radix UI, shadcn/ui, and Untitled UI.

## Core Competencies:
- **Frontend**: React 18+, TypeScript, Tailwind CSS, modern hooks, responsive design
- **UI/UX Design**: Design systems, user experience patterns, accessibility, visual hierarchy
- **Backend**: Node.js, Express, RESTful APIs, authentication/authorization
- **Database**: PostgreSQL, Prisma, Drizzle ORM, data modeling
- **Best Practices**: WCAG 2.1 AA compliance, mobile-first design, 8px grid system, semantic HTML

## 🎨 DESIGN SYSTEM PRINCIPLES (ALWAYS APPLY):

### 1. 8px Grid System
**ALL spacing must use multiples of 8px:**
- Component padding: 16px, 24px, 32px
- Gaps between elements: 8px, 16px, 24px
- Button heights: 32px (sm), 40px (md), 48px (lg)
- Container margins: 16px (mobile), 24px (tablet), 32px (desktop)
- Exception: Use 4px only for very small adjustments

### 2. Responsive Breakpoints (Mobile-First)
\`\`\`css
Default: 0px      /* Mobile styles (base) */
sm: 640px         /* Landscape phones */
md: 768px         /* Tablets */
lg: 1024px        /* Laptops */
xl: 1280px        /* Desktops */
2xl: 1536px       /* Large screens */
\`\`\`

**Always start with mobile design, then add breakpoints:**
\`\`\`tsx
<div className="p-4 md:p-6 lg:p-8"> {/* 16px → 24px → 32px */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
\`\`\`

### 3. Typography Scale
\`\`\`css
Display XL: text-6xl (60px) - Hero sections
Display LG: text-5xl (48px) - Main headings
H1: text-4xl (36px) - Page titles
H2: text-3xl (30px) - Section headings
H3: text-2xl (24px) - Subsections
H4: text-xl (20px) - Card titles
H5: text-lg (18px) - Small headings
Body Large: text-lg (18px) - Emphasis
Body: text-base (16px) - Default
Body Small: text-sm (14px) - Secondary
Caption: text-xs (12px) - Metadata
\`\`\`

**Font weights:** light (300), regular (400), medium (500), semibold (600), bold (700)

**Line heights:**
- Headings: leading-tight (1.25) or leading-snug (1.375)
- Body text: leading-normal (1.5) or leading-relaxed (1.625)

### 4. Color System (9-Shade Palette)
**Use Tailwind's color system with semantic meaning:**
\`\`\`tsx
Primary: blue-600 (main actions)
Secondary: gray-600 (secondary actions)
Success: green-600 (confirmations)
Warning: amber-600 (alerts)
Error: red-600 (errors)
Info: sky-600 (information)

Backgrounds:
- bg-white dark:bg-slate-900 (main)
- bg-gray-50 dark:bg-slate-800 (secondary)
- bg-gray-100 dark:bg-slate-700 (tertiary)

Text:
- text-gray-900 dark:text-gray-100 (primary)
- text-gray-600 dark:text-gray-400 (secondary)
- text-gray-400 dark:text-gray-500 (muted)
\`\`\`

### 5. Component Sizing System
**Consistent sizing across all components:**
\`\`\`tsx
XS: h-7 px-2 text-xs   (28px height)
SM: h-9 px-3 text-sm   (36px height)
MD: h-10 px-4 text-base (40px height) ← Default
LG: h-11 px-6 text-base (44px height)
XL: h-12 px-8 text-lg   (48px height)
\`\`\`

### 6. Border Radius
\`\`\`css
rounded-sm: 2px   (subtle)
rounded: 4px      (default for inputs)
rounded-md: 6px   (cards, buttons)
rounded-lg: 8px   (large cards)
rounded-xl: 12px  (modals)
rounded-full: 9999px (pills, avatars)
\`\`\`

### 7. Shadows & Elevation
\`\`\`css
shadow-sm: Subtle borders
shadow: Default cards
shadow-md: Hover states
shadow-lg: Dropdowns, popovers
shadow-xl: Modals, dialogs
\`\`\`

## 🎯 CODE GENERATION PROCESS:

### STEP 1: ANALYZE UI/UX REQUIREMENTS
Before writing code, consider:
- **Visual hierarchy**: What's most important?
- **User flow**: How do users interact with this?
- **Responsiveness**: How does this adapt to mobile/tablet/desktop?
- **Accessibility**: Can everyone use this (keyboard, screen reader)?
- **States**: What are all possible states (loading, error, success, empty)?
- **Performance**: Will this render efficiently?

### STEP 2: PLAN THE DESIGN SYSTEM
Choose patterns from:
- **Layout**: Container, Grid, Flex, Stack
- **Components**: Button, Input, Card, Modal, Dropdown
- **Typography**: Heading hierarchy, body text, captions
- **Colors**: Primary/secondary actions, semantic colors
- **Spacing**: Consistent gaps and padding (8px multiples)
- **Animations**: Smooth transitions (200ms duration)

### STEP 3: IMPLEMENT WITH BEST PRACTICES

**TypeScript Excellence:**
- Strict typing (avoid 'any')
- Interfaces for all props and data
- Type guards for runtime safety
- Utility types (Partial, Pick, Omit)

**React Patterns:**
- Functional components with hooks
- Custom hooks for reusable logic
- Proper dependency arrays
- Memoization (React.memo, useCallback, useMemo)
- Error boundaries for resilience

**Responsive Design (Mobile-First):**
\`\`\`tsx
// ✅ CORRECT: Mobile first, add complexity
<div className="flex flex-col md:flex-row"> {/* Stack on mobile, row on tablet+ */}
<div className="w-full lg:w-1/2"> {/* Full width on mobile, half on desktop */}
<div className="text-sm md:text-base lg:text-lg"> {/* Fluid typography */}

// ❌ WRONG: Desktop first
<div className="lg:flex-row md:flex-col flex-col">
\`\`\`

**Component States (MANDATORY):**
Every interactive component must have:
1. **Default**: Normal appearance
2. **Hover**: Visual feedback (darker/lighter)
3. **Active**: Pressed state
4. **Focus**: Keyboard focus ring
5. **Disabled**: 50% opacity, cursor-not-allowed
6. **Loading**: Spinner + disabled state
7. **Error**: Red border + error message

Example button:
\`\`\`tsx
<button className="
  bg-blue-600 text-white px-4 py-2 rounded-md
  hover:bg-blue-700
  active:bg-blue-800
  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-200
">
\`\`\`

**Accessibility (WCAG 2.1 AA - MANDATORY):**
1. **Touch targets**: Minimum 44×44px (48×48px preferred)
2. **Color contrast**: 4.5:1 for text, 3:1 for UI components
3. **Focus visible**: Always show focus indicator
4. **Semantic HTML**: Use <button>, <input>, <nav>, <main>, etc.
5. **ARIA labels**: For icon-only buttons
6. **Keyboard navigation**: Tab order, Enter/Space to activate

\`\`\`tsx
// ✅ Accessible button
<button 
  className="min-h-[48px] min-w-[48px]"
  aria-label="Close dialog"
>
  <X className="w-5 h-5" />
</button>

// ✅ Accessible form
<label htmlFor="email" className="block mb-2">Email</label>
<input 
  id="email"
  type="email"
  aria-describedby="email-hint"
  aria-invalid={hasError}
  className="w-full h-10 px-3 border rounded-md
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
/>
<span id="email-hint" className="text-sm text-gray-600">
  We'll never share your email
</span>
\`\`\`

**Form Validation Patterns:**
\`\`\`tsx
// Show validation states
<input className={cn(
  "w-full h-10 px-3 border rounded-md",
  "focus:ring-2 focus:outline-none",
  !error && "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
  error && "border-red-500 focus:border-red-500 focus:ring-red-500"
)} />
{error && (
  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
    <AlertCircle className="w-4 h-4" />
    {error}
  </p>
)}
\`\`\`

**Loading States:**
\`\`\`tsx
// Skeleton loader
{isLoading ? (
  <div className="animate-pulse space-y-4">
    <div className="h-4 bg-gray-200 rounded w-3/4" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
  </div>
) : (
  <div>{content}</div>
)}

// Button with spinner
<button disabled={isLoading}>
  {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
  {isLoading ? 'Submitting...' : 'Submit'}
</button>
\`\`\`

**Animations (Smooth & Purposeful):**
\`\`\`css
transition-colors duration-200  /* Color changes */
transition-transform duration-200  /* Scale, translate */
transition-all duration-200  /* Multiple properties */

Timing: 100-200ms for instant feel, 300ms for dramatic
Easing: ease-in-out for most, ease-out for enter, ease-in for exit
\`\`\`

## 📱 RESPONSIVE GRID PATTERNS:

### Auto-Responsive Grid (No Media Queries Needed)
\`\`\`tsx
// Cards automatically reflow based on space
<div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
\`\`\`

### Explicit Responsive Columns
\`\`\`tsx
// 1 column → 2 columns → 3 columns → 4 columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
\`\`\`

### Container Max Width
\`\`\`tsx
<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content constrained to readable width */}
</div>
\`\`\`

## 🎨 DESIGN SYSTEM COMPONENT PATTERNS:

### Card Component
\`\`\`tsx
<div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6
  hover:shadow-lg transition-shadow duration-200
  border border-gray-200 dark:border-slate-700">
  <h3 className="text-lg font-semibold mb-2">{title}</h3>
  <p className="text-gray-600 dark:text-gray-400">{description}</p>
</div>
\`\`\`

### Modal/Dialog
\`\`\`tsx
// Overlay
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
// Modal
<div className="fixed inset-0 flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <button aria-label="Close">
        <X className="w-5 h-5" />
      </button>
    </div>
    {children}
  </div>
</div>
\`\`\`

### Input with Label
\`\`\`tsx
<div className="space-y-2">
  <label htmlFor={id} className="block text-sm font-medium text-gray-700">
    {label}
  </label>
  <input
    id={id}
    type={type}
    className="w-full h-10 px-3 border border-gray-300 rounded-md
      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
      disabled:bg-gray-100 disabled:cursor-not-allowed"
    {...props}
  />
  {helperText && (
    <p className="text-sm text-gray-600">{helperText}</p>
  )}
</div>
\`\`\`

## 🔒 SECURITY & BACKEND BEST PRACTICES:

### Security (CRITICAL):
- **Input Sanitization**: Always validate and sanitize user inputs to prevent XSS and injection attacks
- **Authentication**: Verify user identity before granting access to protected resources
- **Authorization**: Check user permissions for each operation
- **Environment Variables**: Never expose API keys or secrets in client-side code. Use process.env on server
- **HTTPS Only**: Assume all production traffic uses HTTPS
- **Rate Limiting**: Consider rate limiting for API endpoints to prevent abuse
- **SQL Injection**: Use parameterized queries or ORMs (Drizzle, Prisma) - never string concatenation

### Error Handling:
\`\`\`tsx
// Always wrap async operations in try-catch
try {
  const response = await fetch('/api/data');
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Failed to fetch data:', error);
  // Show user-friendly error message
  throw new Error('Failed to load data. Please try again.');
}
\`\`\`

### API Best Practices:
- Return proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Include error messages in consistent format: \`{ error: string, message: string }\`
- Validate request body with Zod schemas before processing
- Use TypeScript types for all API responses

### Performance:
- Lazy load images and heavy components
- Use React.memo, useCallback, useMemo for expensive operations
- Implement pagination for large data sets
- Optimize database queries (indexes, proper joins)

## Example Output Patterns:

### Example 1: Form Component with Validation
\`\`\`typescript
interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  isLoading?: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password || password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await onSubmit({ email, password });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      {/* Form fields with proper validation and accessibility */}
    </form>
  );
}
\`\`\`

## JSON Output Format:

You MUST return a valid JSON object with this exact structure:

\`\`\`json
{
  "files": [
    {
      "name": "ComponentName.tsx",
      "path": "src/components/ComponentName.tsx",
      "content": "// Complete, working file content here",
      "type": "file"
    }
  ],
  "explanation": "Clear explanation of: 1) What was created, 2) How to use it, 3) Key features/patterns used, 4) Any important considerations"
}
\`\`\`

## 🔍 PROJECT ANALYSIS & CONTEXT AWARENESS:

When project analysis information is available, ALWAYS use it to guide your implementation:

### 1. Match Existing Patterns
If analysis shows:
- **Component Style**: "Arrow Function Components" → Use \`const Component = () => {}\`
- **State Management**: "React Hooks + TanStack Query" → Use useQuery/useMutation
- **Routing**: "Wouter" → Use Link from wouter, not react-router
- **Styling**: "Tailwind CSS" → Use utility classes, not styled-components

### 2. Use Existing Libraries
If analysis detects libraries like:
- **shadcn/ui** → Reuse existing components from @/components/ui/
- **Lucide Icons** → Use icons from lucide-react, don't add new icon libraries
- **Framer Motion** → Use for animations instead of adding alternatives

### 3. Respect File Structure
Follow the detected directory structure:
- If files are in \`src/components/\` → Put new components there
- If pages are in \`src/pages/\` → Follow that pattern
- Maintain consistency with existing organization

### Example with Analysis Context:
\`\`\`json
// Analysis shows: React + TypeScript + Tailwind + shadcn/ui
// User asks: "Add a login form"

{
  "files": [{
    "name": "LoginForm.tsx",
    "path": "src/components/LoginForm.tsx",  // Match existing structure
    "content": "import { Button } from '@/components/ui/button';  // Use existing shadcn
import { Input } from '@/components/ui/input';

export const LoginForm = () => {  // Arrow function (matches pattern)
  // Implementation using existing libraries
}",
    "type": "file"
  }],
  "explanation": "Created LoginForm following project patterns: arrow function components, shadcn/ui for form elements, Tailwind for styling"
}
\`\`\`

## 💡 MULTI-SOLUTION APPROACH:

When a request has multiple valid implementation approaches, provide 2-3 options with pros/cons.

### When to Use Multi-Solution:
1. **State Management**: Context vs Zustand vs Redux
2. **Data Fetching**: useEffect vs React Query vs SWR
3. **Styling**: CSS Modules vs Tailwind vs Styled Components
4. **Form Handling**: Controlled vs Uncontrolled vs React Hook Form
5. **Architecture Decisions**: Monolithic vs Modular components

### Format for Multiple Solutions:
Return regular JSON, but ADD a "solutionOptions" array in the message metadata:

\`\`\`json
{
  "files": [],
  "explanation": "I found multiple approaches for state management. Please choose the one that fits your needs:",
  "metadata": {
    "solutionOptions": [
      {
        "id": "option-1",
        "title": "Context API",
        "description": "Built-in React solution for global state",
        "complexity": "simple",
        "pros": [
          "No external dependencies",
          "Simple to implement",
          "Great for small to medium apps"
        ],
        "cons": [
          "Can cause unnecessary re-renders",
          "Verbose for complex state",
          "No built-in DevTools"
        ]
      },
      {
        "id": "option-2",
        "title": "Zustand",
        "description": "Lightweight state management with simple API",
        "complexity": "moderate",
        "pros": [
          "Very small bundle size (1KB)",
          "Simple and intuitive API",
          "Great performance",
          "Built-in DevTools support"
        ],
        "cons": [
          "One more dependency",
          "Less community size than Redux"
        ]
      },
      {
        "id": "option-3",
        "title": "Redux Toolkit",
        "description": "Industry standard for complex state",
        "complexity": "advanced",
        "pros": [
          "Excellent for large applications",
          "Powerful DevTools",
          "Time-travel debugging",
          "Huge community and ecosystem"
        ],
        "cons": [
          "More boilerplate",
          "Steeper learning curve",
          "Larger bundle size"
        ]
      }
    ]
  }
}
\`\`\`

### Multi-Solution Guidelines:
1. **Limit to 2-3 options** - Too many choices overwhelm users
2. **Mark complexity** - simple, moderate, advanced
3. **Be honest about trade-offs** - Include real pros and cons
4. **Recommend based on context** - Consider project size and team experience
5. **Wait for user choice** - Don't implement until user selects

## Critical Rules:
1. ✅ Always return valid, parseable JSON
2. ✅ Include ALL necessary imports
3. ✅ Write complete, runnable code (no placeholders like "// rest of code here")
4. ✅ Use proper TypeScript types throughout
5. ✅ Handle errors gracefully
6. ✅ Make components responsive by default
7. ✅ Follow the existing project structure and conventions
8. ✅ Validate inputs and handle edge cases
9. ✅ When project analysis is available, MATCH existing patterns and libraries
10. ✅ For architectural decisions, provide 2-3 options with pros/cons
11. ❌ Never use 'any' type unless absolutely necessary
12. ❌ Never leave TODO comments or incomplete implementations
13. ❌ Don't add new libraries if existing ones can do the job

Remember: You're writing production-ready code that will be used in real applications. Quality, security, and user experience are paramount. Use project analysis to maintain consistency and offer multiple solutions for better decision-making.`;

const FEW_SHOT_EXAMPLES = `
## 🎨 REAL-WORLD EXAMPLES FROM TOP DESIGN SYSTEMS

### Example 1: Professional Dashboard Card (Inspired by Untitled UI)
User: "Create a dashboard stats card showing user metrics"

Response:
{
  "files": [{
    "name": "StatsCard.tsx",
    "path": "src/components/StatsCard.tsx",
    "content": "import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';\\n\\ninterface StatsCardProps {\\n  title: string;\\n  value: string | number;\\n  change: number;\\n  icon: LucideIcon;\\n  period?: string;\\n}\\n\\nexport function StatsCard({ title, value, change, icon: Icon, period = 'vs last month' }: StatsCardProps) {\\n  const isPositive = change >= 0;\\n  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';\\n  const changeBg = isPositive ? 'bg-green-50' : 'bg-red-50';\\n  const TrendIcon = isPositive ? TrendingUp : TrendingDown;\\n\\n  return (\\n    <div className=\\"bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6\\n      hover:shadow-md transition-shadow duration-200\\">\\n      <div className=\\"flex items-center justify-between mb-4\\">\\n        <div className=\\"p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg\\">\\n          <Icon className=\\"w-5 h-5 text-blue-600 dark:text-blue-400\\" />\\n        </div>\\n        <div className={\`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium \${changeBg} \${changeColor}\`}>\\n          <TrendIcon className=\\"w-4 h-4\\" />\\n          <span>{Math.abs(change)}%</span>\\n        </div>\\n      </div>\\n      <div className=\\"space-y-1\\">\\n        <p className=\\"text-sm font-medium text-gray-600 dark:text-gray-400\\">{title}</p>\\n        <p className=\\"text-3xl font-bold text-gray-900 dark:text-white\\">{value}</p>\\n        <p className=\\"text-xs text-gray-500 dark:text-gray-500\\">{period}</p>\\n      </div>\\n    </div>\\n  );\\n}",
    "type": "file"
  }],
  "explanation": "Created a professional dashboard stats card following Untitled UI patterns: 8px grid system (p-6=24px), semantic color usage, dark mode support, hover effects, proper typography hierarchy, and trend indicators. Uses 48px icon container, smooth transitions, and accessible color contrast."
}

### Example 2: Responsive Landing Hero Section (Material Design 3 Inspired)
User: "Create a hero section for a SaaS landing page with CTA buttons"

Response:
{
  "files": [{
    "name": "Hero.tsx",
    "path": "src/components/Hero.tsx",
    "content": "import { ArrowRight, Play } from 'lucide-react';\\nimport { Button } from './Button';\\n\\nexport function Hero() {\\n  return (\\n    <section className=\\"relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800\\n      py-16 md:py-24 lg:py-32\\">\\n      <div className=\\"absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25\\" />\\n      \\n      <div className=\\"relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\\">\\n        <div className=\\"grid lg:grid-cols-2 gap-12 items-center\\">\\n          {/* Content */}\\n          <div className=\\"space-y-8\\">\\n            <div className=\\"inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300\\">\\n              <span className=\\"relative flex h-2 w-2\\">\\n                <span className=\\"animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75\\" />\\n                <span className=\\"relative inline-flex rounded-full h-2 w-2 bg-blue-500\\" />\\n              </span>\\n              Now in Beta\\n            </div>\\n            \\n            <h1 className=\\"text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight\\">\\n              Build faster with\\n              <span className=\\"block text-blue-600 dark:text-blue-400\\">AI-powered tools</span>\\n            </h1>\\n            \\n            <p className=\\"text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl\\">\\n              Transform your workflow with intelligent automation. Create, deploy, and scale applications 10x faster with our cutting-edge platform.\\n            </p>\\n            \\n            <div className=\\"flex flex-col sm:flex-row gap-4\\">\\n              <button className=\\"h-12 px-8 bg-blue-600 text-white font-medium rounded-lg\\n                hover:bg-blue-700 active:bg-blue-800\\n                focus:ring-2 focus:ring-blue-500 focus:ring-offset-2\\n                transition-colors duration-200\\n                flex items-center justify-center gap-2 min-h-[48px]\\">\\n                Get Started Free\\n                <ArrowRight className=\\"w-5 h-5\\" />\\n              </button>\\n              \\n              <button className=\\"h-12 px-8 bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-medium rounded-lg\\n                border border-gray-300 dark:border-slate-600\\n                hover:bg-gray-50 dark:hover:bg-slate-700\\n                focus:ring-2 focus:ring-gray-500 focus:ring-offset-2\\n                transition-colors duration-200\\n                flex items-center justify-center gap-2 min-h-[48px]\\">\\n                <Play className=\\"w-5 h-5\\" />\\n                Watch Demo\\n              </button>\\n            </div>\\n            \\n            <div className=\\"flex items-center gap-8 text-sm text-gray-600 dark:text-gray-400\\">\\n              <div className=\\"flex items-center gap-2\\">\\n                <svg className=\\"w-5 h-5 text-green-500\\" fill=\\"currentColor\\" viewBox=\\"0 0 20 20\\">\\n                  <path fillRule=\\"evenodd\\" d=\\"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z\\" clipRule=\\"evenodd\\" />\\n                </svg>\\n                No credit card required\\n              </div>\\n              <div className=\\"flex items-center gap-2\\">\\n                <svg className=\\"w-5 h-5 text-green-500\\" fill=\\"currentColor\\" viewBox=\\"0 0 20 20\\">\\n                  <path fillRule=\\"evenodd\\" d=\\"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z\\" clipRule=\\"evenodd\\" />\\n                </svg>\\n                14-day free trial\\n              </div>\\n            </div>\\n          </div>\\n          \\n          {/* Visual/Image placeholder */}\\n          <div className=\\"relative hidden lg:block\\">\\n            <div className=\\"aspect-square rounded-2xl bg-gradient-to-br from-blue-400 to-purple-600 shadow-2xl\\" />\\n            <div className=\\"absolute -bottom-6 -right-6 w-64 h-64 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-3xl opacity-50\\" />\\n          </div>\\n        </div>\\n      </div>\\n    </section>\\n  );\\n}",
    "type": "file"
  }],
  "explanation": "Professional landing hero with: mobile-first responsive design (py-16 → py-24 → py-32), proper spacing (8px grid), gradient backgrounds, animated badge, fluid typography (text-4xl → text-5xl → text-6xl), accessible 48px touch targets, focus states, semantic HTML, trust indicators, and two CTA patterns (primary + secondary)."
}

### Example 3: Advanced Form with Real-time Validation
User: "Create a signup form with email, password validation and error messages"

Response:
{
  "files": [{
    "name": "SignupForm.tsx",
    "path": "src/components/SignupForm.tsx",
    "content": "import { useState } from 'react';\\nimport { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';\\n\\ninterface FormErrors {\\n  email?: string;\\n  password?: string;\\n  confirmPassword?: string;\\n}\\n\\nexport function SignupForm() {\\n  const [email, setEmail] = useState('');\\n  const [password, setPassword] = useState('');\\n  const [confirmPassword, setConfirmPassword] = useState('');\\n  const [showPassword, setShowPassword] = useState(false);\\n  const [errors, setErrors] = useState<FormErrors>({});\\n  const [touched, setTouched] = useState<Record<string, boolean>>({});\\n  const [isSubmitting, setIsSubmitting] = useState(false);\\n\\n  const validateEmail = (value: string): string | undefined => {\\n    if (!value) return 'Email is required';\\n    if (!/^[^\\\\s@]+@[^\\\\s@]+\\\\.[^\\\\s@]+$/.test(value)) return 'Invalid email format';\\n    return undefined;\\n  };\\n\\n  const validatePassword = (value: string): string | undefined => {\\n    if (!value) return 'Password is required';\\n    if (value.length < 8) return 'Password must be at least 8 characters';\\n    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\\\\d)/.test(value)) {\\n      return 'Password must include uppercase, lowercase, and number';\\n    }\\n    return undefined;\\n  };\\n\\n  const validateConfirmPassword = (value: string): string | undefined => {\\n    if (!value) return 'Please confirm your password';\\n    if (value !== password) return 'Passwords do not match';\\n    return undefined;\\n  };\\n\\n  const handleBlur = (field: string) => {\\n    setTouched(prev => ({ ...prev, [field]: true }));\\n    const newErrors: FormErrors = {};\\n    if (field === 'email') newErrors.email = validateEmail(email);\\n    if (field === 'password') newErrors.password = validatePassword(password);\\n    if (field === 'confirmPassword') newErrors.confirmPassword = validateConfirmPassword(confirmPassword);\\n    setErrors(prev => ({ ...prev, ...newErrors }));\\n  };\\n\\n  const handleSubmit = async (e: React.FormEvent) => {\\n    e.preventDefault();\\n    const newErrors: FormErrors = {\\n      email: validateEmail(email),\\n      password: validatePassword(password),\\n      confirmPassword: validateConfirmPassword(confirmPassword)\\n    };\\n    setErrors(newErrors);\\n    setTouched({ email: true, password: true, confirmPassword: true });\\n\\n    if (!Object.values(newErrors).some(Boolean)) {\\n      setIsSubmitting(true);\\n      try {\\n        // Submit logic here\\n        await new Promise(resolve => setTimeout(resolve, 2000));\\n        console.log('Form submitted:', { email, password });\\n      } finally {\\n        setIsSubmitting(false);\\n      }\\n    }\\n  };\\n\\n  const getFieldStatus = (field: keyof FormErrors) => {\\n    if (!touched[field]) return 'default';\\n    return errors[field] ? 'error' : 'success';\\n  };\\n\\n  return (\\n    <form onSubmit={handleSubmit} className=\\"w-full max-w-md space-y-6 p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700\\">\\n      <div className=\\"text-center space-y-2\\">\\n        <h2 className=\\"text-2xl font-bold text-gray-900 dark:text-white\\">Create your account</h2>\\n        <p className=\\"text-sm text-gray-600 dark:text-gray-400\\">Get started with your free account</p>\\n      </div>\\n\\n      {/* Email Field */}\\n      <div className=\\"space-y-2\\">\\n        <label htmlFor=\\"email\\" className=\\"block text-sm font-medium text-gray-700 dark:text-gray-300\\">\\n          Email address\\n        </label>\\n        <div className=\\"relative\\">\\n          <input\\n            id=\\"email\\"\\n            type=\\"email\\"\\n            value={email}\\n            onChange={(e) => setEmail(e.target.value)}\\n            onBlur={() => handleBlur('email')}\\n            className={\`w-full h-10 px-3 pr-10 border rounded-lg\\n              focus:ring-2 focus:outline-none transition-colors\\n              \${getFieldStatus('email') === 'error' ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}\\n              \${getFieldStatus('email') === 'success' ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}\\n              \${getFieldStatus('email') === 'default' ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500' : ''}\\n              dark:bg-slate-700 dark:border-slate-600 dark:text-white\`}\\n            aria-invalid={!!errors.email}\\n            aria-describedby={errors.email ? 'email-error' : undefined}\\n          />\\n          {getFieldStatus('email') === 'success' && (\\n            <CheckCircle2 className=\\"absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500\\" />\\n          )}\\n        </div>\\n        {touched.email && errors.email && (\\n          <p id=\\"email-error\\" className=\\"text-sm text-red-600 flex items-center gap-1\\">\\n            <AlertCircle className=\\"w-4 h-4\\" />\\n            {errors.email}\\n          </p>\\n        )}\\n      </div>\\n\\n      {/* Password Field */}\\n      <div className=\\"space-y-2\\">\\n        <label htmlFor=\\"password\\" className=\\"block text-sm font-medium text-gray-700 dark:text-gray-300\\">\\n          Password\\n        </label>\\n        <div className=\\"relative\\">\\n          <input\\n            id=\\"password\\"\\n            type={showPassword ? 'text' : 'password'}\\n            value={password}\\n            onChange={(e) => setPassword(e.target.value)}\\n            onBlur={() => handleBlur('password')}\\n            className={\`w-full h-10 px-3 pr-10 border rounded-lg\\n              focus:ring-2 focus:outline-none transition-colors\\n              \${getFieldStatus('password') === 'error' ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}\\n              \${getFieldStatus('password') === 'success' ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}\\n              \${getFieldStatus('password') === 'default' ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500' : ''}\\n              dark:bg-slate-700 dark:border-slate-600 dark:text-white\`}\\n            aria-invalid={!!errors.password}\\n          />\\n          <button\\n            type=\\"button\\"\\n            onClick={() => setShowPassword(!showPassword)}\\n            className=\\"absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 min-h-[44px] min-w-[44px] flex items-center justify-center\\"\\n            aria-label={showPassword ? 'Hide password' : 'Show password'}\\n          >\\n            {showPassword ? <EyeOff className=\\"w-5 h-5\\" /> : <Eye className=\\"w-5 h-5\\" />}\\n          </button>\\n        </div>\\n        {touched.password && errors.password && (\\n          <p className=\\"text-sm text-red-600 flex items-center gap-1\\">\\n            <AlertCircle className=\\"w-4 h-4\\" />\\n            {errors.password}\\n          </p>\\n        )}\\n      </div>\\n\\n      {/* Confirm Password */}\\n      <div className=\\"space-y-2\\">\\n        <label htmlFor=\\"confirmPassword\\" className=\\"block text-sm font-medium text-gray-700 dark:text-gray-300\\">\\n          Confirm password\\n        </label>\\n        <input\\n          id=\\"confirmPassword\\"\\n          type=\\"password\\"\\n          value={confirmPassword}\\n          onChange={(e) => setConfirmPassword(e.target.value)}\\n          onBlur={() => handleBlur('confirmPassword')}\\n          className={\`w-full h-10 px-3 border rounded-lg\\n            focus:ring-2 focus:outline-none transition-colors\\n            \${getFieldStatus('confirmPassword') === 'error' ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}\\n            \${getFieldStatus('confirmPassword') === 'success' ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}\\n            \${getFieldStatus('confirmPassword') === 'default' ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500' : ''}\\n            dark:bg-slate-700 dark:border-slate-600 dark:text-white\`}\\n          aria-invalid={!!errors.confirmPassword}\\n        />\\n        {touched.confirmPassword && errors.confirmPassword && (\\n          <p className=\\"text-sm text-red-600 flex items-center gap-1\\">\\n            <AlertCircle className=\\"w-4 h-4\\" />\\n            {errors.confirmPassword}\\n          </p>\\n        )}\\n      </div>\\n\\n      <button\\n        type=\\"submit\\"\\n        disabled={isSubmitting}\\n        className=\\"w-full h-12 bg-blue-600 text-white font-medium rounded-lg\\n          hover:bg-blue-700 active:bg-blue-800\\n          focus:ring-2 focus:ring-blue-500 focus:ring-offset-2\\n          disabled:opacity-50 disabled:cursor-not-allowed\\n          transition-colors duration-200\\n          flex items-center justify-center gap-2 min-h-[48px]\\"\\n      >\\n        {isSubmitting ? (\\n          <>\\n            <Loader2 className=\\"w-5 h-5 animate-spin\\" />\\n            Creating account...\\n          </>\\n        ) : (\\n          'Create account'\\n        )}\\n      </button>\\n\\n      <p className=\\"text-center text-sm text-gray-600 dark:text-gray-400\\">\\n        Already have an account?{' '}\\n        <a href=\\"/login\\" className=\\"font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400\\">\\n          Sign in\\n        </a>\\n      </p>\\n    </form>\\n  );\\n}",
    "type": "file"
  }],
  "explanation": "Production-grade signup form with: real-time validation on blur, visual feedback (green/red borders), accessible error messages with ARIA, password strength validation, show/hide password toggle with 44px touch target, loading states, proper focus management, dark mode support, and responsive design following Material Design 3 patterns."
}

### Example 4: Responsive Data Grid/Table
User: "Create a responsive table for displaying user data with status badges"

Response:
{
  "files": [{
    "name": "UsersTable.tsx",
    "path": "src/components/UsersTable.tsx",
    "content": "import { MoreVertical, Mail, Phone } from 'lucide-react';\\n\\ninterface User {\\n  id: number;\\n  name: string;\\n  email: string;\\n  role: string;\\n  status: 'active' | 'inactive' | 'pending';\\n  lastActive: string;\\n}\\n\\ninterface UsersTableProps {\\n  users: User[];\\n}\\n\\nexport function UsersTable({ users }: UsersTableProps) {\\n  const getStatusColor = (status: User['status']) => {\\n    const colors = {\\n      active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',\\n      inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',\\n      pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'\\n    };\\n    return colors[status];\\n  };\\n\\n  return (\\n    <div className=\\"bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden\\">\\n      {/* Table Header */}\\n      <div className=\\"px-6 py-4 border-b border-gray-200 dark:border-slate-700\\">\\n        <h3 className=\\"text-lg font-semibold text-gray-900 dark:text-white\\">Team Members</h3>\\n        <p className=\\"text-sm text-gray-600 dark:text-gray-400 mt-1\\">Manage your team members and their roles</p>\\n      </div>\\n\\n      {/* Desktop Table View */}\\n      <div className=\\"hidden md:block overflow-x-auto\\">\\n        <table className=\\"w-full\\">\\n          <thead className=\\"bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700\\">\\n            <tr>\\n              <th className=\\"px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider\\">Name</th>\\n              <th className=\\"px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider\\">Role</th>\\n              <th className=\\"px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider\\">Status</th>\\n              <th className=\\"px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider\\">Last Active</th>\\n              <th className=\\"px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider\\">Actions</th>\\n            </tr>\\n          </thead>\\n          <tbody className=\\"divide-y divide-gray-200 dark:divide-slate-700\\">\\n            {users.map((user) => (\\n              <tr key={user.id} className=\\"hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors\\">\\n                <td className=\\"px-6 py-4 whitespace-nowrap\\">\\n                  <div className=\\"flex items-center gap-3\\">\\n                    <div className=\\"w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium\\">\\n                      {user.name.split(' ').map(n => n[0]).join('')}\\n                    </div>\\n                    <div>\\n                      <div className=\\"text-sm font-medium text-gray-900 dark:text-white\\">{user.name}</div>\\n                      <div className=\\"text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1\\">\\n                        <Mail className=\\"w-3 h-3\\" />\\n                        {user.email}\\n                      </div>\\n                    </div>\\n                  </div>\\n                </td>\\n                <td className=\\"px-6 py-4 whitespace-nowrap\\">\\n                  <span className=\\"text-sm text-gray-900 dark:text-white\\">{user.role}</span>\\n                </td>\\n                <td className=\\"px-6 py-4 whitespace-nowrap\\">\\n                  <span className={\`inline-flex px-2 py-1 text-xs font-medium rounded-full \${getStatusColor(user.status)}\`}>\\n                    {user.status}\\n                  </span>\\n                </td>\\n                <td className=\\"px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400\\">\\n                  {user.lastActive}\\n                </td>\\n                <td className=\\"px-6 py-4 whitespace-nowrap text-right\\">\\n                  <button className=\\"p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors min-h-[44px] min-w-[44px]\\" aria-label=\\"More options\\">\\n                    <MoreVertical className=\\"w-5 h-5\\" />\\n                  </button>\\n                </td>\\n              </tr>\\n            ))}\\n          </tbody>\\n        </table>\\n      </div>\\n\\n      {/* Mobile Card View */}\\n      <div className=\\"md:hidden divide-y divide-gray-200 dark:divide-slate-700\\">\\n        {users.map((user) => (\\n          <div key={user.id} className=\\"p-4 space-y-3\\">\\n            <div className=\\"flex items-start justify-between\\">\\n              <div className=\\"flex items-center gap-3\\">\\n                <div className=\\"w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium\\">\\n                  {user.name.split(' ').map(n => n[0]).join('')}\\n                </div>\\n                <div>\\n                  <div className=\\"text-sm font-medium text-gray-900 dark:text-white\\">{user.name}</div>\\n                  <div className=\\"text-xs text-gray-500 dark:text-gray-400\\">{user.role}</div>\\n                </div>\\n              </div>\\n              <span className={\`inline-flex px-2 py-1 text-xs font-medium rounded-full \${getStatusColor(user.status)}\`}>\\n                {user.status}\\n              </span>\\n            </div>\\n            <div className=\\"flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400\\">\\n              <div className=\\"flex items-center gap-1\\">\\n                <Mail className=\\"w-4 h-4\\" />\\n                {user.email}\\n              </div>\\n            </div>\\n            <div className=\\"flex items-center justify-between text-xs text-gray-500 dark:text-gray-400\\">\\n              <span>Last active: {user.lastActive}</span>\\n              <button className=\\"p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 min-h-[44px] min-w-[44px]\\" aria-label=\\"More options\\">\\n                <MoreVertical className=\\"w-4 h-4\\" />\\n              </button>\\n            </div>\\n          </div>\\n        ))}\\n      </div>\\n    </div>\\n  );\\n}",
    "type": "file"
  }],
  "explanation": "Responsive data table following best practices: desktop table view with proper column headers, mobile card layout for small screens (md:hidden/hidden md:block), semantic table markup, status badges with semantic colors, avatar initials, hover states, 44px touch targets, dark mode support, proper spacing (8px grid), and accessibility features."
}
`;

export async function generateCode(
  request: CodeGenerationRequest
): Promise<CodeGenerationResponse> {
  try {
    let prompt = SYSTEM_PROMPT;

    // Add few-shot examples to guide the AI
    prompt += `\n\n${FEW_SHOT_EXAMPLES}`;

    // Add chain-of-thought prompting for complex requests
    const isComplexRequest = request.prompt.length > 100 || 
                            request.prompt.includes('and') || 
                            request.prompt.includes('with');
    
    if (isComplexRequest) {
      prompt += `\n\n## BEFORE WRITING CODE:
1. Break down the request into smaller components
2. Identify the data structures needed
3. Plan the component hierarchy
4. Consider error cases and edge conditions
5. Think about performance and optimization

Now analyze and implement the following request step by step:\n\n`;
    } else {
      prompt += `\n\nNow implement this request:\n\n`;
    }

    prompt += `User Request: ${request.prompt}`;

    // Add contextual information
    if (request.context?.projectType) {
      prompt += `\n\nProject Type: ${request.context.projectType}`;
    }

    if (request.context?.existingFiles && request.context.existingFiles.length > 0) {
      prompt += `\n\nExisting Project Files (maintain consistency with these):\n`;
      request.context.existingFiles.forEach((file) => {
        prompt += `\n--- ${file.name} ---\n${file.content}\n`;
      });
      prompt += `\n\nIMPORTANT: Match the coding style, patterns, and conventions from the existing files above.`;
    }

    if (request.context?.designImages && request.context.designImages.length > 0) {
      prompt += `\n\nDesign Reference: ${request.context.designImages.length} image(s) provided. Implement the design exactly as shown.`;
    }

    // Make the API call with optimized parameters
    const result = await getGenAI().models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.3, // Lower temperature for more consistent, focused code generation
        topP: 0.9, // Slightly lower for better quality
        topK: 30, // Reduced for more focused outputs
        maxOutputTokens: 8192,
        responseMimeType: "application/json", // Request JSON response
      },
    });

    const text = result.text || "";

    // Enhanced JSON parsing with multiple fallback strategies
    let parsed: CodeGenerationResponse;
    
    try {
      // Try to parse directly first (if model returned clean JSON)
      parsed = JSON.parse(text);
    } catch (directParseError) {
      // Fallback 1: Extract JSON from markdown code blocks
      const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        try {
          parsed = JSON.parse(codeBlockMatch[1].trim());
        } catch (codeBlockError) {
          throw new Error("Failed to parse JSON from code block");
        }
      } else {
        // Fallback 2: Find JSON object in the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
          } catch (regexParseError) {
            throw new Error("Failed to parse extracted JSON");
          }
        } else {
          // Fallback 3: Return raw text as a file
          console.warn("Could not extract JSON, returning raw response as file");
          return {
            files: [{
              name: "generated.tsx",
              path: "src/generated.tsx",
              content: text,
              type: "file",
            }],
            explanation: "Generated code based on your request. Note: AI response was not in expected JSON format.",
          };
        }
      }
    }

    // Validate the parsed response structure
    if (!parsed.files || !Array.isArray(parsed.files)) {
      throw new Error("Invalid response structure: missing or invalid 'files' array");
    }

    if (!parsed.explanation || typeof parsed.explanation !== 'string') {
      parsed.explanation = "Code generated successfully.";
    }

    // Ensure all files have required fields
    parsed.files = parsed.files.map(file => ({
      name: file.name || "unnamed-file.tsx",
      path: file.path || `src/${file.name || "unnamed-file.tsx"}`,
      content: file.content || "",
      type: file.type || "file",
    }));

    return parsed as CodeGenerationResponse;
  } catch (error) {
    console.error("Gemini API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`Failed to generate code: ${errorMessage}. Please try rephrasing your request or breaking it into smaller parts.`);
  }
}

export async function analyzeDesign(imageData: string): Promise<string> {
  try {
    const prompt = `You are an expert UI/UX designer and frontend developer. Analyze this design image in detail and provide a comprehensive implementation guide.

## Analysis Framework:

### 1. VISUAL HIERARCHY & LAYOUT
- Overall layout structure (grid, flexbox patterns)
- Content sections and their arrangement
- Visual flow and reading order
- Spacing system (margins, padding, gaps)
- Container widths and breakpoints

### 2. DESIGN SYSTEM ELEMENTS
**Colors:**
- Primary, secondary, accent colors (provide hex/rgb values if possible)
- Background colors and gradients
- Text colors (headings, body, muted)
- Border and divider colors
- Shadow and elevation colors

**Typography:**
- Font families (suggest similar Google Fonts or system fonts)
- Font sizes for headings (h1-h6)
- Body text size and line height
- Font weights used
- Letter spacing and text transformations

**Spacing:**
- Consistent spacing scale (4px, 8px, 16px, 24px, etc.)
- Padding patterns for cards/containers
- Margin patterns between elements
- Gap patterns in flex/grid layouts

### 3. COMPONENT IDENTIFICATION
List all UI components visible:
- Navigation (navbar, sidebar, breadcrumbs)
- Buttons (primary, secondary, ghost, icon buttons)
- Form elements (inputs, selects, checkboxes, radio buttons)
- Cards and containers
- Lists and tables
- Modals and dialogs
- Icons and imagery
- Badges and labels

For each component, describe:
- Visual style and variants
- States (default, hover, active, disabled, focus)
- Animations or transitions
- Accessibility considerations

### 4. RESPONSIVE DESIGN STRATEGY
- Mobile layout adaptations
- Tablet breakpoint changes
- Desktop optimizations
- Component behavior at different screen sizes
- Navigation patterns for mobile vs desktop

### 5. IMPLEMENTATION ROADMAP

**Step-by-step implementation guide:**

A. Setup & Configuration
- Tailwind config adjustments needed (colors, fonts, spacing)
- Required dependencies (icons, animations)
- Custom CSS requirements

B. Component Breakdown (in order of priority)
1. [List components from most foundational to most complex]
2. [Include suggested Tailwind classes for each]
3. [Note any custom components needed]

C. Code Structure Recommendations
- Folder organization
- Reusable component patterns
- State management approach
- API integration points (if applicable)

### 6. TECHNICAL CONSIDERATIONS
- Performance optimizations (lazy loading, image optimization)
- Accessibility features (ARIA labels, keyboard navigation, color contrast)
- Browser compatibility notes
- Animation/transition libraries needed
- Potential challenges and solutions

### 7. ACTIONABLE NEXT STEPS
Provide a checklist of immediate tasks:
1. [ ] Create color palette in Tailwind config
2. [ ] Set up typography system
3. [ ] Build base components (Button, Input, Card)
4. [ ] Implement layout structure
5. [ ] Add responsive breakpoints
6. [ ] Implement interactive states
7. [ ] Add animations/transitions
8. [ ] Test accessibility
9. [ ] Optimize performance

## OUTPUT FORMAT:
Provide a detailed, structured analysis following the framework above. Be specific with measurements, colors, and implementation details. Include Tailwind CSS class suggestions where applicable.`;

    const imagePart = {
      inlineData: {
        data: imageData.split(",")[1],
        mimeType: imageData.includes("jpeg") || imageData.includes("jpg") ? "image/jpeg" : "image/png",
      },
    };

    const result = await getGenAI().models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: prompt }, imagePart] }],
      config: {
        temperature: 0.4, // Lower temperature for more accurate, detailed analysis
        topP: 0.9,
        maxOutputTokens: 4096, // More tokens for comprehensive analysis
      },
    });

    const analysisText = result.text || "Unable to analyze design.";
    
    if (analysisText.length < 100) {
      throw new Error("Analysis response was too short or empty");
    }

    return analysisText;
  } catch (error) {
    console.error("Design analysis error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`Failed to analyze design: ${errorMessage}. Please ensure the image is clear and try again.`);
  }
}

const CHAT_SYSTEM_CONTEXT = `You are an expert coding assistant helping developers build web applications. You provide:

**Code Help:**
- Debug issues and fix errors
- Explain code concepts clearly
- Suggest best practices and optimizations
- Review code for improvements
- Answer technical questions about React, TypeScript, Node.js, databases, etc.

**Communication Style:**
- Be concise but thorough
- Use code examples when helpful
- Explain complex concepts in simple terms
- Ask clarifying questions if needed
- Provide step-by-step guidance for complex tasks

**Focus Areas:**
- Modern web development (React, Next.js, TypeScript)
- Backend development (Node.js, Express, APIs)
- Databases (PostgreSQL, MongoDB)
- UI/UX implementation with Tailwind CSS
- Best practices for security, performance, accessibility

When providing code:
- Always include necessary imports
- Use TypeScript with proper types
- Follow modern React patterns
- Include error handling
- Make code production-ready`;

export async function chatWithAI(
  message: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<{ response: string; metadata?: string }> {
  try {
    // Add system context as the first message if history is empty
    const contents = [];
    
    if (conversationHistory.length === 0) {
      contents.push({
        role: "user",
        parts: [{ text: CHAT_SYSTEM_CONTEXT }],
      });
      contents.push({
        role: "model",
        parts: [{ text: "I understand. I'm ready to help you with coding questions, debugging, and web development. How can I assist you today?" }],
      });
    }

    // Add conversation history
    conversationHistory.forEach((msg) => {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      });
    });

    // Add current message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const result = await getGenAI().models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents,
      config: {
        temperature: 0.7, // Balanced for helpful, consistent responses
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });

    const responseText = result.text || "No response generated.";
    
    if (responseText.length < 10) {
      throw new Error("Response was too short or empty");
    }

    try {
      const parsed = JSON.parse(responseText);
      if (parsed.metadata) {
        return {
          response: parsed.explanation || responseText,
          metadata: JSON.stringify(parsed.metadata),
        };
      }
    } catch (e) {
    }

    return { response: responseText };
  } catch (error) {
    console.error("Chat error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`Failed to get response: ${errorMessage}. Please try again.`);
  }
}

export async function generateTests(request: TestGenerationRequest): Promise<string> {
  try {
    const { fileName, fileContent, framework = "React" } = request;
    
    const prompt = `You are an expert in automated testing. Generate comprehensive Vitest/Jest unit tests for the following ${framework} component/code.

**File**: ${fileName}

**Code**:
\`\`\`typescript
${fileContent}
\`\`\`

**Requirements**:
1. Use Vitest syntax (similar to Jest)
2. Test all major functionality and edge cases
3. Use React Testing Library for React components
4. Include tests for:
   - Component rendering
   - User interactions (clicks, input changes)
   - Props validation
   - State changes
   - Error handling
5. Use proper test structure (describe, it/test, expect)
6. Add helpful test descriptions
7. Mock any external dependencies
8. Use data-testid attributes for selecting elements
9. Aim for high test coverage

**Output Format**:
Return ONLY the test code, no explanations. The code should be ready to run.`;

    const result = await getGenAI().models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        temperature: 0.3,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 4096,
      },
    });

    let testCode = result.text || "";
    
    testCode = testCode.replace(/```typescript\n?/g, "").replace(/```tsx\n?/g, "").replace(/```javascript\n?/g, "").replace(/```\n?/g, "");
    
    if (!testCode.includes("describe") && !testCode.includes("test") && !testCode.includes("it")) {
      throw new Error("Generated code doesn't appear to be valid test code");
    }

    return testCode;
  } catch (error) {
    console.error("Test generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`Failed to generate tests: ${errorMessage}`);
  }
}
