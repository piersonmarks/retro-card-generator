import { privateKeyToAccount } from "viem/accounts";

export function getWallet() {
  const account = privateKeyToAccount(
    process.env.WALLET_PRIVATE_KEY as `0x${string}`
  );
  return account;
}
  