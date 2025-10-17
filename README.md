# SolMate

**AI-Powered Solana Wallet & Prediction Market Platform**

SolMate is a hackathon project that combines Solana blockchain with AI to create an accessible prediction market platform. Built for MHacks 2025, it uses Gemini AI to analyze Kalshi markets and helps users make informed trading decisions with automated wallet management.

## 🎥 Demo Video

*Note: This is a bit scrappy - we filmed it 5 minutes before the deadline! 😬*

Check out our demo: [SolMate Demo on Devpost](https://devpost.com/software/solmate-ew09jf)

## 🌟 Inspiration

We wanted to make Solana more accessible by combining AI with prediction markets. The idea was to use Gemini AI to analyze Kalshi markets and help users make better trading decisions while simplifying wallet management.

## 🚀 What It Does

SolMate connects to Solana wallets and researches/executes prediction market trades:

- **Wallet Management**: Generate and manage Solana wallets with secure key generation
- **AI Market Analysis**: Use Gemini AI to analyze Kalshi prediction markets and provide insights
- **Real-Time Research**: Perplexity API provides up-to-date market information for AI analysis
- **SOL Transactions**: Send SOL between wallets with balance checking
- **Market Data**: Connect to live Kalshi markets and get AI recommendations
- **Chat Interface**: Talk to SolMate AI for market insights and trading help

## 🏗️ Architecture

### Backend (`/backend`)
- **Express.js API Server** with TypeScript
- **Solana Integration**: Direct blockchain interaction using `@solana/web3.js`
- **Gemini AI Integration**: AI-powered market analysis and recommendations
- **Perplexity API Integration**: Real-time market research and data gathering
- **Kalshi API Integration**: Real-time prediction market data
- **Wallet Management**: Secure key generation and transaction handling

**Key Features:**
- RESTful API endpoints for wallet operations
- Balance checking and SOL transfers
- AI prompt processing with Gemini
- CORS-enabled for frontend integration
- Environment-based configuration

### Frontend (`/frontend`)
- **React 19** with TypeScript
- **Modern UI Components**: Built with Radix UI and Tailwind CSS
- **Wallet Context Management**: Centralized wallet state management
- **Interactive Chat Interface**: Real-time AI conversation with SolMate
- **Responsive Design**: Mobile-first approach with dark theme

**Key Components:**
- `WalletConnect`: Wallet connection and management
- `TransactionForm`: SOL transfer interface
- `ChatInterface`: AI-powered conversation interface
- `WalletManager`: Multi-wallet management system

### MCP Server (`/mcp`)
- **Model Context Protocol Integration**: Enables AI tools for blockchain operations
- **FastMCP Framework**: High-performance MCP server implementation
- **Custom Tools**: Solana balance checking and blockchain interactions
- **HTTP Stream Transport**: Real-time communication with AI models

## 🛠️ How We Built It

### Technology Stack

**Backend:**
- Node.js with Express.js
- TypeScript for type safety
- Solana Web3.js for blockchain interaction
- Google Gemini AI for intelligent analysis
- Kalshi API for prediction market data
- CORS for cross-origin requests

**Frontend:**
- React 19 with TypeScript
- Tailwind CSS for styling
- Radix UI for accessible components
- Framer Motion for animations
- Solana Wallet Adapter for blockchain integration

**AI & MCP:**
- Google Gemini 2.5 Flash for AI processing
- Model Context Protocol for tool integration
- FastMCP for high-performance server
- Custom Solana tools for blockchain operations

### Key Integrations

1. **Solana Blockchain**: Direct integration with Solana mainnet for wallet operations and transactions
2. **Gemini AI**: Advanced AI model for market analysis and user assistance
3. **Kalshi API**: Real-time prediction market data and trading capabilities
4. **MCP Framework**: Enables AI models to interact with blockchain tools
5. **Multi-Party Computation**: Enhanced security for wallet management

## 🎯 Core Features

### 1. Intelligent Wallet Management
- **Automated Generation**: Create new Solana wallets with secure key generation
- **Multi-Wallet Support**: Manage multiple wallets with easy switching
- **Balance Monitoring**: Real-time balance updates and transaction history
- **Secure Storage**: Private keys stored securely with MPC protection

### 2. AI-Powered Market Analysis
- **Smart Insights**: Gemini AI analyzes market trends and provides recommendations
- **Natural Language Interface**: Chat with SolMate using natural language
- **Real-Time Data**: Live market data from Kalshi integrated with AI analysis
- **Predictive Analytics**: AI-driven predictions for market outcomes

### 3. Seamless Trading Experience
- **One-Click Transactions**: Simplified SOL transfers with intelligent fee estimation
- **Market Integration**: Direct connection to Kalshi prediction markets
- **Automated Execution**: AI-assisted trading decisions and execution
- **Risk Management**: Built-in safeguards and balance checking

### 4. User-Friendly Interface
- **Modern Design**: Clean, intuitive interface with dark theme
- **Responsive Layout**: Works seamlessly across all devices
- **Interactive Elements**: Smooth animations and transitions
- **Accessibility**: Built with accessibility in mind using Radix UI

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Solana CLI (optional)
- Environment variables configured

### Backend Setup
```bash
cd backend
npm install
npm run build
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### MCP Server Setup
```bash
cd mcp
npm install
npm run build
npm start
```

### Environment Variables
Create `.env` files with the following variables:

**Backend (.env):**
```
GEMINI_API_KEY=your_gemini_api_key
PERPLEXITY_API_KEY=your_perplexity_api_key
KALSHI_API_KEY=your_kalshi_api_key
KALSHI_PRIVATE_KEY=your_kalshi_private_key
PORT=3001
```

**Note**: You'll need to get API keys from:
- Google AI Studio for Gemini API key
- Perplexity for real-time research API key
- Kalshi for API key and private key (for trading)

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:3001
```

## 🚀 Usage

1. **Start the Application**: Launch all three services (backend, frontend, MCP)
2. **Connect Wallet**: Generate a new wallet or connect an existing one
3. **Chat with SolMate**: Use the AI interface to get market insights
4. **Execute Trades**: Make informed decisions based on AI recommendations
5. **Monitor Performance**: Track your portfolio and market positions

## 🎯 Challenges We Overcame

### Technical Challenges
- **Security vs. Usability**: Balancing MPC security with seamless user experience
- **API Integration**: Smoothly connecting multiple APIs (Solana, Kalshi, Gemini)
- **Real-Time Data**: Managing live market data with AI processing
- **Cross-Origin Requests**: Handling CORS for frontend-backend communication

### Solutions Implemented
- **Modular Architecture**: Separated concerns across backend, frontend, and MCP
- **Error Handling**: Comprehensive error handling and user feedback
- **Performance Optimization**: Efficient data processing and caching
- **User Experience**: Intuitive interfaces that hide complexity

## 🏆 Accomplishments

We're proud of what we built in this hackathon:

- **Working Integration**: Successfully connected Solana, Gemini AI, Perplexity, and Kalshi APIs
- **AI Chat Interface**: Built a functional chat interface with Gemini AI
- **Real-Time Research**: Integrated Perplexity API for up-to-date market research
- **Wallet Management**: Created a working wallet generation and management system
- **Market Analysis**: Combined live Kalshi market data with AI analysis and real-time research
- **Clean UI**: Made a nice-looking interface with React and Tailwind

## 📚 What We Learned

- **API Integration**: Learned how to connect multiple APIs (Solana, Kalshi, Gemini, Perplexity) together
- **AI + Blockchain**: Combining AI with blockchain creates interesting possibilities
- **Wallet Security**: Understanding how to securely handle private keys
- **Real-Time Data**: Managing live market data with AI processing
- **Hackathon Time Management**: Building a full-stack app in limited time

## 🔮 What's Next for SolMate

### Potential Improvements
- **Better AI Integration**: More sophisticated market analysis
- **Mobile App**: Native mobile version
- **More Markets**: Add other prediction market platforms
- **Trading Features**: Actually execute trades on Kalshi
- **Portfolio Tracking**: Track performance over time

## 🛠️ Built With

- **AI Research**: Perplexity API for real-time market research
- **AI Analysis**: Google Gemini for intelligent market analysis
- **Blockchain**: Solana for fast, low-cost transactions
- **Prediction Markets**: Kalshi API for market data and trading
- **Model Context Protocol**: MCP for AI tool integration
- **Frontend**: React 19 with TypeScript and Tailwind CSS
- **Backend**: Node.js with Express.js
- **Security**: Multi-Party Computation for wallet security
- **Real-Time Data**: Live market feeds and AI processing

## 🙏 Acknowledgments

- MHacks 2025 for the hackathon platform
- Solana for blockchain infrastructure
- Google for Gemini AI
- Perplexity for real-time research capabilities
- Kalshi for prediction market data
- The open-source community for the tools we used

---

**SolMate** - AI-powered Solana wallet & prediction markets. Built for MHacks 2025.
