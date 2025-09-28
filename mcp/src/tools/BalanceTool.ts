import { MCPTool } from "mcp-framework";
import { z } from "zod";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";
const conn = new Connection("https://api.mainnet-beta.solana.com");
async function balance(address: string): Promise<number> {
  try {
    console.log("Getting balance for address:", address);
    const balance = await conn.getBalance(new PublicKey(address));
    console.log("Raw balance (lamports):", balance);
    const solBalance = balance / LAMPORTS_PER_SOL;
    console.log("SOL balance:", solBalance);
    return solBalance;
  } catch (error) {
    console.error("Error getting balance:", error);
    throw error;
  }
}
interface BalanceInput {
  address: string;
}

class BalanceTool extends MCPTool<BalanceInput> {
  name = "solana_balance";
  description = "get solana balance of wallet";

  schema = {
    address: {
      type: z.string(),
      description: "Address to check balance of",
    },
  };

  async execute(input: BalanceInput) {
    try {
      const balanceAmount: number = await balance(input.address);
      return `Address ${input.address} has ${balanceAmount.toFixed(6)} SOL`;
    } catch (error) {
      return `Error getting balance for ${input.address}: ${error instanceof Error ? error.message : "Unknown error"}`;
    }
  }
}

export default BalanceTool;
