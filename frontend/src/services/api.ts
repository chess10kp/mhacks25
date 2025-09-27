const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export interface SendTransactionData {
  fromPrivateKey: string;
  toPublicKey: string;
  amount: number;
}

export interface BalanceResponse {
  balance: number;
  address: string;
}

export interface GenerateWalletResponse {
  publicKey: string;
  privateKey: string;
}

export const api = {
  async getBalance(address: string): Promise<BalanceResponse> {
    const response = await fetch(`${API_BASE_URL}/api/balance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      throw new Error('Failed to get balance');
    }

    return response.json();
  },

  async sendTransaction(data: SendTransactionData): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to send transaction');
    }

    return response.json();
  },

  async generateWallet(): Promise<GenerateWalletResponse> {
    const response = await fetch(`${API_BASE_URL}/api/generate-wallet`);

    if (!response.ok) {
      throw new Error('Failed to generate wallet');
    }

    return response.json();
  },
};
