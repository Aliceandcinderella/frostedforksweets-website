import type { Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { CakeIcon } from "@/components/Icons";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <CakeIcon className="mx-auto mb-4 h-12 w-12 text-neon-pink" />
        <p className="text-muted">No treats found in this category yet.</p>
      </div>
    );
  }

  if (products.length === 1) {
    return (
      <div className="py-4 flex justify-center" aria-label="Frosted Fork product showcase">
        <div className="w-[min(94vw,620px)]">
          <ProductCard product={products[0]} />
        </div>
      </div>
    );
  }

  const loopedProducts = [...products, ...products];

  return (
    <div className="relative overflow-hidden py-4" aria-label="Frosted Fork product showcase">
      <div
        className={`product-showcase-track ${
          products.length > 3
            ? "product-showcase-track-shop"
            : products[0]?.category === "party-platters"
            ? "product-showcase-track-fast"
            : ""
        } flex gap-6 w-max`}
      >
        {loopedProducts.map((product, index) => (
          <div
            key={`${product.slug}-${index}`}
            className="w-[min(88vw,480px)] shrink-0"
            aria-hidden={index >= products.length ? "true" : undefined}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
