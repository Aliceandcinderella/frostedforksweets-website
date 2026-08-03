"use client";

import { CAKE_FLAVORS, CHOCOLATE_OPTIONS, SPECIAL_REQUEST_MESSAGE } from "@/data/products";
import { useCartStore } from "@/lib/cart";

const FLAVOR_COLORS: Record<string, { bg: string; text: string }> = {
  Chocolate: { bg: "#3C1A0E", text: "#D4A574" },
  Vanilla: { bg: "#FFF8E7", text: "#C8A45C" },
  Yellow: { bg: "#FFED4A", text: "#8B7500" },
  Funfetti: { bg: "#FFE4F2", text: "#E040A0" },
  Carrot: { bg: "#F5A623", text: "#5C3300" },
  Lemon: { bg: "#FFFACD", text: "#C8A800" },
  White: { bg: "#F5F5F5", text: "#999999" },
  Raspberry: { bg: "#E30B5D", text: "#FFB6D0" },
  "Red Velvet": { bg: "#8B0000", text: "#FFCCCC" },
  "Cookies & Cream": { bg: "#3A3A3A", text: "#E8E8E8" },
  Strawberry: { bg: "#FF6B8A", text: "#FFD6E0" },
};

export function FlavorPicker({ showChocolate = true }: { showChocolate?: boolean }) {
  const pickedFlavor = useCartStore((s) => s.pickedFlavor);
  const setPickedFlavor = useCartStore((s) => s.setPickedFlavor);
  const pickedChocolate = useCartStore((s) => s.pickedChocolate);
  const setPickedChocolate = useCartStore((s) => s.setPickedChocolate);

  return (
    <div className="space-y-8">
      {/* Flavors */}
      <div>
        <h3 className="font-display font-bold text-lg mb-1">Pick Your Cake Flavor</h3>
        <p className="text-sm text-muted mb-4">
          Every great treat starts with great cake. Choose your favorite flavor and
          we&apos;ll do the frosting magic.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {CAKE_FLAVORS.map((flavor) => {
            const colors = FLAVOR_COLORS[flavor] ?? { bg: "#E8E8E8", text: "#555" };
            const isSelected = pickedFlavor === flavor;
            return (
              <button
                key={flavor}
                onClick={() =>
                  setPickedFlavor(isSelected ? null : flavor)
                }
                className={`relative rounded-xl p-4 text-center font-semibold text-sm transition-all duration-200 ${
                  isSelected
                    ? "ring-2 ring-neon-pink ring-offset-2 scale-[1.03] shadow-lg"
                    : "hover:scale-[1.02] hover:shadow-md"
                }`}
                style={{
                  backgroundColor: colors.bg,
                  color: colors.text,
                }}
              >
                {flavor}
                {isSelected && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-neon-pink text-white text-[10px] rounded-full flex items-center justify-center">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-muted italic">
          {SPECIAL_REQUEST_MESSAGE}
        </p>
      </div>

      {/* Chocolate */}
      {showChocolate && (
        <div>
          <h3 className="font-display font-bold text-lg mb-1">Pick Your Chocolate</h3>
          <p className="text-sm text-muted mb-4">
            Milk or white chocolate coating for your treats.
          </p>
          <div className="flex gap-4">
            {CHOCOLATE_OPTIONS.map((choc) => {
              const isSelected = pickedChocolate === choc;
              return (
                <button
                  key={choc}
                  onClick={() =>
                    setPickedChocolate(isSelected ? null : choc)
                  }
                  className={`px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-200 flex-1 max-w-[200px] ${
                    isSelected
                      ? "ring-2 ring-neon-pink ring-offset-2 bg-ink text-white scale-[1.03]"
                      : "bg-card border hover:border-neon-pink hover:scale-[1.02]"
                  }`}
                >
                  {choc} Chocolate
                  {isSelected && (
                    <span className="ml-2 text-neon-pink">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {(pickedFlavor || pickedChocolate) && (
        <div className="flex items-center gap-2 text-sm text-muted bg-page px-4 py-3 rounded-lg">
          {pickedFlavor && (
            <span>
              Flavor: <strong className="text-body">{pickedFlavor}</strong>
            </span>
          )}
          {pickedFlavor && pickedChocolate && <span>·</span>}
          {pickedChocolate && (
            <span>
              Chocolate:{" "}
              <strong className="text-body">{pickedChocolate}</strong>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
