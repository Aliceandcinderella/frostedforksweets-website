"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart";
import { useCartMounted } from "@/components/CartProvider";
import { SectionHeading } from "@/components/SectionHeading";
import { CartIcon } from "@/components/Icons";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotalCents = useCartStore((s) => s.subtotalCents());
  const mounted = useCartMounted();

  if (!mounted) {
    return (
      <section className="pt-28 pb-16 px-6 max-w-4xl mx-auto">
        <SectionHeading title="Your Fork" center />
        <p className="text-center text-muted">Loading cart...</p>
      </section>
    );
  }

  const subtotal = (subtotalCents / 100).toFixed(2);

  return (
    <>
      <section className="pt-28 pb-8 px-6 bg-ink text-center">
        <SectionHeading
          eyebrow="Cart"
          title="Your Fork"
          subtitle={
            items.length === 0
              ? "Nothing here yet. Fork it over!"
              : `${items.reduce((s, i) => s + i.quantity, 0)} items — ready to check out?`
          }
          center
          light
        />
      </section>

      <section className="py-10 px-6 max-w-4xl mx-auto">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <CartIcon className="mx-auto mb-6 h-14 w-14 text-neon-pink" />
            <p className="text-muted mb-6">
              Your cart is empty. Time to add something sweet!
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3 rounded-full bg-neon-pink text-white font-semibold text-sm hover:bg-neon-pink/90 transition-colors"
            >
              Browse the Shop →
            </Link>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 pb-4 border-b text-xs font-semibold uppercase tracking-wider text-muted">
              <span>Product</span>
              <span>Price</span>
              <span>Qty</span>
              <span>Total</span>
              <span />
            </div>

            {/* Line items */}
            <div className="space-y-4 mt-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center py-4 border-b last:border-0"
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-14 h-14 rounded-lg bg-ink/5 shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      {Object.entries(item.options).length > 0 && (
                        <p className="text-xs text-muted">
                          {Object.entries(item.options)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(" · ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-sm">
                    ${(item.priceCents / 100).toFixed(2)}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded border text-sm flex items-center justify-center hover:bg-page"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded border text-sm flex items-center justify-center hover:bg-page"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm font-semibold">
                    ${((item.priceCents * item.quantity) / 100).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted hover:text-neon-pink transition-colors text-sm justify-self-end"
                    aria-label={`Remove ${item.name}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t mt-8 pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <button
                  onClick={clearCart}
                  className="text-sm text-muted hover:text-neon-pink transition-colors"
                >
                  Clear cart
                </button>
                <div className="text-right">
                  <span className="text-sm text-muted">Subtotal</span>
                  <span className="block font-display font-bold text-2xl">
                    ${subtotal}
                  </span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="block w-full text-center py-4 rounded-full bg-neon-pink text-white font-bold text-base hover:bg-neon-pink/90 transition-colors"
              >
                Proceed to Checkout →
              </Link>
              <Link
                href="/shop"
                className="block w-full text-center py-3 text-sm text-muted hover:text-electric-cyan transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </>
        )}
      </section>
    </>
  );
}
