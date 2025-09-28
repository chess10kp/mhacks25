import { GoogleGenAI, mcpToTool } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
import readline from "readline";
import { Readable, Writable } from "stream";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export async function main(rankings: string[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const mcp_client = new Client({
    name: "solmate-mcp-client",
    version: "0.0.1",
  });

  const serverParams = new StreamableHTTPClientTransport(
    new URL("http://localhost:8080/mcp")
  );

  await mcp_client.connect(serverParams, {
    timeout: 60000,
  });

  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
    config: {
      tools: [mcpToTool(mcp_client)],
      temperature: 0.05,
    },
  });

  const rankingPrompt =
    "From the following list of Kalshi markets, identify which ones are Binary. Then, among those, choose the single market you judge to be the strongest example of a clear, unambiguous Binary market, and return ONLY that market’s question number.  The list of markets is: " +
    rankings.toString();

  const response1 = await chat.sendMessage({
    message: rankingPrompt,
  });
  const data = response1.candidates[0].content.parts[0].text;

  console.log("Chat response 1:", data);
  try {
    return data;
  } catch (error) {
    console.log(error);
  }
}

// await main();
