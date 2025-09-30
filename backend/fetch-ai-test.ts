// fetch-ai-test.ts
// Run with: npx ts-node fetch-ai-test.ts or npm run ai-test

import dotenv from "dotenv";

// Load environment variables
dotenv.config();

interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function testASI(prompt: string) {
  try {
    const res = await fetch("https://api.asi1.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.ASI_ONE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "asi1-agentic",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }

    const response = (await res.json()) as AIResponse;
    console.log("AI Response:");
    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
  }
}

// testASI(
//   "Find information about the current situation of the US economy and present a report on why the Fed might cut rates thrice this year, and why they might not. Present the report in a formal tone. Also, give me a summary of the report."
// );
