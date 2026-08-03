"use client";

import { useState } from "react";
import Link from "next/link";
import { SWEET_TABLE_ITEMS } from "@/data/products";
import { useCartStore, buildCartItem } from "@/lib/cart";
import { SectionHeading } from "@/components/SectionHeading";
import { NeonStrip } from "@/components/NeonStrip";

type TableRow = {
  name: string;
  qty: number;
  priceEach: number; // cents
};

export default function BuildYourOwnPage() {
  const addItem = useCartStore((s) => s.addItem);
  const pickedFlavor = useCartStore((s) => s.pickedFlavor);
  const pickedChocolate = useCartStore((s) => s.pickedChocolate);

  const [rows, setRows] = useState<TableRow[]>(
    SWEET_TABLE_ITEMS.map((item) => ({
      name: item.name,
      qty: 0,
      priceEach: item.priceCents ?? 500, // TODO: confirm price
    }))
  );
  const [addedMsg, setAddedMsg] = useState(false);

  const totalCents = rows.reduce((sum, r) => sum + r.qty * r.priceEach, 0);
  const totalItems = rows.reduce((sum, r) => sum + r.qty, 0);

  const updateQty = (index: number, delta: number) => {
    setRows((prev) =>
      prev.map((r, i) =>
        i === index ? { ...r, qty: Math.max(0, r.qty + delta) } : r
      )
    );
  };

  const handleAddTable = () => {
    if (totalItems === 0) return;

    const options: Record<string, string> = {};
    if (pickedFlavor) options.flavor = pickedFlavor;
    if (pickedChocolate) options.chocolate = pickedChocolate;

    // Create a single "Build Your Own Sweet Table" cart item
    addItem({
      productSlug: "build-your-own-sweet-table",
      name: "Build Your Own Sweet Table",
      priceCents: totalCents,
      quantity: 1,
      options: {
        ...options,
        breakdown: rows
          .filter((r) => r.qty > 0)
          .map((r) => `${r.name} ×${r.qty}`)
          .join(" · "),
      },
      image: "/images/products/platter-deal.jpg",
      quoteOnly: false,
    });
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 3000);
  };

  return (
    <>
      <section className="pt-28 pb-8 px-6 bg-ink text-center">
        <SectionHeading
          eyebrow="Interactive Builder"
          title="Build Your Own Sweet Table"
          subtitle="You bring the party. We'll bring the frosting. Mix and match your favorite treats with live totals."
          center
          light
        />
      </section>

      <section className="py-10 px-6 max-w-2xl mx-auto">
        {pickedFlavor || pickedChocolate ? (
          <div className="mb-8 p-4 rounded-lg bg-neon-pink/5 border border-neon-pink/20 text-sm">
            {pickedFlavor && (
              <span>
                Flavor: <strong>{pickedFlavor}</strong>
              </span>
            )}
            {pickedFlavor && pickedChocolate && " · "}
            {pickedChocolate && (
              <span>
                Chocolate: <strong>{pickedChocolate}</strong>
              </span>
            )}
            {(!pickedFlavor || !pickedChocolate) && (
              <Link
                href="/pick-your-cake"
                className="ml-2 text-electric-cyan hover:underline"
              >
                Set preferences →
              </Link>
            )}
          </div>
        ) : (
          <div className="mb-8 p-4 rounded-lg bg-page border text-sm text-center">
            <p className="mb-2">
              Tip: Pick your cake flavor and chocolate first for the best experience.
            </p>
            <Link
              href="/pick-your-cake"
              className="inline-block px-6 py-2 rounded-full bg-neon-pink text-white text-xs font-semibold hover:bg-neon-pink/90 transition-colors"
            >
              Pick Your Cake →
            </Link>
          </div>
        )}

        {/* Builder rows */}
        <div className="space-y-3 mb-8">
          {rows.map((row, index) => (
            <div
              key={row.name}
              className="flex items-center justify-between p-4 rounded-xl bg-card border"
            >
              <div>
                <p className="font-semibold text-sm">{row.name}</p>
                <p className="text-xs text-muted">
                  ${(row.priceEach / 100).toFixed(2)} each
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQty(index, -1)}
                  className="w-8 h-8 rounded-full border text-sm flex items-center justify-center hover:bg-page transition-colors"
                  aria-label={`Remove one ${row.name}`}
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold text-sm">
                  {row.qty}
                </span>
                <button
                  onClick={() => updateQty(index, 1)}
                  className="w-8 h-8 rounded-full border text-sm flex items-center justify-center hover:bg-page transition-colors"
                  aria-label={`Add one ${row.name}`}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="p-6 rounded-xl bg-card border space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Total items</span>
            <span className="font-semibold">{totalItems}</span>
          </div>
          <div className="flex justify-between font-display font-bold text-xl border-t pt-3">
            <span>Table Total</span>
            <span>${(totalCents / 100).toFixed(2)}</span>
          </div>
          <button
            onClick={handleAddTable}
            disabled={totalItems === 0}
            className={`w-full py-4 rounded-full font-bold text-base transition-all ${
              addedMsg
                ? "bg-green-500 text-white"
                : "bg-ink text-white hover:bg-ink/90"
            } disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            {addedMsg
              ? "Added to Cart!"
              : totalItems === 0
              ? "Add some treats first"
              : "Add Sweet Table to Cart →"}
          </button>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/collections/party-platters"
            className="text-sm text-muted hover:text-electric-cyan transition-colors"
          >
            Prefer a set platter? Browse our Party Platters →
          </Link>
        </div>
      </section>

      <NeonStrip
        text="You bring the party. We'll bring the frosting."
        color="cyan"
      />
    </>
  );
}
