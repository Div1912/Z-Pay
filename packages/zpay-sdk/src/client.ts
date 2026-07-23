import { UsersModule } from './modules/users';
import { PaymentsModule } from './modules/payments';

export interface ZpayClientConfig {
  /**
   * The base URL for the Z-Pay API.
   * Defaults to 'https://zpayrouter.me/api'
   */
  baseUrl?: string;
  
  /**
   * API Key for authentication (if required).
   */
  apiKey?: string;
}

export class ZpayClient {
  public readonly users: UsersModule;
  public readonly payments: PaymentsModule;
  
  public readonly baseUrl: string;
  public readonly apiKey?: string;

  constructor(config?: ZpayClientConfig) {
    this.baseUrl = config?.baseUrl || 'https://zpayrouter.me/api';
    this.apiKey = config?.apiKey;

    this.users = new UsersModule(this);
    this.payments = new PaymentsModule(this);
  }

  /**
   * Helper method to make API requests with standard headers.
   */
  public async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = new Headers(options?.headers || {});
    headers.set('Content-Type', 'application/json');
    if (this.apiKey) {
      headers.set('Authorization', `Bearer ${this.apiKey}`);
    }

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Z-Pay API Error (${response.status}): ${errorText}`);
    }

    return response.json() as Promise<T>;
  }
}
