// kalshi-test.ts
// Run with: npx ts-node kalshi-test.ts or npm run kalshi-test 

import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface KalshiBalance {
  balance: number;
  updated_ts: number;
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

async function getKalshiBalance(): Promise<KalshiBalance> {
  const apiKey = process.env.KALSHI_API_KEY;
  const privateKey = process.env.KALSHI_PRIVATE_KEY;

  if (!apiKey || !privateKey) {
    throw new Error('KALSHI_API_KEY and KALSHI_PRIVATE_KEY must be set in .env');
  }

  const currentTimeMilliseconds = Date.now();
  const timestampStr = currentTimeMilliseconds.toString();

  const method = "GET";
  const baseUrl = 'https://api.elections.kalshi.com';
  const path = '/trade-api/v2/portfolio/balance';

  const msgString = timestampStr + method + path;
  const signature = signPssText(privateKey, msgString);

  const headers = {
    'KALSHI-ACCESS-KEY': apiKey,
    'KALSHI-ACCESS-SIGNATURE': signature,
    'KALSHI-ACCESS-TIMESTAMP': timestampStr,
    'Content-Type': 'application/json'
  };

  console.log('Making request to Kalshi API...');

  const response = await fetch(baseUrl + path, {
    method: 'GET',
    headers: headers
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json() as KalshiBalance;
  return data;
}

async function main() {
  try {
    console.log('Testing Kalshi API Authentication...\n');
    
    const balance = await getKalshiBalance();
    
    console.log('✅ Successfully authenticated with Kalshi API!');
    console.log('\n📊 Your Kalshi Balance:');
    console.log(`Balance: $${(balance.balance / 100).toFixed(2)} (${balance.balance} cents)`);
    console.log(`Last Updated: ${new Date(balance.updated_ts * 1000).toISOString()}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main();
