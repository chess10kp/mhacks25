// kalshi-buy-order.ts
// Run with: npx ts-node kalshi-buy-order.ts or npm run kalshi-buy

import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

interface KalshiMarket {
  ticker: string;
  title: string;
  status: string;
  volume_24h: number;
  liquidity: number;
  last_price: number;
  yes_bid: number;
  no_bid: number;
}

interface KalshiOrder {
  order_id: string;
  client_order_id: string;
  ticker: string;
  action: string;
  side: string;
  count: number;
  type: string;
  yes_price: number;
  status: string;
  created_time: number;
}

interface MarketsResponse {
  markets: KalshiMarket[];
}

function signPssText(privateKeyPem: string, text: string): string {
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(text);
  sign.end();
  const signature = sign.sign({
    key: privateKeyPem,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
  });
  return signature.toString("base64");
}

async function makeAuthenticatedRequest(
  method: string,
  path: string,
  data?: any
): Promise<Response> {
  const apiKey = process.env.KALSHI_API_KEY;
  const privateKey = process.env.KALSHI_PRIVATE_KEY;

  if (!apiKey || !privateKey) {
    throw new Error(
      "KALSHI_API_KEY and KALSHI_PRIVATE_KEY must be set in .env"
    );
  }

  const currentTimeMilliseconds = Date.now();
  const timestampStr = currentTimeMilliseconds.toString();
  const msgString = timestampStr + method + path;
  const signature = signPssText(privateKey, msgString);

  const headers: Record<string, string> = {
    "KALSHI-ACCESS-KEY": apiKey,
    "KALSHI-ACCESS-SIGNATURE": signature,
    "KALSHI-ACCESS-TIMESTAMP": timestampStr,
    "Content-Type": "application/json",
  };

  console.log(`🔐 Making ${method} request to: ${path}`);

  const requestOptions: RequestInit = { method, headers };
  if (data && method === "POST") {
    requestOptions.body = JSON.stringify(data);
  }

  return fetch(`https://api.elections.kalshi.com${path}`, requestOptions);
}

async function findOpenMarket(): Promise<KalshiMarket> {
  console.log("🔍 Step 1: Finding specific test market...");

  // Use the correct endpoint format with ticker as path parameter
  const response = await fetch(
    "https://api.elections.kalshi.com/trade-api/v2/markets/KXNCAAF-26-TTU"
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch market: ${response.status}`);
  }

  const data = (await response.json()) as { market: KalshiMarket };
  const market = data.market;

  console.log("✅ Test Market found:");
  console.log(`   📊 Ticker: ${market.ticker}`);
  console.log(`   📝 Title: ${market.title}`);
  console.log(`   💰 Last Price: ${market.last_price}%`);
  console.log(`   📈 Yes Bid: ${market.yes_bid}% | No Bid: ${market.no_bid}%`);
  console.log(
    `   📊 Volume 24h: ${market.volume_24h} | Liquidity: ${market.liquidity}`
  );

  return market;
}

async function placeBuyOrder(market: KalshiMarket): Promise<KalshiOrder> {
  console.log("\n💰 Step 2: Placing buy order...");

  const clientOrderId = crypto.randomBytes(16).toString("hex");

  // Use the actual market prices - no hardcoded defaults!
  const marketPrice = market.last_price || market.yes_bid;
  console.log(
    `🔍 Market data: last_price=${market.last_price}, yes_bid=${market.yes_bid}`
  );

  // Use market price + 1 cent to be competitive
  const orderPrice = marketPrice + 1;

  const orderData = {
    ticker: market.ticker,
    action: "buy",
    side: "yes",
    count: 1,
    type: "limit",
    yes_price: orderPrice,
    client_order_id: clientOrderId,
  };

  console.log("📋 Order Details:");
  console.log(`   🎯 Market: ${market.ticker}`);
  console.log(`   💰 Market Price: ${marketPrice} cents`);
  console.log(`   💰 Order Price: ${orderPrice} cents`);

  const response = await makeAuthenticatedRequest(
    "POST",
    "/trade-api/v2/portfolio/orders",
    orderData
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to place order: ${response.status} - ${errorText}`);
  }

  const order = (await response.json()) as { order: KalshiOrder };

  console.log("\n🎉 Order placed successfully!");
  console.log(`   🆔 Order ID: ${order.order.order_id}`);
  console.log(`   📊 Status: ${order.order.status}`);

  return order.order;
}

// REMOVED: Individual order check (not supported by API)
// async function checkOrderStatus(orderId: string): Promise<KalshiOrder> {
//   // This endpoint doesn't exist in the Kalshi API
// }

// NEW: List all orders
async function listAllOrders(): Promise<KalshiOrder[]> {
  console.log("\n📋 Step 4: Listing all orders...");
  const response = await makeAuthenticatedRequest(
    "GET",
    "/trade-api/v2/portfolio/orders"
  );

  if (!response.ok) {
    throw new Error(`Failed to list orders: ${response.status}`);
  }

  const data = (await response.json()) as { orders: KalshiOrder[] };
  console.log(`📊 Found ${data.orders.length} orders`);
  return data.orders;
}

// NEW: Cancel order
async function cancelOrder(orderId: string): Promise<void> {
  console.log(`\n❌ Step 5: Canceling order...`);
  const response = await makeAuthenticatedRequest(
    "DELETE",
    `/trade-api/v2/portfolio/orders/${orderId}`
  );

  if (!response.ok) {
    throw new Error(`Failed to cancel order: ${response.status}`);
  }
  console.log("✅ Order canceled!");
}

// NEW: Amend order
async function amendOrder(
  orderId: string,
  newPrice: number,
  newCount: number
): Promise<KalshiOrder> {
  console.log(`\n✏️ Step 6: Amending order...`);
  const amendData = { yes_price: newPrice, count: newCount };
  const response = await makeAuthenticatedRequest(
    "PUT",
    `/trade-api/v2/portfolio/orders/${orderId}`,
    amendData
  );

  if (!response.ok) {
    throw new Error(`Failed to amend order: ${response.status}`);
  }

  const order = (await response.json()) as { order: KalshiOrder };
  console.log("✅ Order amended!");
  return order.order;
}

// Export the necessary functions for use in other modules
export {
  findOpenMarket,
  placeBuyOrder,
  listAllOrders,
  cancelOrder,
  amendOrder,
  makeAuthenticatedRequest,
  signPssText,
};

// Export types for use in other modules
export type { KalshiMarket, KalshiOrder, MarketsResponse };

async function main() {
  try {
    console.log("🚀 Starting Kalshi Buy Order Process...\n");

    const market = await findOpenMarket();
    const order = await placeBuyOrder(market);

    console.log("\n🔍 Step 3: Listing all orders to check status...");
    const allOrders = await listAllOrders();

    // Display all orders
    console.log("\n📋 All Orders:");
    allOrders.forEach((o, index) => {
      console.log(`   ${index + 1}. Order ID: ${o.order_id}`);
      console.log(`      Ticker: ${o.ticker}`);
      console.log(`      Action: ${o.action} ${o.side}`);
      console.log(`      Count: ${o.count}`);
      console.log(`      Price: ${o.yes_price} cents`);
      console.log(`      Status: ${o.status}`);
      console.log(
        `      Created: ${new Date(o.created_time).toLocaleString()}`
      );
      console.log("");
    });

    console.log("\n✅ Process completed!");
    console.log("\n🎯 Next Steps Available:");
    console.log("   📋 List all orders: GET /portfolio/orders");
    console.log("   ✏️ Amend orders: PUT /portfolio/orders/{order_id}");
    console.log("   ❌ Cancel orders: DELETE /portfolio/orders/{order_id}");
    console.log("   🔌 WebSocket connections for real-time updates");
    console.log("   🤖 Build automated trading strategies");
    console.log(
      "\n💡 Example: To delete an order, use: DELETE /portfolio/orders/{order_id}"
    );
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// main();
