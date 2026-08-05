/**
 * Frosted Fork — Payment layer
 *
 * Live Stripe checkout when keys are present;
 * graceful Order-Request fallback when keys are absent (local dev).
 */

import Stripe from "stripe";

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

/** True when Stripe is fully configured */
export function isStripeConfigured(): boolean {
  return Boolean(STRIPE_SECRET && STRIPE_PUBLISHABLE);
}

/** Server-side Stripe instance (only when configured) */
export function getStripe(): Stripe | null {
  if (!STRIPE_SECRET) return null;
  return new Stripe(STRIPE_SECRET, {
    apiVersion: "2025-02-24.acacia",
  });
}

export type CheckoutLineItem = {
  name: string;
  description?: string;
  amountCents: number;
  quantity: number;
  image?: string;
};

export type OrderRequest = {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: CheckoutLineItem[];
  pickupOrDelivery: string;
  requestedDate: string;
  notes: string;
  subtotalCents: number;
};

export type PaymentResult =
  | { mode: "stripe"; sessionId: string; url: string | null }
  | { mode: "order-request"; message: string }
  | { mode: "none"; reason: string };

/**
 * Create a Stripe Checkout Session (server-only).
 * If Stripe isn't configured, returns an order-request fallback result.
 */
export async function createCheckoutSession(
  order: OrderRequest,
  baseUrl: string
): Promise<PaymentResult> {
  const stripe = getStripe();

  if (!stripe || !STRIPE_SECRET) {
    return {
      mode: "order-request",
      message:
        "Stripe is not configured. Your order has been received as a request — we'll reach out to confirm payment.",
    };
  }

  try {
    const line_items = order.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: item.description ?? "",
          ...(item.image ? { images: [item.image] } : {}),
        },
        unit_amount: item.amountCents,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      customer_email: order.customer.email,
      metadata: {
        customerName: order.customer.name,
        customerPhone: order.customer.phone,
        pickupOrDelivery: order.pickupOrDelivery,
        requestedDate: order.requestedDate,
        notes: order.notes,
      },
      success_url: `${baseUrl}/checkout?success=1`,
      cancel_url: `${baseUrl}/checkout?canceled=1`,
    });

    return {
      mode: "stripe",
      sessionId: session.id,
      url: session.url,
    };
  } catch (err) {
    console.error("Stripe session creation failed:", err);
    return {
      mode: "none",
      reason: "Payment processing failed. Please try again or contact us directly.",
    };
  }
}
