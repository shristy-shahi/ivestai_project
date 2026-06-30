# Investra — AI Investment Research Agent

> Institutional-grade investment analysis powered by a multi-agent LangGraph pipeline.

## Overview
Investra takes a company name and runs it through a 7-node LangGraph research pipeline.
It produces a comprehensive INVEST / PASS recommendation backed by real reasoning.

## How To Run

```bash
npm install
cp .env.local.example .env.local
# Fill keys
npm run dev
```

## Environment Variables
```
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Supabase Setup
Run `lib/supabase/schema.sql` in your Supabase SQL editor.

## Architecture
User → Next.js → /api/research (SSE) → LangGraph 7-node pipeline → Supabase → Dashboard

Nodes: Company Research → Financial Analysis → News → Sentiment → Competitors → Risk → Decision

## Tech Stack
- Frontend: Next.js 15, React, Zustand, Recharts
- AI: LangGraph.js, LangChain.js, GPT-4o-mini
- DB: Supabase (PostgreSQL)
- Deploy: Vercel

## Key Decisions
- LangGraph multi-node over single prompt: each node specializes → deeper output
- SSE streaming: live node-by-node updates instead of blank spinner
- GPT-4o-mini: 15x cheaper than GPT-4o with equivalent JSON extraction quality

## Example Runs

**NVIDIA**: INVEST · 91% confidence · Score 87/100

**Tesla**: PASS · 72% confidence · Score 44/100

**Apple**: INVEST · 78% confidence · Score 68/100

## What I'd Improve
1. Real financial API (Yahoo Finance) for live data
2. Portfolio analyzer upload feature
3. AI chat with report (RAG)
4. React Three Fiber hero animation
