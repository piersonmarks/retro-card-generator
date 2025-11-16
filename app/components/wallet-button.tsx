"use client";

import { Button } from "@/components/ui/8bit/button";
import { useWallet } from "../hooks/use-wallet";

export function WalletButton() {
  const { address, isConnecting, isConnected, connect, formatAddress } =
    useWallet();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-green-600 text-xs dark:text-green-400">
          Connected: {formatAddress(address)}
        </span>
      </div>
    );
  }

  return (
    <Button disabled={isConnecting} onClick={connect} size="sm" type="button">
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
