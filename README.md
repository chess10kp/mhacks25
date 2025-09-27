# Solana Wallet Manager

A full-stack Solana wallet application built with React, Node.js, and Solana Web3.js. This application allows users to connect their wallets, view balances, send SOL transactions, and generate new wallets.

## Features

- 🔗 **Wallet Connection**: Connect with Solana wallets using public keys
- 💰 **Balance Checking**: View your SOL balance in real-time
- 📤 **Send Transactions**: Send SOL to other addresses
- 🆕 **Wallet Generation**: Generate new Solana wallets
- 🎨 **Modern UI**: Beautiful, responsive design with gradient backgrounds
- 🔒 **Secure**: Private keys are handled securely on the backend

## Project Structure

```
mhacks25/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context for wallet state
│   │   ├── services/        # API service functions
│   │   └── App.tsx          # Main App component
│   └── package.json
├── backend/                 # Node.js Express backend
│   ├── src/
│   │   ├── index.ts         # Express server
│   │   └── solanaWallet.ts  # Solana wallet functions
│   └── package.json
├── solanaWallet.ts          # Original Solana wallet functions
└── package.json             # Root package.json for scripts
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Solana wallet (for testing)

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <your-repo-url>
   cd mhacks25
   ```

2. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

   This will install dependencies for the root project, backend, and frontend.

## Running the Application

### Development Mode (Recommended)

Run both frontend and backend simultaneously:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

### Running Individual Services

**Backend only:**
```bash
npm run backend:dev
```

**Frontend only:**
```bash
npm run frontend:dev
```

## Usage

1. **Open the application** in your browser at `http://localhost:3000`

2. **Connect your wallet**:
   - Click "Connect Wallet"
   - Enter your Solana public key when prompted
   - Your balance will be displayed automatically

3. **Send SOL transactions**:
   - Make sure you're connected
   - Enter the recipient's public key
   - Enter the amount in SOL
   - Enter your private key (for signing the transaction)
   - Click "Send SOL"

4. **Generate a new wallet**:
   - Click "Generate Wallet"
   - Copy and securely store your new public and private keys
   - ⚠️ **Important**: Save your private key securely!

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/health` - Health check
- `POST /api/balance` - Get wallet balance
- `POST /api/send` - Send SOL transaction
- `GET /api/generate-wallet` - Generate new wallet

## Security Notes

- **Private keys are never stored** on the server
- **Transactions are signed** using your private key
- **Always use HTTPS** in production
- **Never share your private keys** with anyone

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
```

## Building for Production

**Build both frontend and backend:**
```bash
npm run frontend:build
npm run backend:build
```

**Start production server:**
```bash
npm start
```

## Technologies Used

### Frontend
- React 18 with TypeScript
- Solana Web3.js
- Modern CSS with gradients and animations
- Responsive design

### Backend
- Node.js with Express
- TypeScript
- Solana Web3.js
- CORS enabled for frontend communication

## Troubleshooting

1. **Port conflicts**: Make sure ports 3000 and 5000 are available
2. **CORS issues**: The backend is configured to allow requests from the frontend
3. **Solana network**: The app connects to Solana mainnet by default
4. **Transaction failures**: Ensure you have sufficient SOL for transaction fees

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
