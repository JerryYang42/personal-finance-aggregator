export interface Provider {
  getName(): string;
  getBalance(): Promise<{ balance: number; currency: string }>;
}
