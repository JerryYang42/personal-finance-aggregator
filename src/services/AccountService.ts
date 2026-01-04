import type { Provider } from '../providers/Provider.js';
import type { Account, BalanceResponse } from '../models/Account.js';

export class AccountService {
  private providers: Map<string, { provider: Provider; type: string }> = new Map();

  registerProvider(id: string, provider: Provider, type: string): void {
    this.providers.set(id, { provider, type });
  }

  async getBalance(accountId: string): Promise<BalanceResponse> {
    const entry = this.providers.get(accountId);
    if (!entry) {
      throw new Error(`Account not found: ${accountId}`);
    }
    const balance = await entry.provider.getBalance();
    return {
      accountId,
      accountName: entry.provider.getName(),
      ...balance
    };
  }

  async getAllBalances(): Promise<BalanceResponse[]> {
    const balances = await Promise.all(
      Array.from(this.providers.entries()).map(async ([id, entry]) => ({
        accountId: id,
        accountName: entry.provider.getName(),
        ...(await entry.provider.getBalance())
      }))
    );
    return balances;
  }

  listAccounts(): Account[] {
    return Array.from(this.providers.entries()).map(([id, entry]) => ({
      id,
      name: entry.provider.getName(),
      type: entry.type
    }));
  }
}
