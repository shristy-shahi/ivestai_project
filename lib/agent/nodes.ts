import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type {
  AgentState,
  CompanyData,
  FinancialData,
  NewsItem,
  SentimentData,
  Competitor,
  RiskData,
  Recommendation,
} from "../types";

const getLLM = () => {
  const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  // Prefer Gemini (free tier)
  if (geminiKey && !geminiKey.includes("your_")) {
    return new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      temperature: 0.2,
      apiKey: geminiKey,
    });
  }

  // Fall back to OpenAI
  if (openaiKey && !openaiKey.includes("your_")) {
    return new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0.2,
      apiKey: openaiKey,
    });
  }

  throw new Error(
    "No valid LLM API key found. Add GOOGLE_GENERATIVE_AI_API_KEY (from aistudio.google.com) " +
    "or OPENAI_API_KEY (from platform.openai.com) to your .env file."
  );
};

const parseJSON = (text: string) => {
  const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(clean);
};

// ─── Node 1: Company Research ──────────────────────────────────────────────
export async function companyResearchNode(
  state: AgentState
): Promise<Partial<AgentState>> {
  const llm = getLLM();
  const start = Date.now();

  const response = await llm.invoke([
    new SystemMessage(
      "You are a financial research analyst. Return ONLY valid JSON, no markdown."
    ),
    new HumanMessage(`Research the company: "${state.company}".
Return a JSON object with these exact keys:
{
  "name": "Full company name",
  "ticker": "Stock ticker symbol (e.g. NVDA)",
  "industry": "Industry",
  "sector": "Sector",
  "ceo": "CEO name",
  "founded": "Year founded",
  "headquarters": "City, Country",
  "employees": "Approx employee count as string",
  "marketCap": "Market cap as string (e.g. $3.2T)",
  "description": "2-3 sentence company description",
  "products": ["Product 1", "Product 2", "Product 3"],
  "businessModel": "How the company makes money in 1-2 sentences",
  "recentDevelopments": ["Recent development 1", "Recent development 2", "Recent development 3"],
  "logoUrl": "https://logo.clearbit.com/domain.com"
}`),
  ]);

  const companyData: CompanyData = parseJSON(
    response.content as string
  );

  return {
    companyData,
    ticker: companyData.ticker,
    agentLogs: [
      ...state.agentLogs,
      {
        step: "company_research",
        status: "complete",
        output: companyData,
        timestamp: start,
        duration: Date.now() - start,
      },
    ],
    currentStep: "financial_analysis",
  };
}

// ─── Node 2: Financial Analysis ────────────────────────────────────────────
export async function financialAnalysisNode(
  state: AgentState
): Promise<Partial<AgentState>> {
  const llm = getLLM();
  const start = Date.now();

  const response = await llm.invoke([
    new SystemMessage(
      "You are a financial analyst. Use realistic data based on your training knowledge. Return ONLY valid JSON."
    ),
    new HumanMessage(`Analyze the financials for ${state.companyData?.name} (${state.ticker}).
Return a JSON object:
{
  "revenue": <annual revenue in billions as number>,
  "revenueGrowth": <YoY revenue growth % as number>,
  "netIncome": <net income in billions as number>,
  "eps": <earnings per share as number>,
  "peRatio": <P/E ratio as number>,
  "operatingMargin": <operating margin % as number>,
  "cashFlow": <free cash flow in billions as number>,
  "debt": <total debt in billions as number>,
  "debtToEquity": <debt to equity ratio as number>,
  "roe": <return on equity % as number>,
  "revenueHistory": [
    {"year": "2021", "value": <number>},
    {"year": "2022", "value": <number>},
    {"year": "2023", "value": <number>},
    {"year": "2024", "value": <number>}
  ],
  "profitHistory": [
    {"year": "2021", "value": <number>},
    {"year": "2022", "value": <number>},
    {"year": "2023", "value": <number>},
    {"year": "2024", "value": <number>}
  ],
  "summary": "2-3 sentence financial summary",
  "rating": "strong" | "moderate" | "weak"
}`),
  ]);

  const financialData: FinancialData = parseJSON(response.content as string);

  return {
    financialData,
    agentLogs: [
      ...state.agentLogs,
      {
        step: "financial_analysis",
        status: "complete",
        output: financialData,
        timestamp: start,
        duration: Date.now() - start,
      },
    ],
    currentStep: "news_collection",
  };
}

// ─── Node 3: News Collection ───────────────────────────────────────────────
export async function newsCollectionNode(
  state: AgentState
): Promise<Partial<AgentState>> {
  const llm = getLLM();
  const start = Date.now();

  const response = await llm.invoke([
    new SystemMessage(
      "You are a financial news analyst. Return ONLY valid JSON."
    ),
    new HumanMessage(`Generate 6 realistic recent news items for ${state.companyData?.name} (${state.ticker}).
Return a JSON array of objects:
[{
  "title": "News headline",
  "source": "Source name (e.g. Reuters, Bloomberg, CNBC)",
  "date": "2024-XX-XX",
  "url": "https://example.com/article",
  "summary": "2-sentence summary of the news",
  "sentiment": "positive" | "neutral" | "negative",
  "category": "earnings" | "product" | "legal" | "partnership" | "market" | "general"
}]
Include a mix of positive, neutral, and negative news covering different categories.`),
  ]);

  const newsData: NewsItem[] = parseJSON(response.content as string);

  return {
    newsData,
    agentLogs: [
      ...state.agentLogs,
      {
        step: "news_collection",
        status: "complete",
        output: newsData,
        timestamp: start,
        duration: Date.now() - start,
      },
    ],
    currentStep: "sentiment_analysis",
  };
}

// ─── Node 4: Sentiment Analysis ────────────────────────────────────────────
export async function sentimentAnalysisNode(
  state: AgentState
): Promise<Partial<AgentState>> {
  const llm = getLLM();
  const start = Date.now();

  const newsHeadlines = state.newsData
    .map((n) => `[${n.sentiment}] ${n.title}`)
    .join("\n");

  const response = await llm.invoke([
    new SystemMessage(
      "You are a sentiment analyst. Return ONLY valid JSON."
    ),
    new HumanMessage(`Analyze the overall market sentiment for ${state.companyData?.name} based on these news items:
${newsHeadlines}

Also consider the financial performance: ${state.financialData?.summary}

Return JSON:
{
  "score": <0-100 sentiment score>,
  "label": "Bullish" | "Neutral" | "Bearish",
  "positiveCount": <number>,
  "neutralCount": <number>,
  "negativeCount": <number>,
  "keyThemes": ["theme1", "theme2", "theme3"],
  "summary": "2-3 sentence sentiment summary"
}`),
  ]);

  const sentiment: SentimentData = parseJSON(response.content as string);

  return {
    sentiment,
    agentLogs: [
      ...state.agentLogs,
      {
        step: "sentiment_analysis",
        status: "complete",
        output: sentiment,
        timestamp: start,
        duration: Date.now() - start,
      },
    ],
    currentStep: "competitor_analysis",
  };
}

// ─── Node 5: Competitor Analysis ───────────────────────────────────────────
export async function competitorAnalysisNode(
  state: AgentState
): Promise<Partial<AgentState>> {
  const llm = getLLM();
  const start = Date.now();

  const response = await llm.invoke([
    new SystemMessage(
      "You are a competitive intelligence analyst. Return ONLY valid JSON."
    ),
    new HumanMessage(`Identify the top 3 competitors of ${state.companyData?.name} (${state.ticker}) in the ${state.companyData?.industry} industry.

Return a JSON array:
[{
  "name": "Competitor company name",
  "ticker": "Ticker symbol",
  "marketCap": "Market cap as string",
  "revenueGrowth": <YoY growth % as number>,
  "peRatio": <P/E ratio as number>,
  "advantage": "Key competitive advantage in 1 sentence",
  "logoUrl": "https://logo.clearbit.com/domain.com"
}]`),
  ]);

  const competitors: Competitor[] = parseJSON(response.content as string);

  return {
    competitors,
    agentLogs: [
      ...state.agentLogs,
      {
        step: "competitor_analysis",
        status: "complete",
        output: competitors,
        timestamp: start,
        duration: Date.now() - start,
      },
    ],
    currentStep: "risk_analysis",
  };
}

// ─── Node 6: Risk Analysis ─────────────────────────────────────────────────
export async function riskAnalysisNode(
  state: AgentState
): Promise<Partial<AgentState>> {
  const llm = getLLM();
  const start = Date.now();

  const response = await llm.invoke([
    new SystemMessage(
      "You are a risk analyst. Return ONLY valid JSON."
    ),
    new HumanMessage(`Analyze investment risks for ${state.companyData?.name} (${state.ticker}).
Context: ${state.companyData?.description}
Financial: ${state.financialData?.summary}
News themes: ${state.newsData
      .filter((n) => n.sentiment === "negative")
      .map((n) => n.title)
      .join(", ")}

Return JSON:
{
  "overall": "Low" | "Medium" | "High",
  "scores": {
    "market": <0-100>,
    "regulatory": <0-100>,
    "execution": <0-100>,
    "competition": <0-100>,
    "financial": <0-100>,
    "macro": <0-100>
  },
  "factors": [
    {
      "category": "Risk category",
      "description": "Specific risk description",
      "severity": "low" | "medium" | "high"
    }
  ]
}
Include 4-5 risk factors.`),
  ]);

  const risks: RiskData = parseJSON(response.content as string);

  return {
    risks,
    agentLogs: [
      ...state.agentLogs,
      {
        step: "risk_analysis",
        status: "complete",
        output: risks,
        timestamp: start,
        duration: Date.now() - start,
      },
    ],
    currentStep: "investment_decision",
  };
}

// ─── Node 7: Investment Decision ───────────────────────────────────────────
export async function investmentDecisionNode(
  state: AgentState
): Promise<Partial<AgentState>> {
  const llm = getLLM();
  const start = Date.now();

  const context = `
Company: ${state.companyData?.name} (${state.ticker})
Industry: ${state.companyData?.industry}
Market Cap: ${state.companyData?.marketCap}
Financial Rating: ${state.financialData?.rating}
Revenue Growth: ${state.financialData?.revenueGrowth}%
Net Margin: ${((state.financialData?.netIncome ?? 0) / (state.financialData?.revenue ?? 1) * 100).toFixed(1)}%
P/E Ratio: ${state.financialData?.peRatio}
Sentiment Score: ${state.sentiment?.score}/100 (${state.sentiment?.label})
Risk Level: ${state.risks?.overall}
Key Themes: ${state.sentiment?.keyThemes?.join(", ")}
`;

  const response = await llm.invoke([
    new SystemMessage(
      `You are a senior investment analyst with 20 years of experience. 
Be decisive and analytical. Return ONLY valid JSON.`
    ),
    new HumanMessage(`Based on comprehensive research, make an investment recommendation for ${state.companyData?.name}.

Research Summary:
${context}

Return JSON:
{
  "decision": "INVEST" | "PASS",
  "confidence": <50-99 confidence percentage>,
  "investReasons": ["Reason 1 to invest", "Reason 2", "Reason 3", "Reason 4"],
  "passReasons": ["Reason 1 not to invest", "Reason 2", "Reason 3"],
  "verdict": "2-3 sentence final verdict explaining the decision",
  "timeHorizon": "short" | "medium" | "long",
  "targetPrice": <optional estimated fair value if investing>,
  "analystNote": "Personal note from the analyst perspective in 1-2 sentences"
}
Provide balanced reasoning showing BOTH sides regardless of final decision.`),
  ]);

  const recommendation: Recommendation = parseJSON(
    response.content as string
  );

  const score =
    Math.round(
      (state.financialData?.revenueGrowth ?? 0) * 0.3 +
      (state.sentiment?.score ?? 50) * 0.3 +
      (100 - (state.risks?.scores.market ?? 50)) * 0.2 +
      recommendation.confidence * 0.2
    );

  return {
    recommendation,
    score: Math.min(100, Math.max(0, score)),
    agentLogs: [
      ...state.agentLogs,
      {
        step: "investment_decision",
        status: "complete",
        output: recommendation,
        timestamp: start,
        duration: Date.now() - start,
      },
    ],
    currentStep: "complete",
  };
}
