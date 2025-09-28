// kalshi-trending.ts
// Run with: npx ts-node kalshi-trending.ts
// Uses Node 18+ built-in fetch (no node-fetch import needed)

import { VoteAuthorizationLayout } from "@solana/web3.js";

interface KalshiMarket {
  ticker: string;
  title: string;
  volume_24h: number;
  liquidity: number;
  status: string;
  open_time: string;
  close_time: string;
  last_price: number;
  yes_bid: number;
  no_bid: number;
  open_interest: number;
}

interface KalshiEvent {
  event_ticker: string;
  series_ticker: string;
  title: string;
  sub_title: string;
  category: string;
  markets: KalshiMarket[];
}

interface EventsResponse {
  cursor: string | null;
  events: KalshiEvent[];
}

async function fetchAllOpenEvents(limit = 200): Promise<KalshiEvent[]> {
  let cursor: string | null = null;
  const allEvents: KalshiEvent[] = [];

  do {
    const url = new URL("https://api.elections.kalshi.com/trade-api/v2/events");
    url.searchParams.set("limit", limit.toString());
    url.searchParams.set("status", "open");
    url.searchParams.set("with_nested_markets", "true");
    if (cursor) url.searchParams.set("cursor", cursor);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);

    const json = (await res.json()) as EventsResponse;
    allEvents.push(...json.events);
    cursor = json.cursor;
  } while (cursor);

  return allEvents;
}

async function fetchMarketsForEvent(
  eventTicker: string
): Promise<KalshiMarket[]> {
  const url = `https://api.elections.kalshi.com/trade-api/v2/markets?event_ticker=${eventTicker}&status=open`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);

  const json = (await res.json()) as { markets: KalshiMarket[] };
  return json.markets;
}

function pickMostInterestingMarket(
  markets: KalshiMarket[]
): KalshiMarket | null {
  if (!markets || markets.length === 0) return null;

  const viable = markets.filter(
    (m) => m.liquidity > 0 && (m.volume_24h > 0 || m.open_interest > 0)
  );
  if (viable.length === 0) return markets[0]; // fallback

  return viable.reduce((best, m) => {
    const bestDiff = Math.abs(50 - (best.last_price || 0));
    const curDiff = Math.abs(50 - (m.last_price || 0));
    return curDiff < bestDiff ? m : best;
  }, viable[0]);
}

export async function main() {
  const events = await fetchAllOpenEvents();

  const output = [];

  // Score = sum of volume_24h + open_interest across all nested markets
  const ranked = events
    .map((e) => {
      const score = e.markets.reduce(
        (sum, m) => sum + (m.volume_24h || 0) + (m.open_interest || 0),
        0
      );
      return { ...e, score };
    })
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  console.log(
    "Top 10 Trending Kalshi Events (most interesting market per event):\n"
  );

  for (const [i, e] of ranked.entries()) {
    const url = `https://kalshi.com/markets/${e.series_ticker.toLowerCase()}/${e.event_ticker.toLowerCase()}`;

    const fullMarkets = await fetchMarketsForEvent(e.event_ticker);
    const m = pickMostInterestingMarket(fullMarkets);

    console.log(
      `${i + 1}. ${e.title} — ${e.sub_title} [${e.category}]\n` +
        `   Series: ${e.series_ticker} | Event: ${e.event_ticker}\n` +
        `   Score: ${e.score.toLocaleString()} | Total Markets: ${
          fullMarkets.length
        }\n` +
        `   URL: ${url}\n` +
        (m
          ? `   Market: ${m.title} (${m.ticker})\n` +
            `      Last Price: ${m.last_price}%\n` +
            `      Yes Bid: ${m.yes_bid} | No Bid: ${m.no_bid}\n` +
            `      Volume24h: ${m.volume_24h} | Open Interest: ${m.open_interest} | Liquidity: ${m.liquidity}\n`
          : "   No markets found.\n")
    );

    console.log("woeifj", m);
    console.log("woeifj", m.ticker);

    output.push({
      Title: e.title,
      Ticker: m.ticker,
      URL: url,
      YesBid: m?.yes_bid,
      NoBid: m?.no_bid,
      LastPrice: m?.last_price,
    });
  }
  return JSON.stringify(output);
}

// main().catch(err => console.error("Error:", err));
