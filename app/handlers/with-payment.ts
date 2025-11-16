import type { NextRequest } from "next/server";
import { getAddress } from "viem";
import { exact } from "x402/schemes";
import {
  findMatchingPaymentRequirements,
  processPriceToAtomicAmount,
  safeBase64Encode,
  toJsonSafe,
} from "x402/shared";
import type {
  ERC20TokenAmount,
  FacilitatorConfig,
  Money,
  Network,
  PaymentPayload,
  PaymentRequirements,
  PaywallConfig,
  Resource,
} from "x402/types";
import { useFacilitator } from "x402/verify";

type RoutePaymentConfig = {
  price: Money;
  network: Network;
  payTo: string;
  description?: string;
  mimeType?: string;
  maxTimeoutSeconds?: number;
  customPaywallHtml?: string;
  resource?: Resource;
  errorMessages?: {
    paymentRequired?: string;
    invalidPayment?: string;
    noMatchingRequirements?: string;
    verificationFailed?: string;
    settlementFailed?: string;
  };
  discoverable?: boolean;
};

type WithPaymentConfig = RoutePaymentConfig & {
  facilitator?: FacilitatorConfig;
  paywall?: PaywallConfig;
};

/**
 * Wraps a Next.js route handler with payment verification
 *
 * @example
 * ```typescript
 * export const POST = withPayment(
 *   async (request: NextRequest) => {
 *     // Your route logic here
 *     return NextResponse.json({ success: true });
 *   },
 *   {
 *     price: "$0.01",
 *     network: "base-sepolia",
 *     payTo: "0x716650ba0c23A6bA536ca0b74d89e903F0F673e1",
 *     description: "Generate Pokemon card"
 *   }
 * );
 * ```
 */
export function withPayment<
  T extends (request: NextRequest) => Promise<Response>,
>(handler: T, config: WithPaymentConfig): T {
  const { verify, settle } = useFacilitator(config.facilitator);
  const x402Version = 1;

  return (async (request: NextRequest) => {
    const {
      price,
      network,
      payTo,
      description,
      mimeType,
      maxTimeoutSeconds,
      resource,
      errorMessages,
      discoverable,
    } = config;

    const method = request.method.toUpperCase();
    const pathname = request.nextUrl.pathname;

    // Process price to atomic amount
    const atomicAmountForAsset = processPriceToAtomicAmount(price, network);
    if ("error" in atomicAmountForAsset) {
      return Response.json(
        { error: atomicAmountForAsset.error },
        { status: 500 }
      );
    }
    const { maxAmountRequired, asset } = atomicAmountForAsset;

    const resourceUrl =
      resource ||
      (`${request.nextUrl.protocol}//${request.nextUrl.host}${pathname}` as Resource);

    // Build payment requirements (EVM only for now)
    const paymentRequirements: PaymentRequirements = {
      scheme: "exact",
      network,
      maxAmountRequired,
      resource: resourceUrl,
      description: description ?? "",
      mimeType: mimeType ?? "application/json",
      payTo: getAddress(payTo),
      maxTimeoutSeconds: maxTimeoutSeconds ?? 300,
      asset: getAddress(asset.address),
      outputSchema: {
        input: {
          type: "http",
          method,
          discoverable: discoverable ?? true,
        },
      },
      extra: (asset as ERC20TokenAmount["asset"]).eip712,
    };

    // Check for payment header
    const paymentHeader = request.headers.get("X-PAYMENT");
    if (!paymentHeader) {
      return Response.json(
        {
          x402Version,
          error:
            errorMessages?.paymentRequired || "X-PAYMENT header is required",
          accepts: [paymentRequirements],
        },
        { status: 402 }
      );
    }

    // Verify payment
    let decodedPayment: PaymentPayload;
    try {
      decodedPayment = exact.evm.decodePayment(paymentHeader);
      decodedPayment.x402Version = x402Version;
    } catch (error) {
      return Response.json(
        {
          x402Version,
          error:
            errorMessages?.invalidPayment ||
            (error instanceof Error ? error.message : "Invalid payment"),
          accepts: [paymentRequirements],
        },
        { status: 402 }
      );
    }

    const selectedPaymentRequirements = findMatchingPaymentRequirements(
      [paymentRequirements],
      decodedPayment
    );
    if (!selectedPaymentRequirements) {
      return Response.json(
        {
          x402Version,
          error:
            errorMessages?.noMatchingRequirements ||
            "Unable to find matching payment requirements",
          accepts: toJsonSafe([paymentRequirements]),
        },
        { status: 402 }
      );
    }

    const verification = await verify(
      decodedPayment,
      selectedPaymentRequirements
    );

    if (!verification.isValid) {
      return Response.json(
        {
          x402Version,
          error:
            errorMessages?.verificationFailed || verification.invalidReason,
          accepts: [paymentRequirements],
          payer: verification.payer,
        },
        { status: 402 }
      );
    }

    // Payment verified, proceed with handler
    const response = await handler(request);

    // If handler returned error, don't settle payment
    if (response.status >= 400) {
      return response;
    }

    // Settle payment after successful response
    try {
      const settlement = await settle(
        decodedPayment,
        selectedPaymentRequirements
      );

      if (settlement.success) {
        response.headers.set(
          "X-PAYMENT-RESPONSE",
          safeBase64Encode(
            JSON.stringify({
              success: true,
              transaction: settlement.transaction,
              network: settlement.network,
              payer: settlement.payer,
            })
          )
        );
      }
    } catch (error) {
      return Response.json(
        {
          x402Version,
          error:
            errorMessages?.settlementFailed ||
            (error instanceof Error ? error.message : "Settlement failed"),
          accepts: [paymentRequirements],
        },
        { status: 402 }
      );
    }

    return response;
  }) as T;
}
