"use client";
import { create } from "zustand";
import type { AgentState, AgentStep } from "@/lib/types";

interface ResearchStore {
  state: AgentState | null;
  isLoading: boolean;
  currentStep: AgentStep;
  completedSteps: AgentStep[];
  error: string | null;
  startResearch: (company: string) => void;
  mergeData: (data: Partial<AgentState>) => void;
  setStep: (step: AgentStep) => void;
  completeResearch: () => void;
  setError: (err: string) => void;
  reset: () => void;
}

const blank: AgentState = {
  company: "", ticker: "",
  companyData: null, financialData: null, newsData: [],
  sentiment: null, competitors: [], risks: null,
  recommendation: null, score: 0, agentLogs: [],
  currentStep: "idle", error: null,
};

const STEP_ORDER: AgentStep[] = [
  "company_research","financial_analysis","news_collection",
  "sentiment_analysis","competitor_analysis","risk_analysis","investment_decision","complete",
];

export const useResearchStore = create<ResearchStore>((set, get) => ({
  state: null,
  isLoading: false,
  currentStep: "idle",
  completedSteps: [],
  error: null,

  startResearch: (company) => set({
    state: { ...blank, company, currentStep: "company_research" },
    isLoading: true,
    currentStep: "company_research",
    completedSteps: [],
    error: null,
  }),

  mergeData: (data) => {
    const prev = get().state ?? blank;
    const merged = { ...prev, ...data };
    // figure out which step just completed
    const completedStep = data.currentStep ?? prev.currentStep;
    const prevCompleted = get().completedSteps;
    const newCompleted = prevCompleted.includes(completedStep)
      ? prevCompleted
      : [...prevCompleted, completedStep];
    // next step = next in order
    const idx = STEP_ORDER.indexOf(completedStep);
    const nextStep = idx >= 0 && idx < STEP_ORDER.length - 1
      ? STEP_ORDER[idx + 1]
      : completedStep;
    set({ state: merged, completedSteps: newCompleted, currentStep: nextStep });
  },

  setStep: (step) => set({ currentStep: step }),

  completeResearch: () => set((s) => ({
    state: s.state ? { ...s.state, currentStep: "complete" } : s.state,
    isLoading: false,
    currentStep: "complete",
  })),

  // Keep isLoading: true so the analysis UI stays visible — the error is shown inline
  setError: (err) => set({ error: err, isLoading: false, currentStep: "errored" as AgentStep }),

  reset: () => set({
    state: null, isLoading: false,
    currentStep: "idle", completedSteps: [], error: null,
  }),
}));
