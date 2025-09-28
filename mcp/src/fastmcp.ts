import { FastMCP } from "fastmcp";
import { z } from "zod";
import { balance, sendSolana } from "../../backend/src/solanaWallet";
import { api } from "../../frontend/src/services/api";

const server = new FastMCP({
  name: "SolMSolMate MCPate MCP",
  version: "1.0.0",
});

server.addTool({
  name: "add",
  description: "Add two numbers",
  parameters: z.object({
    a: z.number(),
    b: z.number(),
  }),
  execute: async ({ a, b }) => {
    return (a + b).toString();
  },
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
    const balance = await api.getBalance(
      "JBRY8xCWQoN73uebF4FczDoZdBN7QQbdVKMv5jbdMTPJ"
    );
    return balance.toString();
  },
});

server.addTool({
  name: "solanaBalance",
  description: "Get the balance of a Solana address",
  execute: async () => {
    const balance = await api.getBalance(
      "JBRY8xCWQoN73uebF4FczDoZdBN7QQbdVKMv5jbdMTPJ"
    );
    return balance.toString();
  },
});

server.addTool({
  name: "getMarket",
});

server.start({
  transportType: "httpStream",
});
