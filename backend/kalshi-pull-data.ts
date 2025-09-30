// kalshi-pull-data.ts
// Run with: npx ts-node kalshi-pull-data.ts

import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

interface KalshiOrder {
  order_id: string;
  client_order_id: string;
  ticker: string;
  action: string;
  side: string;
  initial_count: number;
  remaining_count: number;
  fill_count: number;
  type: string;
  yes_price: number;
  no_price: number;
  status: string;
  created_time: number;
  last_update_time: number;
  expiration_time?: number;
  maker_fees: number;
  maker_fill_cost: number;
  no_price_dollars: string;
  order_group_id?: string;
  queue_position: number;
  self_trade_prevention_type: string;
}

function signPssText(privateKeyPem: string, text: string): string {
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(text);
  sign.end();
  const signature = sign.sign({
    key: privateKeyPem,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
  });
  return signature.toString('base64');
}

async function makeAuthenticatedRequest(method: string, path: string, data?: any): Promise<Response> {
  const apiKey = process.env.KALSHI_API_KEY;
  const privateKey = process.env.KALSHI_PRIVATE_KEY;

  if (!apiKey || !privateKey) {
    throw new Error('KALSHI_API_KEY and KALSHI_PRIVATE_KEY must be set in .env');
  }

  const currentTimeMilliseconds = Date.now();
  const timestampStr = currentTimeMilliseconds.toString();
  const msgString = timestampStr + method + path;
  const signature = signPssText(privateKey, msgString);

  const headers: Record<string, string> = {
    'KALSHI-ACCESS-KEY': apiKey,
    'KALSHI-ACCESS-SIGNATURE': signature,
    'KALSHI-ACCESS-TIMESTAMP': timestampStr,
    'Content-Type': 'application/json'
  };

  console.log(`🔐 Making ${method} request to: ${path}`);

  const requestOptions: RequestInit = { method, headers };
  if (data && method === 'POST') {
    requestOptions.body = JSON.stringify(data);
  }

  return fetch(`https://api.elections.kalshi.com${path}`, requestOptions);
}

async function getSpecificOrder(orderId: string): Promise<KalshiOrder> {
  console.log(`🔍 Step 1: Getting specific order ${orderId}...`);
  
  const response = await makeAuthenticatedRequest('GET', `/trade-api/v2/portfolio/orders/${orderId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get order: ${response.status}`);
  }

  const data = await response.json() as { order: KalshiOrder };
  const order = data.order;

  console.log('✅ Order Details:');
  console.log(`   🆔 Order ID: ${order.order_id}`);
  console.log(`   🎯 Ticker: ${order.ticker}`);
  console.log(`   📊 Action: ${order.action} ${order.side}`);
  console.log(`   💰 Price: ${order.yes_price} cents`);
  console.log(`   📈 Status: ${order.status}`);
  console.log(`   📦 Initial Count: ${order.initial_count}`);
  console.log(`   📦 Remaining Count: ${order.remaining_count}`);
  console.log(`   ✅ Fill Count: ${order.fill_count}`);
  console.log(`   💸 Maker Fees: ${order.maker_fees} cents`);
  console.log(`   💰 Fill Cost: ${order.maker_fill_cost} cents`);
  console.log(`   📅 Created: ${new Date(order.created_time).toLocaleString()}`);
  console.log(`   📅 Updated: ${new Date(order.last_update_time).toLocaleString()}`);
  console.log(`   🎯 Queue Position: ${order.queue_position}`);

  return order;
}

async function getAllOrders(): Promise<KalshiOrder[]> {
  console.log('\n📋 Step 2: Getting all orders...');
  
  const response = await makeAuthenticatedRequest('GET', '/trade-api/v2/portfolio/orders');
  
  if (!response.ok) {
    throw new Error(`Failed to get orders: ${response.status}`);
  }

  const data = await response.json() as { orders: KalshiOrder[] };
  const orders = data.orders;

  console.log(`📊 Found ${orders.length} total orders`);
  
  // Group orders by status
  const statusGroups = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\n📈 Order Status Summary:');
  Object.entries(statusGroups).forEach(([status, count]) => {
    console.log(`   ${status}: ${count} orders`);
  });

  // Show recent orders
  console.log('\n🕒 Recent Orders (last 5):');
  const recentOrders = orders
    .sort((a, b) => b.created_time - a.created_time)
    .slice(0, 5);

  recentOrders.forEach((order, index) => {
    console.log(`   ${index + 1}. ${order.ticker} - ${order.action} ${order.side}`);
    console.log(`      Price: ${order.yes_price} cents | Status: ${order.status}`);
    console.log(`      Created: ${new Date(order.created_time).toLocaleString()}`);
    console.log('');
  });

  return orders;
}

async function main() {
  try {
    console.log('🚀 Starting Kalshi Data Pull Process...\n');
    
    // You can change this to any order ID you want to check
    const specificOrderId = '91cd8fd5-4010-4fdb-9577-cdf49b0d0f2f';
    
    const specificOrder = await getSpecificOrder(specificOrderId);
    const allOrders = await getAllOrders();
    
    console.log('\n✅ Data pull completed!');
    console.log('\n🎯 Summary:');
    console.log(`   📊 Total Orders: ${allOrders.length}`);
    console.log(`   🎯 Specific Order Status: ${specificOrder.status}`);
    console.log(`   💰 Specific Order Price: ${specificOrder.yes_price} cents`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main();