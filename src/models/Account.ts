export interface Account {
  id: string;
  name: string;
  type: string;
}

export interface BalanceResponse {
  accountId: string;
  accountName: string;
  balance: number;
  currency: string;
}
