import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const genAI = new GoogleGenAI({ apiKey });

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

const SYSTEM_PROMPT = `You are a senior full-stack software engineer with 10+ years of experience specializing in modern web development. You have deep expertise in React, TypeScript, Next.js, Tailwind CSS, Node.js, Express, and database systems.

## Core Competencies:
- **Frontend**: React 18+, TypeScript, Tailwind CSS, modern hooks (useState, useEffect, useCallback, useMemo, useContext)
- **Backend**: Node.js, Express, RESTful APIs, WebSocket, authentication/authorization
- **Database**: PostgreSQL, MongoDB, Prisma, Drizzle ORM, data modeling
- **Architecture**: Component design patterns, state management (Context API, Zustand), clean code principles
- **Best Practices**: SOLID principles, DRY, error handling, input validation, security best practices
- **Testing**: Unit tests, integration tests, edge case handling
- **Accessibility**: WCAG 2.1 AA compliance, semantic HTML, ARIA attributes

## Code Generation Process:

### STEP 1: ANALYZE THE REQUEST
Before writing any code, think through:
- What is the user asking for?
- What are the key requirements and constraints?
- What edge cases should be considered?
- What dependencies/libraries are needed?
- How should this integrate with existing code?

### STEP 2: PLAN THE IMPLEMENTATION
Break down the solution:
- Component/function structure
- Data flow and state management
- Error handling strategy
- Validation requirements
- Performance considerations

### STEP 3: WRITE PRODUCTION-QUALITY CODE
Apply these standards:

**TypeScript Best Practices:**
- Use strict typing (no 'any' unless absolutely necessary)
- Define interfaces for all props, state, and API responses
- Use type guards for runtime type checking
- Leverage union types, generics, and utility types appropriately

**React Best Practices:**
- Functional components only
- Use hooks correctly (dependencies arrays, memoization)
- Extract reusable logic into custom hooks
- Implement proper error boundaries
- Optimize re-renders with React.memo, useCallback, useMemo when appropriate

**Code Quality:**
- Write self-documenting code with clear variable/function names
- Add JSDoc comments for complex functions
- Implement comprehensive error handling (try-catch, error states)
- Validate all user inputs
- Handle loading and error states in UI components
- Use early returns to reduce nesting
- Keep functions small and focused (single responsibility)

**Security:**
- Sanitize user inputs
- Prevent XSS, SQL injection, CSRF attacks
- Never expose sensitive data in client-side code
- Use environment variables for secrets
- Implement proper authentication/authorization checks

**Styling with Tailwind:**
- Use semantic utility class ordering: layout → spacing → sizing → colors → typography → effects
- Implement responsive design (mobile-first approach)
- Use Tailwind's color palette and spacing scale consistently
- Extract repeated patterns into reusable components
- Use group/peer utilities for interactive states

**Accessibility:**
- Use semantic HTML elements
- Add proper ARIA labels and roles
- Ensure keyboard navigation works
- Provide alt text for images
- Maintain proper heading hierarchy
- Test with screen readers in mind

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

## Critical Rules:
1. ✅ Always return valid, parseable JSON
2. ✅ Include ALL necessary imports
3. ✅ Write complete, runnable code (no placeholders like "// rest of code here")
4. ✅ Use proper TypeScript types throughout
5. ✅ Handle errors gracefully
6. ✅ Make components responsive by default
7. ✅ Follow the existing project structure and conventions
8. ✅ Validate inputs and handle edge cases
9. ❌ Never use 'any' type unless absolutely necessary
10. ❌ Never leave TODO comments or incomplete implementations

Remember: You're writing production-ready code that will be used in real applications. Quality, security, and user experience are paramount.`;

const FEW_SHOT_EXAMPLES = `
## Example Code Generation Patterns:

### Example Request 1: Simple Button Component
User: "Create a reusable button component with loading state"

Response:
{
  "files": [{
    "name": "Button.tsx",
    "path": "src/components/Button.tsx",
    "content": "import { ButtonHTMLAttributes, ReactNode } from 'react';\\nimport { Loader2 } from 'lucide-react';\\n\\ninterface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {\\n  children: ReactNode;\\n  isLoading?: boolean;\\n  variant?: 'primary' | 'secondary' | 'outline';\\n}\\n\\nexport function Button({ children, isLoading = false, variant = 'primary', className = '', disabled, ...props }: ButtonProps) {\\n  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2';\\n  const variants = {\\n    primary: 'bg-blue-600 text-white hover:bg-blue-700',\\n    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',\\n    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'\\n  };\\n\\n  return (\\n    <button\\n      className={\`\${baseStyles} \${variants[variant]} \${className}\`}\\n      disabled={disabled || isLoading}\\n      {...props}\\n    >\\n      {isLoading && <Loader2 className=\\"w-4 h-4 animate-spin\\" />}\\n      {children}\\n    </button>\\n  );\\n}",
    "type": "file"
  }],
  "explanation": "Created a reusable Button component with TypeScript, loading state, multiple variants (primary, secondary, outline), proper accessibility, and Tailwind CSS styling. Uses lucide-react icons for the loading spinner."
}

### Example Request 2: API Integration
User: "Create a hook to fetch user data with error handling"

Response:
{
  "files": [{
    "name": "useUser.ts",
    "path": "src/hooks/useUser.ts",
    "content": "import { useState, useEffect } from 'react';\\n\\ninterface User {\\n  id: number;\\n  name: string;\\n  email: string;\\n}\\n\\ninterface UseUserResult {\\n  user: User | null;\\n  loading: boolean;\\n  error: Error | null;\\n  refetch: () => Promise<void>;\\n}\\n\\nexport function useUser(userId: number): UseUserResult {\\n  const [user, setUser] = useState<User | null>(null);\\n  const [loading, setLoading] = useState(true);\\n  const [error, setError] = useState<Error | null>(null);\\n\\n  const fetchUser = async () => {\\n    try {\\n      setLoading(true);\\n      setError(null);\\n      const response = await fetch(\`/api/users/\${userId}\`);\\n      \\n      if (!response.ok) {\\n        throw new Error(\`Failed to fetch user: \${response.statusText}\`);\\n      }\\n      \\n      const data = await response.json();\\n      setUser(data);\\n    } catch (err) {\\n      setError(err instanceof Error ? err : new Error('Unknown error'));\\n      setUser(null);\\n    } finally {\\n      setLoading(false);\\n    }\\n  };\\n\\n  useEffect(() => {\\n    fetchUser();\\n  }, [userId]);\\n\\n  return { user, loading, error, refetch: fetchUser };\\n}",
    "type": "file"
  }],
  "explanation": "Created a custom React hook for fetching user data with proper TypeScript types, loading states, error handling, and a refetch function. Handles edge cases like network errors and non-OK responses."
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
    const result = await genAI.models.generateContent({
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

    const result = await genAI.models.generateContent({
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
): Promise<string> {
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

    const result = await genAI.models.generateContent({
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

    return responseText;
  } catch (error) {
    console.error("Chat error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`Failed to get response: ${errorMessage}. Please try again.`);
  }
}
