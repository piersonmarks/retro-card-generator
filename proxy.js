import { paymentMiddleware } from "x402-next";

// Configure the payment middleware with testnet settings
export const proxy = paymentMiddleware(
  "0x716650ba0c23A6bA536ca0b74d89e903F0F673e1",
  {
    // Route configuration for the generate-image endpoint
    "POST /api/generate-image": {
      price: "$0.01", // Price in USDC
      network: "base-sepolia", // Testnet network
      config: {
        description:
          "Generate a custom Pokemon card with AI-generated artwork from an uploaded image",
      },
    },
  },
  {
    url: "https://x402.org/facilitator", // Testnet facilitator
  }
);

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/api/generate-image"],
};
