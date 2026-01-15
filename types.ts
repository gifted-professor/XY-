export interface ProductInput {
  id: string;
  text: string;
}

export interface GeneratedPlanParts {
  inventoryStatus: string;
  sellingPoint: string;
  promotion: string;
}

export interface ProductResult {
  id: string;
  originalInput: string;
  timestamp: number;
  
  // Extracted Fields
  brand: string;
  category: string;
  articleNumber: string;
  label: string; // e.g. "【复古足球】"
  
  // Plan A (Quality/New)
  planA: GeneratedPlanParts;
  
  // Plan B (Value/Clearance)
  planB: GeneratedPlanParts;
}

export enum PlanType {
  A = 'A', // Quality
  B = 'B', // Value
}

export interface GenerationResponse {
  products: ProductResult[];
}