# TradeMind AI

**Research the market. Understand the risk. Decide for yourself.**

TradeMind AI is a transparent crypto market research workflow designed for the Binance Agent OS Mini Hackathon.

## What works now

- Natural-language crypto research queries
- Intent extraction
- Live Binance Spot market data
- Market analysis
- Risk scoring
- Structured research report
- Live workflow UI
- API endpoint: `POST /api/analyze`

The server-side provider uses Binance's public Spot REST API, so no API key is required for the read-only market snapshot used by this prototype. The official Binance Agent OS MCP endpoint is configured as `AGENT_OS_MCP_URL` for the connected AI client; it uses OAuth rather than an API key.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Architecture

```text
User Query
   ↓
Intent Analyzer
   ↓
Market Data Provider
   ↓
Market Intelligence
   ↓
Risk Analyzer
   ↓
Research Report
```

## Market data provider

Open:

`lib/providers/market-data.ts` calls Binance's `GET /api/v3/ticker/24hr` endpoint and maps its ticker response to the `MarketData` type. The provider derives simple volatility and liquidity classifications from the returned 24-hour range, price change, and quote volume. The Agent OS MCP connection is authenticated separately in VS Code through the MCP Servers settings.


## Safety

TradeMind AI is a research tool. It does not execute trades and does not guarantee outcomes.

## Suggested hackathon demo

Ask:

> Analyze SOL for a short-term trade and identify the major risks.

Then show each workflow step completing and the final structured report.
