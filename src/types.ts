export interface TestConfig {
  model: string;
  url: string;
  apiKey: string;
  type: "chat" | "reason";
  iterations?: number;
}

export interface TestResult {
  tftt: number;
  duration: number;
  tokens: number;
  tokensPerSecond: number;
}
