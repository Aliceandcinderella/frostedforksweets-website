import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, type OrderRequest } from "@/lib/payments";
import { sendEmail } from "@/lib/email";
import { SITE } from "@/data/site";

const MAX_ITEMS = 25;
const MAX_QUANTITY = 50;
const MAX_TEXT = 2_000;
const MAX_FIELD = 160;
const MAX_BODY_BYTES = 32_768;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10;

const buckets = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: NextRequest): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function rateLimited(key: string): boolean {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

function cleanString(value: unknown, max = MAX_FIELD): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max);
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function validateOrder(input: unknown): { ok: true; order: OrderRequest } | { ok: false; error: string } {
  if (!input || typeof input !== "object") return { ok: false, error: "Invalid request body" };

  const raw = input as Record<string, any>;
  const customer = raw.customer && typeof raw.customer === "object" ? raw.customer : {};
  const name = cleanString(customer.name);
  const email = cleanString(customer.email, 254).toLowerCase();
  const phone = cleanString(customer.phone, 40);

  if (!isEmail(email)) return { ok: false, error: "A valid email address is required" };

  const rawItems = Array.isArray(raw.items) ? raw.items : [];
  if (rawItems.length < 1 || rawItems.length > MAX_ITEMS) {
    return { ok: false, error: "Invalid item count" };
  }

  const items = rawItems.map((item: any) => {
    const quantity = Number.isInteger(item?.quantity) ? item.quantity : Number(item?.quantity);
    const amountCents = Number.isInteger(item?.amountCents) ? item.amountCents : Number(item?.amountCents);
    return {
      name: cleanString(item?.name, 180),
      description: cleanString(item?.description, 400),
      amountCents: Number.isFinite(amountCents) ? Math.max(0, Math.min(amountCents, 500_000)) : 0,
      quantity: Number.isFinite(quantity) ? Math.max(1, Math.min(quantity, MAX_QUANTITY)) : 1,
      image: typeof item?.image === "string" && item.image.startsWith("https://") ? item.image.slice(0, 500) : undefined,
    };
  });

  if (items.some((item) => !item.name)) return { ok: false, error: "Each item requires a name" };

  const serverSubtotalCents = items.reduce((sum, item) => sum + item.amountCents * item.quantity, 0);

  return {
    ok: true,
    order: {
      customer: { name, email, phone },
      items,
      pickupOrDelivery: cleanString(raw.pickupOrDelivery, 40),
      requestedDate: cleanString(raw.requestedDate, 40),
      notes: cleanString(raw.notes, MAX_TEXT),
      subtotalCents: serverSubtotalCents,
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const key = clientKey(request);
    if (rateLimited(key)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const contentLength = Number(request.headers.get("content-length") || "0");
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    const validation = validateOrder(await request.json());
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const body = validation.order;
    const configuredBaseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (process.env.NODE_ENV === "production" && !configuredBaseUrl) {
      return NextResponse.json({ error: "Site URL is not configured" }, { status: 500 });
    }
    const baseUrl = configuredBaseUrl ?? "http://localhost:3001";

    const result = await createCheckoutSession(body, baseUrl);

    const orderSummary = body.items
      .map((i) => `  - ${i.name} x${i.quantity} @ $${(i.amountCents / 100).toFixed(2)}`)
      .join("\n");

    await sendEmail({
      to: SITE.email,
      subject: `New Frosted Fork order/request`,
      body: `New order/request received:\n\nCustomer: ${body.customer.name}\nEmail: ${body.customer.email}\nPhone: ${body.customer.phone}\nPickup/Delivery: ${body.pickupOrDelivery}\nDate: ${body.requestedDate}\nNotes: ${body.notes}\nSubtotal: $${(body.subtotalCents / 100).toFixed(2)}\n\nItems:\n${orderSummary}\n\nMode: ${result.mode}`,
    });

    if (result.mode === "stripe" && result.url) {
      return NextResponse.json({ url: result.url });
    }

    if (result.mode === "order-request") {
      return NextResponse.json({
        mode: "order-request",
        message: result.message,
      });
    }

    return NextResponse.json({
      mode: "none" as const,
      reason: "reason" in result ? result.reason : "Unable to process payment",
    });
  } catch (err) {
    console.error("Order API error:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
