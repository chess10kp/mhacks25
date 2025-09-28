import { FastMCP } from "fastmcp";
import { z } from "zod";
import { balance, sendSolana } from "../../backend/src/solanaWallet.ts";
import { api } from "../../frontend/src/services/api.ts";
import { main } from "../../backend/kalshi-trending.ts";
import { getKalshiBalance } from "../../backend/kalshi-test.ts";
import { testASI } from "../../backend/fetch-ai-test.ts";
import {
  findOpenMarket,
  placeBuyOrder,
  listAllOrders,
  cancelOrder,
  amendOrder,
} from "../../backend/kalshi-buy-order.ts";

const magicLoops = async (prompt: string) => {
  const response = await fetch(
    "https://magicloops.dev/api/loop/0d2fe962-7a7f-4357-9583-527dd425f23c/run",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: prompt,
      }),
    }
  );
  const data = await response.json();
  console.log(data);
  return data.report;
};

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
    prompt: z
      .string()
      .describe(
        "The prompt to research: make it as specific as possible so that the report gatheres all the information needed to make a decision"
      ),
  }),
  execute: async ({ prompt }: { prompt: string }) => {
    const result = await magicLoops(prompt);
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

server.addTool({
  name: "placeBuyOrder",
  description: "Place a buy order on Kalshi",
  parameters: z.object({
    ticker: z.string().describe("The market ticker to place order on"),
    side: z.enum(["yes", "no"]).describe("The side of the order (yes or no)"),
    count: z.number().describe("The number of shares to buy"),
    price: z
      .number()
      .optional()
      .describe(
        "The price in cents (optional, will use market price + 1 if not provided)"
      ),
  }),
  execute: async ({ ticker, side, count, price }) => {
    // First get the market data
    const market = await findOpenMarket();

    // If no price provided, use market price + 1
    const orderPrice = price || (market.last_price || market.yes_bid) + 1;

    // Create order data
    const orderData = {
      ticker,
      action: "buy",
      side,
      count,
      type: "limit",
      yes_price: orderPrice,
      client_order_id: require("crypto").randomBytes(16).toString("hex"),
    };

    // Use the makeAuthenticatedRequest function
    const { makeAuthenticatedRequest } = await import(
      "../../backend/kalshi-buy-order.ts"
    );
    const response = await makeAuthenticatedRequest(
      "POST",
      "/trade-api/v2/portfolio/orders",
      orderData
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to place order: ${response.status} - ${errorText}`
      );
    }

    const order = await response.json();
    return order.order;
  },
});

server.addTool({
  name: "listAllOrders",
  description: "List all orders on Kalshi",
  execute: async () => {
    const orders = await listAllOrders();
    return orders.map((order) => ({
      order_id: order.order_id,
      client_order_id: order.client_order_id,
      ticker: order.ticker,
      action: order.action,
      side: order.side,
      count: order.count,
      type: order.type,
      yes_price: order.yes_price,
      status: order.status,
      created_time: order.created_time,
    }));
  },
});

server.addTool({
  name: "cancelOrder",
  description: "Cancel an order on Kalshi",
  parameters: z.object({
    orderId: z.string().describe("The ID of the order to cancel"),
  }),
  execute: async ({ orderId }) => {
    await cancelOrder(orderId);
    return `Order ${orderId} canceled successfully`;
  },
});

server.start({
  transportType: "httpStream",
});
