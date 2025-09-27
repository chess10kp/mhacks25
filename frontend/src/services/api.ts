const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

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
    console.log('API: Getting balance for address:', address);
    console.log('API: Using URL:', `${API_BASE_URL}/api/balance`);
    
    const response = await fetch(`${API_BASE_URL}/api/balance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    });

    console.log('API: Response status:', response.status);
    console.log('API: Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API: Error response:', errorText);
      throw new Error(`Failed to get balance: ${response.status} ${errorText}`);
    }

    const balanceData = await response.json();
    console.log('API: Balance data:', balanceData);
    return balanceData;
  },

  async sendTransaction(transactionData: SendTransactionData): Promise<any> {
    console.log('API: Sending transaction:', transactionData);
    
    const response = await fetch(`${API_BASE_URL}/api/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });

    console.log('API: Send response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API: Send error response:', errorText);
      throw new Error(`Failed to send transaction: ${response.status} ${errorText}`);
    }

    const sendData = await response.json();
    console.log('API: Send response data:', sendData);
    return sendData;
  },

  async generateWallet(): Promise<GenerateWalletResponse> {
    console.log('API: Generating wallet');
    
    const response = await fetch(`${API_BASE_URL}/api/generate-wallet`);

    console.log('API: Generate response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API: Generate error response:', errorText);
      throw new Error(`Failed to generate wallet: ${response.status} ${errorText}`);
    }

    const walletData = await response.json();
    console.log('API: Generate response data:', walletData);
    return walletData;
  },
};
