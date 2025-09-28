import { FastMCP } from "fastmcp";
import { z } from "zod";
import { balance, sendSolana } from "../../backend/src/solanaWallet.ts";
import { api } from "../../frontend/src/services/api.ts";
import { main } from "../../backend/kalshi-trending.ts";
import { getKalshiBalance } from "../../backend/kalshi-test.ts";
import { testASI } from "../../backend/fetch-ai-test.ts";

const server = new FastMCP({
  name: "SolMate MCP",
  version: "1.0.0",
  instructions: "<TODO:>",
});

server.addTool({
  name: "send",
  description: "Send SOL to a Solana address",
  parameters: z.object({
    fromPrivateKey: z.string().describe("The private key of the sender"),
    toPublicKey: z.string().describe("The public key of the recipient"),
    amount: z.number().describe("The amount of SOL to send"),
  }),
  execute: async ({ fromPrivateKey, toPublicKey, amount }) => {
    const result = await sendSolana(fromPrivateKey, toPublicKey, amount);
    return result ? "Transaction sent successfully" : "Transaction failed";
  },
});

server.addTool({
  name: "kalshiBalance",
  description: "Get the balance of a Kalshi account",
  execute: async () => {
    const apiKeys = await (
      await fetch("http://localhost:3001/api/kalshi-api-key")
    ).json();
    const balance = await getKalshiBalance(apiKeys.privateKey, apiKeys.apiKey);
    return balance["balance"].toString();
  },
});

server.addTool({
  name: "getMarkets",
  description: "Get the top 10 markets",
  execute: async () => {
    const ranking = await main();
    return ranking;
  },
});

server.addTool({
  name: "deepResearch",
  description: "Deep Research with the Web",
  parameters: z.object({
    prompt: z.string().describe("The prompt to research"),
  }),
  execute: async ({ prompt }: { prompt: string }) => {
    const result = await testASI(prompt);
    return result;
  },
});

server.addTool({
  name: "solanaBalance",
  description: "Get the balance of a Solana address",
  execute: async () => {
    const balance = await api.getBalance(
      "JBRY8xCWQoN73uebF4FczDoZdBN7QQbdVKMv5jbdMTPJ"
    );
    return balance["balance"].toString();
  },
});

server.start({
  transportType: "httpStream",
});
