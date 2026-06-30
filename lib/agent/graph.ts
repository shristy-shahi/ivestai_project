import { StateGraph, Annotation, END } from "@langchain/langgraph";
import {
  companyResearchNode,
  financialAnalysisNode,
  newsCollectionNode,
  sentimentAnalysisNode,
  competitorAnalysisNode,
  riskAnalysisNode,
  investmentDecisionNode,
} from "./nodes";
import type {
  CompanyData, FinancialData, NewsItem,
  SentimentData, Competitor, RiskData, Recommendation, AgentLog, AgentStep
} from "../types";

export const AgentStateAnnotation = Annotation.Root({
  company: Annotation<string>({ reducer: (_, b) => b, default: () => "" }),
  ticker: Annotation<string>({ reducer: (_, b) => b, default: () => "" }),
  companyData: Annotation<CompanyData | null>({ reducer: (_, b) => b, default: () => null }),
  financialData: Annotation<FinancialData | null>({ reducer: (_, b) => b, default: () => null }),
  newsData: Annotation<NewsItem[]>({ reducer: (_, b) => b ?? [], default: () => [] }),
  sentiment: Annotation<SentimentData | null>({ reducer: (_, b) => b, default: () => null }),
  competitors: Annotation<Competitor[]>({ reducer: (_, b) => b ?? [], default: () => [] }),
  risks: Annotation<RiskData | null>({ reducer: (_, b) => b, default: () => null }),
  recommendation: Annotation<Recommendation | null>({ reducer: (_, b) => b, default: () => null }),
  score: Annotation<number>({ reducer: (_, b) => b ?? 0, default: () => 0 }),
  agentLogs: Annotation<AgentLog[]>({ reducer: (_, b) => b ?? [], default: () => [] }),
  currentStep: Annotation<AgentStep>({ reducer: (_, b) => b, default: () => "idle" as AgentStep }),
  error: Annotation<string | null>({ reducer: (_, b) => b, default: () => null }),
});

export type GraphState = typeof AgentStateAnnotation.State;

export function buildInvestmentGraph() {
  const graph = new StateGraph(AgentStateAnnotation)
    .addNode("company_research", companyResearchNode as any)
    .addNode("financial_analysis", financialAnalysisNode as any)
    .addNode("news_collection", newsCollectionNode as any)
    .addNode("sentiment_analysis", sentimentAnalysisNode as any)
    .addNode("competitor_analysis", competitorAnalysisNode as any)
    .addNode("risk_analysis", riskAnalysisNode as any)
    .addNode("investment_decision", investmentDecisionNode as any);

  graph.setEntryPoint("company_research");
  graph.addEdge("company_research" as any, "financial_analysis" as any);
  graph.addEdge("financial_analysis" as any, "news_collection" as any);
  graph.addEdge("news_collection" as any, "sentiment_analysis" as any);
  graph.addEdge("sentiment_analysis" as any, "competitor_analysis" as any);
  graph.addEdge("competitor_analysis" as any, "risk_analysis" as any);
  graph.addEdge("risk_analysis" as any, "investment_decision" as any);
  graph.addEdge("investment_decision" as any, END);

  return graph.compile();
}
