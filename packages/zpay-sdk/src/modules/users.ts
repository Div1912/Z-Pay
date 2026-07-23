import type { ZpayClient } from '../client';

export interface ResolveResponse {
  address: string;
  memo?: string;
  handle: string;
}

export class UsersModule {
  constructor(private client: ZpayClient) {}

  /**
   * Resolves a Z-Pay handle (e.g. 'alice@Zp') to a Stellar public key.
   * @param handle The Universal ID to resolve.
   */
  public async resolve(handle: string): Promise<ResolveResponse> {
    const encodedHandle = encodeURIComponent(handle);
    return this.client.request<ResolveResponse>(`/zpay/resolve?handle=${encodedHandle}`);
  }
}
