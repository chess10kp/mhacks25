// kalshi-trending.ts
// Run with: npx ts-node kalshi-trending.ts

import fetch from "node-fetch";

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

async function main() {
  const events = await fetchAllOpenEvents();

  // Calculate a “trending score” = sum of volume_24h + open_interest of all markets
  const ranked = events
    .map(e => {
      const score = e.markets.reduce(
        (sum, m) => sum + (m.volume_24h || 0) + (m.open_interest || 0),
        0
      );
      return { ...e, score };
    })
    .filter(e => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  console.log("Top 10 Trending Kalshi Events:\n");
  ranked.forEach((e, i) => {
    const url = `https://kalshi.com/markets/${e.series_ticker.toLowerCase()}/${e.event_ticker.toLowerCase()}`;
    console.log(
      `${i + 1}. ${e.title} — ${e.sub_title} [${e.category}]\n` +
      `   Series: ${e.series_ticker} | Event: ${e.event_ticker}\n` +
      `   Score: ${e.score.toLocaleString()} | Markets: ${e.markets.length}\n` +
      `   URL: ${url}\n`
    );
  });
}

main().catch(err => console.error("Error:", err));
