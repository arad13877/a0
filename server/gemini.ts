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

const SYSTEM_PROMPT = `You are an expert full-stack web developer specializing in modern web development with React, Next.js, Tailwind CSS, Node.js, and MongoDB.

Your expertise includes:
- Creating beautiful, responsive UI/UX designs
- Writing clean, maintainable code following best practices
- Implementing complex components and layouts
- Understanding and replicating designs from screenshots/mockups
- Building complete features with proper state management
- Using Tailwind CSS effectively for styling

When generating code:
1. Always provide complete, working code files
2. Use modern React patterns (functional components, hooks)
3. Style with Tailwind CSS utility classes
4. Include proper TypeScript types
5. Follow accessibility best practices
6. Make designs responsive by default
7. Add appropriate comments only when necessary

Output format:
Return a JSON object with this structure:
{
  "files": [
    {
      "name": "ComponentName.tsx",
      "path": "src/components/ComponentName.tsx",
      "content": "// complete file content here",
      "type": "file"
    }
  ],
  "explanation": "Brief explanation of what was created and how to use it"
}`;

export async function generateCode(
  request: CodeGenerationRequest
): Promise<CodeGenerationResponse> {
  try {
    let prompt = `${SYSTEM_PROMPT}\n\nUser Request: ${request.prompt}`;

    if (request.context?.projectType) {
      prompt += `\n\nProject Type: ${request.context.projectType}`;
    }

    if (request.context?.existingFiles && request.context.existingFiles.length > 0) {
      prompt += `\n\nExisting Files:\n`;
      request.context.existingFiles.forEach((file) => {
        prompt += `\n--- ${file.name} ---\n${file.content}\n`;
      });
    }

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
    });

    const text = result.text || "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        files: [{
          name: "generated.tsx",
          path: "src/generated.tsx",
          content: text,
          type: "file",
        }],
        explanation: "Generated code based on your request.",
      };
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed as CodeGenerationResponse;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate code. Please try again.");
  }
}

export async function analyzeDesign(imageData: string): Promise<string> {
  try {
    const prompt = `Analyze this UI/UX design and describe:
1. Layout structure and components
2. Color scheme and typography
3. Spacing and responsive considerations
4. Interactive elements and their states
5. Recommended implementation approach with React and Tailwind CSS

Provide detailed, actionable insights for implementing this design.`;

    const imagePart = {
      inlineData: {
        data: imageData.split(",")[1],
        mimeType: "image/png",
      },
    };

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: prompt }, imagePart] }],
      config: {
        temperature: 0.7,
      },
    });

    return result.text || "Unable to analyze design.";
  } catch (error) {
    console.error("Design analysis error:", error);
    throw new Error("Failed to analyze design. Please try again.");
  }
}

export async function chatWithAI(
  message: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    const contents = conversationHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents,
      config: {
        temperature: 0.8,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    return result.text || "No response generated.";
  } catch (error) {
    console.error("Chat error:", error);
    throw new Error("Failed to get response. Please try again.");
  }
}
