"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct, CAKE_FLAVORS } from "@/data/products";
import { useCartStore, buildCartItem } from "@/lib/cart";
import { SectionHeading } from "@/components/SectionHeading";

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const product = getProduct(slug);
  const addItem = useCartStore((s) => s.addItem);
  const pickedFlavor = useCartStore((s) => s.pickedFlavor);
  const pickedChocolate = useCartStore((s) => s.pickedChocolate);

  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState(pickedFlavor ?? "");
  const [selectedChocolate, setSelectedChocolate] = useState(
    pickedChocolate
      ? pickedChocolate === "Milk"
        ? "Milk Chocolate"
        : "White Chocolate"
      : ""
  );
  const [added, setAdded] = useState(false);

  if (!product) notFound();

  const allOptions = product.options ?? [];
  const hasFlavorSelector = product.flavors && product.flavors.length > 0;
  const hasChocolateSelector = allOptions.some((o) =>
    o.name.toLowerCase().includes("coat") || o.name.toLowerCase().includes("chocolate")
  );

  const handleAdd = () => {
    const options: Record<string, string> = {};
    if (selectedFlavor) options.flavor = selectedFlavor;
    if (selectedChocolate) options.coating = selectedChocolate;

    const item = buildCartItem(product, options, quantity);
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const priceLabel = product.quoteOnly
    ? "Custom quote"
    : product.priceCents
    ? `$${(product.priceCents / 100).toFixed(2)}`
    : "Price TBD";

  return (
    <>
      <section className="pt-28 pb-6 px-6 max-w-6xl mx-auto">
        <Link
          href="/shop"
          className="text-sm text-muted hover:text-electric-cyan transition-colors"
        >
          ← Back to Shop
        </Link>
      </section>

      <section className="pb-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Gallery */}
          <div>
            <div className="aspect-square rounded-2xl product-placeholder overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = "none";
                  el.parentElement!.textContent = product.name;
                }}
              />
            </div>
          </div>

          {/* Buy Box */}
          <div>
            {product.tagline && (
              <p className="font-script text-xl text-neon-pink mb-2">
                {product.tagline}
              </p>
            )}
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-body mb-2">
              {product.name}
            </h1>
            {product.sizeText && (
              <p className="text-sm text-muted mb-4">{product.sizeText}</p>
            )}
            <p className="text-body/80 leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="text-2xl font-display font-bold text-neon-pink mb-6">
              {priceLabel}
            </div>

            {/* Flavor selector */}
            {hasFlavorSelector && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Cake Flavor
                </label>
                <select
                  value={selectedFlavor}
                  onChange={(e) => setSelectedFlavor(e.target.value)}
                  className="w-full rounded-lg border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
                >
                  <option value="">Choose a flavor</option>
                  {CAKE_FLAVORS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Chocolate selector */}
            {hasChocolateSelector && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Chocolate Coating
                </label>
                <div className="flex gap-3">
                  {["Milk Chocolate", "White Chocolate"].map((choc) => (
                    <button
                      key={choc}
                      onClick={() => setSelectedChocolate(choc)}
                      className={`flex-1 py-3 rounded-lg border text-sm font-semibold transition-all ${
                        selectedChocolate === choc
                          ? "border-neon-pink bg-neon-pink/5 text-neon-pink ring-1 ring-neon-pink"
                          : "border-muted/20 hover:border-neon-pink"
                      }`}
                    >
                      {choc}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border text-lg flex items-center justify-center hover:bg-page"
                >
                  −
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border text-lg flex items-center justify-center hover:bg-page"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA */}
            {product.quoteOnly ? (
              <Link
                href="/custom-orders"
                className="block w-full text-center py-4 rounded-full bg-neon-pink text-white font-bold text-base hover:bg-neon-pink/90 transition-colors"
              >
                Request a Quote →
              </Link>
            ) : (
              <button
                onClick={handleAdd}
                className={`w-full py-4 rounded-full font-bold text-base transition-all ${
                  added
                    ? "bg-green-500 text-white"
                    : "bg-ink text-white hover:bg-ink/90"
                }`}
              >
                {added ? "Added!" : `Add to Cart — ${priceLabel}`}
              </button>
            )}

            <p className="mt-4 text-xs text-muted text-center">
              Made fresh to order in Wildwood, FL. Custom colors & themes available.
            </p>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="pb-16 px-6 max-w-6xl mx-auto border-t pt-12">
        <h2 className="font-display font-bold text-2xl mb-6 text-center">
          You Might Also Fork
        </h2>
        <p className="text-sm text-muted text-center">
          Browse the{" "}
          <Link href="/shop" className="text-electric-cyan hover:underline">
            full shop
          </Link>{" "}
          for more treats.
        </p>
      </section>
    </>
  );
}
