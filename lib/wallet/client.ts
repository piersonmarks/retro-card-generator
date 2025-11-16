"use client";

import { createWalletClient, custom } from "viem";
import { baseSepolia } from "viem/chains";

/**
 * Get the wallet client from the browser (MetaMask, Coinbase Wallet, etc.)
 * This requires the user to have a Web3 wallet extension installed
 */
export async function getClientWallet() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error(
      "No Web3 wallet found. Please install MetaMask or Coinbase Wallet."
    );
  }

  // Request account access
  const accounts = (await window.ethereum.request({
    method: "eth_requestAccounts",
  })) as string[];

  if (!accounts || accounts.length === 0) {
    throw new Error("No accounts found. Please connect your wallet.");
  }

  const client = createWalletClient({
    chain: baseSepolia,
    transport: custom(window.ethereum),
    account: accounts[0] as `0x${string}`,
  });

  return client;
}

// TypeScript declaration for window.ethereum
type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, callback: (params: unknown) => void) => void;
  removeListener?: (event: string, callback: (params: unknown) => void) => void;
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
};

declare global {
  // biome-ignore lint: Global Window interface extension for ethereum provider
  interface Window {
    ethereum?: EthereumProvider;
  }
}
