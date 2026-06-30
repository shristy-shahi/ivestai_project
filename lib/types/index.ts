export interface AgentState {
  company: string;
  ticker: string;
  companyData: CompanyData | null;
  financialData: FinancialData | null;
  newsData: NewsItem[];
  sentiment: SentimentData | null;
  competitors: Competitor[];
  risks: RiskData | null;
  recommendation: Recommendation | null;
  score: number;
  agentLogs: AgentLog[];
  currentStep: AgentStep;
  error: string | null;
}

export type AgentStep =
  | "idle"
  | "company_research"
  | "financial_analysis"
  | "news_collection"
  | "sentiment_analysis"
  | "competitor_analysis"
  | "risk_analysis"
  | "investment_decision"
  | "complete"
  | "errored";

export interface CompanyData {
  name: string;
  ticker: string;
  industry: string;
  sector: string;
  ceo: string;
  founded: string;
  headquarters: string;
  employees: string;
  marketCap: string;
  description: string;
  products: string[];
  businessModel: string;
  recentDevelopments: string[];
  logoUrl: string;
}

export interface FinancialData {
  revenue: number;
  revenueGrowth: number;
  netIncome: number;
  eps: number;
  peRatio: number;
  operatingMargin: number;
  cashFlow: number;
  debt: number;
  debtToEquity: number;
  roe: number;
  revenueHistory: { year: string; value: number }[];
  profitHistory: { year: string; value: number }[];
  summary: string;
  rating: "strong" | "moderate" | "weak";
}

export interface NewsItem {
  title: string;
  source: string;
  date: string;
  url: string;
  summary: string;
  sentiment: "positive" | "neutral" | "negative";
  category: "earnings" | "product" | "legal" | "partnership" | "market" | "general";
}

export interface SentimentData {
  score: number;
  label: "Bullish" | "Neutral" | "Bearish";
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  keyThemes: string[];
  summary: string;
}

export interface Competitor {
  name: string;
  ticker: string;
  marketCap: string;
  revenueGrowth: number;
  peRatio: number;
  advantage: string;
  logoUrl: string;
}

export interface RiskData {
  overall: "Low" | "Medium" | "High";
  scores: {
    market: number;
    regulatory: number;
    execution: number;
    competition: number;
    financial: number;
    macro: number;
  };
  factors: RiskFactor[];
}

export interface RiskFactor {
  category: string;
  description: string;
  severity: "low" | "medium" | "high";
}

export interface Recommendation {
  decision: "INVEST" | "PASS";
  confidence: number;
  investReasons: string[];
  passReasons: string[];
  verdict: string;
  timeHorizon: "short" | "medium" | "long";
  targetPrice?: number;
  analystNote: string;
}

export interface AgentLog {
  step: AgentStep;
  status: "running" | "complete" | "error";
  output?: any;
  timestamp: number;
  duration?: number;
}

export interface Report {
  id: string;
  company: string;
  ticker: string;
  recommendation: "INVEST" | "PASS";
  score: number;
  createdAt: string;
  data: Omit<AgentState, "currentStep" | "error" | "agentLogs">;
}
