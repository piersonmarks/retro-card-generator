import { NextResponse } from "next/server";
import { paymentMiddleware } from "x402-next";

// Configure the payment middleware with testnet settings
const paymentProxy = paymentMiddleware(
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

// Wrap the payment middleware to handle request cloning
export async function proxy(request, context) {
  console.log("Proxy called for:", request.url);
  console.log("Context:", context);

  // Clone the request so the payment middleware can read the body
  // while leaving the original intact for the route handler
  const clonedRequest = request.clone();

  // Create an event-like object with the pathname from the request URL
  const url = new URL(request.url);
  const event = {
    pathname: url.pathname,
    ...context,
  };

  console.log("Event object:", event);

  // Pass the cloned request to the payment middleware
  const paymentResponse = await paymentProxy(clonedRequest, event);

  // If the payment middleware returns a response (e.g., payment required),
  // return that response
  if (paymentResponse && paymentResponse instanceof Response) {
    console.log("Payment middleware returned a response");
    return paymentResponse;
  }

  // Otherwise, continue with the original request (body still intact)
  console.log("Payment successful, continuing to route handler");
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/api/generate-image"],
};
