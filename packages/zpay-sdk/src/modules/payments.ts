import type { ZpayClient } from '../client';

export interface AssetBalance {
  asset: string;
  balance: string;
}

export interface BalanceResponse {
  address: string;
  balances: AssetBalance[];
}

export interface SendPaymentRequest {
  to: string; // can be a handle (alice@Zp) or a Stellar address
  amount: string;
  asset?: string; // e.g. XLM, USDC
  memo?: string;
}

export interface SendPaymentResponse {
  success: boolean;
  hash?: string;
  message?: string;
}

export interface TransactionHistoryParams {
  limit?: number;
  cursor?: string;
}

export class PaymentsModule {
  constructor(private client: ZpayClient) {}

  /**
   * Retrieves the wallet balance for a given address.
   * @param address Stellar public key
   */
  public async getBalance(address: string): Promise<BalanceResponse> {
    return this.client.request<BalanceResponse>(`/zpay/balance?address=${encodeURIComponent(address)}`);
  }

  /**
   * Initiates a payment.
   * @param request Payment details
   */
  public async send(request: SendPaymentRequest): Promise<SendPaymentResponse> {
    return this.client.request<SendPaymentResponse>('/payments/send', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Gets the transaction history for a wallet.
   * @param address Stellar public key
   * @param params Pagination parameters
   */
  public async getHistory(address: string, params?: TransactionHistoryParams): Promise<any> {
    let url = `/payments/history?address=${encodeURIComponent(address)}`;
    if (params?.limit) {
      url += `&limit=${params.limit}`;
    }
    if (params?.cursor) {
      url += `&cursor=${encodeURIComponent(params.cursor)}`;
    }
    return this.client.request<any>(url);
  }
}
