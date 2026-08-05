import type { Product } from "@/data/products";

function categoryLabel(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="glow-card rounded-card overflow-hidden flex flex-col h-full cursor-default select-text">
      <div className="min-h-[420px] product-placeholder rounded-t-card p-2 sm:p-3">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full max-w-full max-h-full object-contain drop-shadow-xl"
          loading="lazy"
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-electric-cyan mb-1">
            {categoryLabel(product.category)}
          </p>
          <h3 className="font-display font-bold text-xl text-body leading-tight">
            {product.name}
          </h3>
          {product.tagline && (
            <p className="text-sm text-neon-pink mt-1 italic">{product.tagline}</p>
          )}
        </div>

        <p className="text-sm text-body/75 leading-relaxed mb-4">
          {product.description}
        </p>

        <div className="mt-auto space-y-3 text-xs text-muted">
          {product.sizeText && (
            <p>
              <span className="font-semibold text-body">Size:</span> {product.sizeText}
            </p>
          )}

          {product.flavors && product.flavors.length > 0 && (
            <p>
              <span className="font-semibold text-body">Flavors:</span>{" "}
              Chocolate, Vanilla, Yellow, Funfetti, Carrot, Lemon, White, Raspberry, Red Velvet, Cookies &amp; Cream, Strawberry. Have a specific flavor in mind? If it&apos;s not on the menu, we will make it from scratch just for you.
            </p>
          )}

          {product.options && product.options.length > 0 && (
            <div className="space-y-1">
              {product.options.map((option) => (
                <p key={option.name}>
                  <span className="font-semibold text-body">{option.name}:</span>{" "}
                  {option.values.join(", ")}
                </p>
              ))}
            </div>
          )}

        </div>
      </div>
    </article>
  );
}
