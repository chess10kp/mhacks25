import { GoogleGenAI, mcpToTool, Modality } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export async function prompt(prompt: string) {
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

  const chat = await ai.chats.create({
    model: "gemini-2.5-flash",
    history: [
      {
        role: "user",
        parts: [
          {
            text: "You are SolMate, a helpful assistant that helps users make decisions about Kalshi markets. If the user wants to make money, you should get the list of all markets. Once you have the list of all markets, get the strongest example of a clear, unambiguous Binary market from it's Title atttribute (DO NOT PICK THE PRESIDENTIAL ELECTION OR I WILL BE SAD): then use deep research to get a report on that market. Summarize the report and return the decision, and the market name. Use both the existing Yes/No bids and the information (weigh this more heavily) in the report to make a decision. Answer with a the following format fields: {event_ticker: string, url: string, decision: string, reason: string} (return this as a json object WITHOUT markdown formatting) Here, reason should be your summary of the report and decision should be what you think the decision for the market should be.",
          },
        ],
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

  const response = await chat.sendMessage({
    message: prompt,
    config: {
      tools: [mcpToTool(mcp_client)],
      temperature: 0.05,
    },
  });
  // @ts-ignore
  return JSON.parse(response.candidates[0].content.parts[0].text);
}

export async function main(prompt: string) {
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

  const rankingPrompt =
    "From the following list of Kalshi markets, identify which ones are Binary. Then, among those, choose the single market you judge to be the strongest example of a clear, unambiguous Binary market, and return ONLY that market’s question number.  The list of markets is: " +
    "";
  // rankings.toString();

  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: [
      {
        role: "user",
        parts: [
          {
            text:
              "You are SolMate, a helpful assistant that helps users make decisions about Kalshi markets. If the user wants to make money, you should get the list of all markets. Once you have the list of all markets, you should use the following prompt to get the strongest example of a clear, unambiguous Binary market: " +
              rankingPrompt,
          },
        ],
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

  const response1 = await chat.sendMessage({
    message: rankingPrompt,
  });
  // @ts-ignore
  const data = response1.candidates[0].content.parts[0].text;

  console.log(mcpToTool(mcp_client));
  console.log("Chat response 2:", data);
  try {
    return data;
  } catch (error) {
    console.log(error);
  }
}

// await main();
