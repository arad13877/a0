# 🎨 Design Patterns Reference Guide
## الگوهای طراحی حرفه‌ای برای تولید UI/UX بهتر

این فایل مرجع شامل بهترین شیوه‌های طراحی از معتبرترین سیستم‌های طراحی دنیا است.

---

## 📐 1. Grid System & Layout Patterns

### 8px Grid System (استاندارد صنعت)
```
Base Unit: 8px

Button Heights:
- Small: 32px (4 × 8px)
- Medium: 40px (5 × 8px) 
- Large: 48px (6 × 8px)
- XL: 56px (7 × 8px)

Spacing Scale:
- XXS: 4px
- XS: 8px
- SM: 16px
- MD: 24px
- LG: 32px
- XL: 48px
- XXL: 64px
- XXXL: 96px

Container Padding:
- Mobile: 16px
- Tablet: 24px
- Desktop: 32px
```

### Responsive Breakpoints (مطابق با Tailwind)
```css
/* Mobile First Approach */
xs: 0px       /* Phones (portrait) */
sm: 640px     /* Phones (landscape) */
md: 768px     /* Tablets */
lg: 1024px    /* Laptops */
xl: 1280px    /* Desktops */
2xl: 1536px   /* Large Screens */

Max Container Width:
- Mobile: 100% (with 16px padding)
- Tablet: 768px
- Desktop: 1280px
- Wide: 1536px
```

### Column Grid
```
Mobile (< 640px): 4 columns, 16px gap
Tablet (640-1024px): 8 columns, 24px gap
Desktop (> 1024px): 12 columns, 24px gap
```

---

## 🎨 2. Color System Patterns

### Professional Color Palette Structure
```typescript
// از Material Design و Tailwind الهام گرفته شده

Primary Colors: (9 shades)
50:  /* Lightest - backgrounds */
100-200: /* Light - hover states */
300-500: /* Medium - borders, disabled */
600: /* Main - primary actions */
700-800: /* Dark - hover on primary */
900: /* Darkest - text on light bg */

Example Structure:
primary: {
  50: '#EFF6FF',   // Background tints
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#3B82F6',
  600: '#2563EB',  // Main brand color
  700: '#1D4ED8',
  800: '#1E40AF',
  900: '#1E3A8A'
}
```

### Semantic Colors
```typescript
semantic: {
  success: '#10B981',    // Green - confirmations
  warning: '#F59E0B',    // Amber - alerts
  error: '#EF4444',      // Red - errors
  info: '#3B82F6',       // Blue - informational
  
  // Backgrounds
  bg: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6'
  },
  
  // Text
  text: {
    primary: '#111827',    // Main text (900)
    secondary: '#6B7280',  // Secondary text (500)
    tertiary: '#9CA3AF',   // Muted text (400)
    disabled: '#D1D5DB'    // Disabled (300)
  }
}
```

### Dark Mode Colors
```typescript
dark: {
  bg: {
    primary: '#0F172A',    // slate-900
    secondary: '#1E293B',  // slate-800
    tertiary: '#334155'    // slate-700
  },
  text: {
    primary: '#F1F5F9',    // slate-100
    secondary: '#94A3B8',  // slate-400
    tertiary: '#64748B'    // slate-500
  }
}
```

---

## ✍️ 3. Typography System

### Font Scale (Type Scale)
```css
/* Modular Scale: 1.25 (Major Third) */

Display:
- 2XL: 72px / 5rem   (line-height: 1.1)
- XL: 60px / 3.75rem (line-height: 1.1)
- LG: 48px / 3rem    (line-height: 1.2)

Headings:
- H1: 36px / 2.25rem (line-height: 1.2)
- H2: 30px / 1.875rem (line-height: 1.3)
- H3: 24px / 1.5rem   (line-height: 1.3)
- H4: 20px / 1.25rem  (line-height: 1.4)
- H5: 18px / 1.125rem (line-height: 1.4)
- H6: 16px / 1rem     (line-height: 1.5)

Body:
- Large: 18px / 1.125rem (line-height: 1.6)
- Base: 16px / 1rem      (line-height: 1.5)
- Small: 14px / 0.875rem (line-height: 1.5)
- XSmall: 12px / 0.75rem (line-height: 1.4)

Font Weights:
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800
```

### Font Families
```css
/* Modern Stack */
font-family: {
  sans: 'Inter, system-ui, -apple-system, sans-serif',
  serif: 'Georgia, Cambria, serif',
  mono: 'JetBrains Mono, Fira Code, monospace'
}

/* Letter Spacing */
tracking: {
  tighter: -0.05em,
  tight: -0.025em,
  normal: 0,
  wide: 0.025em,
  wider: 0.05em
}
```

---

## 🔘 4. Component Design Patterns

### Button Component
```typescript
// Based on Radix UI & shadcn/ui

Variants:
- Primary: Solid background, high contrast
- Secondary: Subtle background, lower contrast
- Outline: Border only, transparent background
- Ghost: No background, hover shows background
- Link: No background/border, underline on hover

Sizes:
- XS: h-7 px-2 text-xs   (28px height)
- SM: h-9 px-3 text-sm   (36px height)
- MD: h-10 px-4 text-base (40px height)
- LG: h-11 px-6 text-base (44px height)
- XL: h-12 px-8 text-lg   (48px height)

States:
- Default: Base styles
- Hover: Slightly darker/lighter
- Active: More pronounced change
- Disabled: 50% opacity, cursor-not-allowed
- Loading: Spinner icon, disabled state

Border Radius:
- Sharp: 0px
- Subtle: 4px
- Rounded: 8px
- Full: 9999px (pill shape)

Example Usage:
<Button variant="primary" size="md" disabled={loading}>
  {loading && <Spinner />}
  Submit
</Button>
```

### Input Component
```typescript
// Professional form inputs

Sizes:
- SM: h-9 px-3 text-sm
- MD: h-10 px-3 text-base
- LG: h-11 px-4 text-base

States:
- Default: Border gray-300, focus ring
- Focus: Border primary-500, ring-2
- Error: Border red-500, ring red-200
- Disabled: bg-gray-100, cursor-not-allowed
- Success: Border green-500

Features:
- Label above input
- Helper text below
- Error message in red
- Character count (optional)
- Leading/trailing icons
- Clear button (×)

Validation:
- Real-time validation on blur
- Show error state immediately
- Success checkmark when valid
```

### Card Component
```typescript
// Versatile container pattern

Variants:
- Flat: No shadow, subtle border
- Elevated: Box shadow for depth
- Outlined: Border only
- Filled: Subtle background color

Padding:
- Compact: p-4 (16px)
- Default: p-6 (24px)
- Spacious: p-8 (32px)

Structure:
┌─────────────────────────┐
│ Card Header (optional)  │ <- Title, subtitle, actions
├─────────────────────────┤
│                         │
│   Card Content          │ <- Main content area
│                         │
├─────────────────────────┤
│ Card Footer (optional)  │ <- Actions, metadata
└─────────────────────────┘

Hover Effects:
- Subtle lift: translate-y-1
- Shadow increase: shadow-md → shadow-lg
- Border highlight: border-primary-200
```

### Modal/Dialog
```typescript
// Accessible overlay patterns

Sizes:
- SM: max-w-sm (384px)
- MD: max-w-md (448px)
- LG: max-w-lg (512px)
- XL: max-w-xl (576px)
- 2XL: max-w-2xl (672px)
- Full: max-w-full with padding

Features:
- Backdrop overlay (bg-black/50)
- Close on backdrop click
- Close on ESC key
- Focus trap inside modal
- Return focus on close
- Scroll lock on body

Structure:
- Header: Title + close button
- Content: Scrollable area
- Footer: Action buttons (Cancel, Confirm)

Animation:
- Enter: fade + scale from 95% to 100%
- Exit: fade + scale to 95%
- Duration: 200ms ease-in-out
```

---

## 📱 5. Responsive Design Patterns

### Mobile-First CSS Structure
```css
/* Base: Mobile styles (default) */
.component {
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    padding: 1.5rem;
    flex-direction: row;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component {
    padding: 2rem;
    max-width: 1280px;
    margin: 0 auto;
  }
}
```

### Auto-Responsive Grid
```css
/* Grid that adapts without media queries */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* For cards: minimum 280px, maximum 1 column share */
/* Automatically creates 1, 2, 3, or 4 columns based on space */
```

### Fluid Typography
```css
/* Typography that scales smoothly */
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
  /* Min: 32px, Scales: 5% viewport, Max: 64px */
}

body {
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  /* Min: 16px, Scales: 2.5% viewport, Max: 18px */
}
```

### Container Queries (Modern Approach)
```css
/* Component adapts to parent container, not viewport */
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}

@container (min-width: 600px) {
  .card {
    padding: 2rem;
  }
}
```

---

## ♿ 6. Accessibility Patterns

### WCAG 2.1 AA Compliance

#### Color Contrast
```
Text: Minimum 4.5:1 contrast ratio
Large text (18px+): Minimum 3:1 contrast ratio
UI Components: Minimum 3:1 contrast ratio

Good Combinations:
- White (#FFFFFF) on Blue (#0066CC) = 7.7:1 ✅
- Black (#000000) on White (#FFFFFF) = 21:1 ✅
- Gray-700 (#374151) on White = 12.6:1 ✅

Bad Combinations:
- Light Gray (#E5E5E5) on White = 1.3:1 ❌
- Yellow (#FFFF00) on White = 1.1:1 ❌
```

#### Touch Targets
```
Minimum size: 44×44px (iOS) / 48×48px (Android)

Apply to:
- Buttons
- Links
- Form controls (checkboxes, radio buttons)
- Icon buttons
- Dropdown triggers

padding: min(0.75rem, calc(44px - icon-size) / 2);
```

#### Focus States
```css
/* Visible focus indicator */
:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}

/* Remove default outline, add custom ring */
button:focus-visible {
  outline: none;
  ring: 2px solid hsl(var(--primary));
  ring-offset: 2px;
}
```

#### Semantic HTML
```html
<!-- Use proper heading hierarchy -->
<h1>Page Title</h1>
  <h2>Section Title</h2>
    <h3>Subsection</h3>

<!-- Use semantic elements -->
<nav>Navigation</nav>
<main>Main Content</main>
<aside>Sidebar</aside>
<footer>Footer</footer>

<!-- Accessible forms -->
<label htmlFor="email">Email</label>
<input 
  id="email" 
  type="email"
  aria-describedby="email-hint"
  aria-invalid={hasError}
/>
<span id="email-hint">We'll never share your email</span>
```

#### ARIA Labels
```html
<!-- Icon-only buttons -->
<button aria-label="Close dialog">
  <X className="w-4 h-4" />
</button>

<!-- Loading states -->
<button disabled aria-busy="true">
  Loading...
</button>

<!-- Status messages -->
<div role="status" aria-live="polite">
  Form submitted successfully
</div>

<!-- Error messages -->
<div role="alert" aria-live="assertive">
  Please fix the errors below
</div>
```

---

## 🎯 7. Animation & Interaction Patterns

### Timing & Duration
```css
/* Based on Material Design */
durations: {
  fast: '100ms',      /* Small UI changes */
  base: '200ms',      /* Most transitions */
  slow: '300ms',      /* Complex animations */
  slower: '500ms'     /* Page transitions */
}

/* Easing functions */
easing: {
  'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
  'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
  'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
}
```

### Common Animations
```css
/* Fade in/out */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide in from bottom */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale on hover */
.card:hover {
  transform: scale(1.02);
  transition: transform 200ms ease-out;
}

/* Button press effect */
.button:active {
  transform: scale(0.98);
}
```

### Loading States
```typescript
// Skeleton loaders
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>

// Spinner
<div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-primary-600"></div>

// Progress bar
<div className="w-full bg-gray-200 rounded-full h-2">
  <div className="bg-primary-600 h-2 rounded-full transition-all" style={{width: `${progress}%`}}></div>
</div>
```

---

## 📊 8. Form Design Patterns

### Form Layout
```html
<!-- Vertical form (recommended for mobile) -->
<form className="space-y-6">
  <div>
    <label htmlFor="name" className="block text-sm font-medium mb-2">
      Name
    </label>
    <input 
      id="name"
      type="text"
      className="w-full h-10 px-3 border rounded-lg"
    />
  </div>
</form>

<!-- Horizontal form (desktop, short forms) -->
<form className="space-y-4">
  <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
    <label htmlFor="email">Email</label>
    <input id="email" type="email" />
  </div>
</form>
```

### Validation Patterns
```typescript
// Validation states
enum ValidationState {
  Idle,      // Not yet validated
  Validating,// Checking...
  Valid,     // ✓ Success
  Invalid    // ✗ Error with message
}

// Show validation:
- On blur (when user leaves field)
- On submit (validate all at once)
- Real-time for password strength
- Debounced for API calls (username availability)

// Visual indicators:
Valid: ✓ Green border + checkmark icon
Invalid: ✗ Red border + error message below
Validating: ⟳ Blue border + spinner
```

### Multi-Step Forms
```typescript
// Wizard pattern with progress indicator
┌─────────────────────────────────┐
│ Step 1 → Step 2 → Step 3 → Step 4 │ <- Progress bar
├─────────────────────────────────┤
│                                 │
│   Current Step Content          │
│                                 │
├─────────────────────────────────┤
│  [← Back]           [Next →]    │ <- Navigation
└─────────────────────────────────┘

Features:
- Show current step
- Disable future steps
- Allow going back
- Save progress
- Summary on last step
```

---

## 🎨 9. Best Design Systems to Reference

### 1. **Untitled UI** (10,000+ components)
```
استفاده: SaaS apps, dashboards, admin panels
ویژگی‌ها:
- بزرگترین کتابخانه کامپوننت
- Auto Layout 5.0
- 350+ استایل از پیش ساخته
- مورد استفاده: Spotify, Mailchimp, Webflow

الگوها برای استفاده:
- Card layouts با shadows متفاوت
- Form groups با validation states
- Data tables با sorting/filtering
- Complex navigation patterns
```

### 2. **Material Design 3** (Google)
```
استفاده: Android apps, modern web
ویژگی‌ها:
- Dynamic color system
- Motion design patterns
- Accessibility built-in
- Component animations

الگوها برای استفاده:
- Floating Action Button (FAB)
- Bottom Navigation
- Snackbar notifications
- Material elevation system
```

### 3. **Radix UI + shadcn/ui** (در پروژه موجود)
```
استفاده: React applications
ویژگی‌ها:
- Unstyled primitives
- Full accessibility
- Customizable with Tailwind
- TypeScript support

الگوها برای استفاده:
- Dropdown menus
- Popovers
- Dialog/Modal
- Accordion
- Tabs
- Toast notifications
```

### 4. **Apple Human Interface Guidelines**
```
استفاده: iOS/macOS apps
ویژگی‌ها:
- Native feel
- Gesture patterns
- SF Symbols icons
- Clarity & depth

الگوها برای استفاده:
- Large titles
- Swipe actions
- Pull to refresh
- Modal presentations
```

---

## 💡 10. Quick Implementation Checklist

عند تولید کد، همیشه این موارد را بررسی کنید:

### ✅ Layout
- [ ] استفاده از 8px grid system
- [ ] Responsive در همه breakpoint ها
- [ ] Max-width برای خوانایی متن (≤800px)
- [ ] Padding مناسب در mobile (16px minimum)

### ✅ Typography
- [ ] Hierarchy واضح (H1 > H2 > H3)
- [ ] Line height مناسب (1.5 برای body)
- [ ] Contrast کافی برای خوانایی
- [ ] Font size حداقل 16px برای body

### ✅ Colors
- [ ] System color palette با 9 shade
- [ ] Dark mode support
- [ ] WCAG AA compliance (4.5:1 contrast)
- [ ] Semantic colors (success, error, warning)

### ✅ Components
- [ ] Consistent sizing (SM, MD, LG)
- [ ] All interactive states (hover, active, disabled)
- [ ] Loading states با spinner/skeleton
- [ ] Error states با پیام واضح

### ✅ Accessibility
- [ ] Touch targets ≥ 48px
- [ ] Focus states مشخص
- [ ] ARIA labels برای icon buttons
- [ ] Semantic HTML
- [ ] Keyboard navigation

### ✅ Responsive
- [ ] Mobile-first approach
- [ ] Breakpoints استاندارد
- [ ] Auto-responsive grids
- [ ] Fluid typography با clamp()

### ✅ Performance
- [ ] Optimize images (WebP)
- [ ] Lazy loading برای تصاویر
- [ ] Minimize re-renders (React.memo)
- [ ] Code splitting

---

## 📚 منابع و لینک‌های مفید

### Design Systems
- Untitled UI: https://www.untitledui.com
- Material Design 3: https://m3.material.io
- Radix UI: https://www.radix-ui.com
- shadcn/ui: https://ui.shadcn.com

### Tools & Plugins
- Figma Config 2025: https://config.figma.com
- AI Design Reviewer (Figma plugin)
- Stark (Accessibility checker)
- Magic Patterns (AI UI generation)

### Learning Resources
- Refactoring UI: https://www.refactoringui.com
- Laws of UX: https://lawsofux.com
- Web Accessibility: https://www.w3.org/WAI/WCAG21/quickref

---

**این فایل مرجع باید همیشه هنگام تولید کد توسط AI مورد استفاده قرار گیرد تا UI/UX حرفه‌ای و کاربرپسند تولید شود.**
