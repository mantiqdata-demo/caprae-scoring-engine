export type BusinessModel = "saas" | "services-recurring" | "services-project" | "product";
export type OwnerType = "founder" | "family" | "pe-backed";

export interface CompanyInput {
  companyName: string;
  industry: string;
  estimatedRevenue: string;
  employeeCount: string;
  location: string;
  businessModel: BusinessModel;
  yearsInBusiness: string;
  ownerType: OwnerType;
}

export interface ScoringCriterion {
  name: string;
  weight: number;
  score: number;
  rationale: string;
}

export interface ScoreResult {
  composite_score: number;
  criteria: ScoringCriterion[];
  deal_thesis: string;
  red_flags: string[];
  next_steps: string[];
}

export type BatchRowStatus = "queued" | "scoring" | "scored" | "error";

export interface BatchRow {
  id: string;
  input: CompanyInput;
  status: BatchRowStatus;
  result?: ScoreResult;
  error?: string;
}
