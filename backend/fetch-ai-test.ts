// fetch-ai-test.ts
// Run with: npx ts-node fetch-ai-test.ts

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

async function testASI() {
  try {
    console.log("Testing ASI AI API...");
    
    const res = await fetch("https://api.asi1.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.ASI_ONE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "asi1-mini",
        messages: [{ 
          role: "user", 
          content: "find information about the 2028 presidential election and who is running and who will maybe win do an analysis" 
        }]
      })
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }

    const response = await res.json() as AIResponse;
    console.log("AI Response:");
    console.log(response.choices[0].message.content);
    
  } catch (error) {
    console.error("Error:", error);
  }
}

testASI();
