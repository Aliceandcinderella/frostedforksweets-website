"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/cart";
import { useCartMounted } from "@/components/CartProvider";
import { SectionHeading } from "@/components/SectionHeading";
import { isStripeConfigured } from "@/lib/payments";
import { CartIcon, SparkleIcon } from "@/components/Icons";

export function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const items = useCartStore((s) => s.items);
  const subtotalCents = useCartStore((s) => s.subtotalCents());
  const clearCart = useCartStore((s) => s.clearCart);
  const mounted = useCartMounted();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupOrDelivery, setPickupOrDelivery] = useState("pickup");
  const [requestedDate, setRequestedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const successParam = searchParams.get("success");
  const canceledParam = searchParams.get("canceled");

  useEffect(() => {
    if (successParam === "1" && mounted) {
      setSuccess(true);
      clearCart();
    }
  }, [successParam, mounted, clearCart]);

  if (!mounted) {
    return (
      <section className="pt-28 pb-16 px-6 max-w-2xl mx-auto">
        <SectionHeading title="Checkout" center />
        <p className="text-center text-muted">Loading...</p>
      </section>
    );
  }

  if (items.length === 0 && !success) {
    return (
      <section className="pt-28 pb-16 px-6 max-w-2xl mx-auto text-center">
        <SectionHeading title="Checkout" center />
        <CartIcon className="mx-auto mb-6 h-14 w-14 text-neon-pink" />
        <p className="text-muted mb-6">
          Your cart is empty. Add something before checking out!
        </p>
        <Link
          href="/shop"
          className="inline-block px-8 py-3 rounded-full bg-neon-pink text-white font-semibold text-sm"
        >
          Browse the Shop →
        </Link>
      </section>
    );
  }

  if (success) {
    return (
      <section className="pt-28 pb-16 px-6 max-w-2xl mx-auto text-center">
        <SparkleIcon className="mx-auto mb-6 h-14 w-14 text-neon-pink" />
        <SectionHeading
          title="Order Confirmed!"
          subtitle="Thank you for your order. We'll reach out soon with pickup details. In the meantime, follow us on Instagram @frostedforksweets!"
          center
        />
        <Link
          href="/shop"
          className="inline-block mt-6 px-8 py-3 rounded-full bg-neon-pink text-white font-semibold text-sm"
        >
          Back to Shop →
        </Link>
      </section>
    );
  }

  const subtotal = (subtotalCents / 100).toFixed(2);
  const stripeReady = isStripeConfigured();
  const canceledMessage =
    canceledParam === "1"
      ? "Payment was canceled. You can try again or contact us directly."
      : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, email, phone },
          items: items.map((i) => ({
            name: `${i.name}${Object.values(i.options).length ? ` (${Object.values(i.options).join(", ")})` : ""}`,
            description: `Qty: ${i.quantity}`,
            amountCents: i.priceCents,
            quantity: i.quantity,
          })),
          pickupOrDelivery,
          requestedDate,
          notes,
          subtotalCents,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.mode === "order-request") {
        clearCart();
        setSuccess(true);
      } else {
        setError(data.reason ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="pt-28 pb-8 px-6 bg-ink text-center">
        <SectionHeading
          eyebrow="Checkout"
          title="Almost Forking Done"
          subtitle={
            stripeReady
              ? "Secure card payment via Stripe."
              : "Stripe not configured — your order will be submitted as a request."
          }
          center
          light
        />
      </section>

      <section className="py-10 px-6 max-w-2xl mx-auto">
        {!stripeReady && (
          <div className="mb-6 p-4 rounded-lg bg-glow-yellow/10 border border-glow-yellow text-sm text-ink">
            Note: Stripe is not configured. Your order will be received as a request
            and we&apos;ll follow up to confirm payment.
          </div>
        )}

        {(error || canceledMessage) && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error || canceledMessage}
          </div>
        )}

        {/* Order summary */}
        <div className="mb-8 p-6 rounded-xl bg-card border">
          <h3 className="font-display font-bold text-lg mb-4">Order Summary</h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity}
                  {Object.values(item.options).length > 0 &&
                    ` (${Object.values(item.options).join(", ")})`}
                </span>
                <span className="font-semibold">
                  ${((item.priceCents * item.quantity) / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-display font-bold text-lg">
            <span>Total</span>
            <span>${subtotal}</span>
          </div>
        </div>

        {/* Customer form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Name <span className="text-neon-pink">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
              placeholder="Your full name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Email <span className="text-neon-pink">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Phone <span className="text-neon-pink">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full rounded-lg border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
                placeholder="(352) 555-0000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Pickup or Delivery
              </label>
              <select
                value={pickupOrDelivery}
                onChange={(e) => setPickupOrDelivery(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
              >
                <option value="pickup">Pickup — Wildwood, FL</option>
                <option value="delivery">Local Delivery (if available)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Requested Date
              </label>
              <input
                type="date"
                value={requestedDate}
                onChange={(e) => setRequestedDate(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Special Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
              placeholder="Any special requests, allergies, or event details..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-full bg-neon-pink text-white font-bold text-base hover:bg-neon-pink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? "Processing..."
              : stripeReady
              ? "Pay with Card →"
              : "Submit Order Request →"}
          </button>
        </form>
      </section>
    </>
  );
}
