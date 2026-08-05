"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CartIcon } from "@/components/Icons";
import { useCartStore } from "@/lib/cart";
import { useCartMounted } from "@/components/CartProvider";

export function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const subtotalCents = useCartStore((s) => s.subtotalCents());
  const mounted = useCartMounted();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!mounted) return null;

  const subtotal = (subtotalCents / 100).toFixed(2);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 drawer-backdrop"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-card z-50 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-display font-bold text-lg">
            Your Fork
            {items.length > 0 && (
              <span className="text-muted text-sm ml-2">
                ({items.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="p-2 text-muted hover:text-body transition-colors"
            aria-label="Close cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <CartIcon className="mx-auto mb-4 h-12 w-12 text-neon-pink" />
              <p className="text-muted text-sm">Your cart is empty.</p>
              <p className="text-muted text-xs mt-1">
                Fork it over — add something sweet!
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="inline-block mt-4 text-sm text-electric-cyan hover:underline"
              >
                Browse the shop →
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 pb-4 border-b last:border-0"
              >
                <div className="w-16 h-16 rounded-lg bg-ink/5 shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">
                    {item.name}
                  </h3>
                  {Object.entries(item.options).length > 0 && (
                    <p className="text-xs text-muted mt-0.5">
                      {Object.entries(item.options)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(" · ")}
                    </p>
                  )}
                  {item.quoteOnly && (
                    <span className="text-xs text-neon-pink font-medium">
                      Quote request
                    </span>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-6 h-6 rounded bg-page text-sm flex items-center justify-center hover:bg-ink/10 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-6 h-6 rounded bg-page text-sm flex items-center justify-center hover:bg-ink/10 transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        ${((item.priceCents * item.quantity) / 100).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted hover:text-neon-pink transition-colors text-xs"
                        aria-label={`Remove ${item.name}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-6 py-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted">Subtotal</span>
              <span className="font-display font-bold text-lg">${subtotal}</span>
            </div>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block w-full text-center py-3 rounded-lg bg-ink text-white font-semibold text-sm hover:bg-ink/90 transition-colors"
            >
              View Cart
            </Link>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full text-center py-3 rounded-lg bg-neon-pink text-white font-semibold text-sm hover:bg-neon-pink/90 transition-colors"
            >
              Checkout →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
