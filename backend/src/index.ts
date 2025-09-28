import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bs58 from "bs58";
import { balance, sendSolana, makeWalletKeys } from "./solanaWallet";
dotenv.config();
import { prompt as geminiPrompt } from "./gemini";
import { OAuthClientRegistrationErrorSchema } from "@modelcontextprotocol/sdk/shared/auth";
const app = express();
const PORT = process.env.PORT || 3001;


// Middleware
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];

const corsOptions = {
  methods: ["GET", "POST"],
  // @ts-ignore
  origin: function (origin, callback) {
    // Check if the incoming origin is in our list of allowed origins
    // The '!origin' part allows for REST tools like Postman (which don't have an origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/api/kalshi-api-key", (req, res) => {
  res.json({
    apiKey: process.env.KALSHI_API_KEY,
    privateKey: process.env.KALSHI_PRIVATE_KEY,
  });
});

app.get("/api/kalshi-private-key", (req, res) => {
  res.json({ privateKey: process.env.KALSHI_PRIVATE_KEY });
});

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Solana Wallet API is running" });
});

// Get wallet balance
app.post("/api/balance", async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    const walletBalance = await balance(address);
    res.json({ balance: walletBalance, address });
  } catch (error) {
    console.error("Error getting balance:", error);
    res.status(500).json({ error: "Failed to get balance" });
  }
});

// Send SOL
app.post("/api/send", async (req, res) => {
  try {
    const { fromPrivateKey, toPublicKey, amount } = req.body;

    if (!fromPrivateKey || !toPublicKey || !amount) {
      return res.status(400).json({
        error: "fromPrivateKey, toPublicKey, and amount are required",
      });
    }

    const signature = await sendSolana(fromPrivateKey, toPublicKey, amount);
    res.json({
      success: true,
      message: "Transaction sent successfully",
      signature,
      from: fromPrivateKey.substring(0, 10) + "...",
      to: toPublicKey,
      amount,
    });
  } catch (error) {
    console.error("Error sending SOL:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: `Failed to send SOL: ${errorMessage}` });
  }
});

// Generate new wallet
app.get("/api/generate-wallet", (req, res) => {
  try {
    const newWallet = makeWalletKeys();
    res.json({
      publicKey: newWallet.publicKey.toString(),
      privateKey: bs58.encode(newWallet.secretKey), // Return in base58 format
    });
  } catch (error) {
    console.error("Error generating wallet:", error);
    res.status(500).json({ error: "Failed to generate wallet" });
  }
});

app.post("/api/prompt", async (req, res) => {
  const { prompt } = req.body;
  // @ts-ignore
  const output = await geminiPrompt(prompt);
  console.log(output);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
