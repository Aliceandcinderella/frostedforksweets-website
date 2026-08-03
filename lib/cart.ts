"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/products";

/* ── Types ── */
export type CartItem = {
  /** Unique line-item id */
  id: string;
  productSlug: string;
  name: string;
  /** Price per unit in cents (0 for quote-only items) */
  priceCents: number;
  quantity: number;
  /** Selected options e.g. { flavor: "Chocolate", coating: "Milk Chocolate" } */
  options: Record<string, string>;
  image: string;
  quoteOnly: boolean;
};

export type CartState = {
  items: CartItem[];
  isOpen: boolean;
  /* picked flavor (survives navigation) */
  pickedFlavor: string | null;
  pickedChocolate: string | null;

  /* actions */
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setPickedFlavor: (flavor: string | null) => void;
  setPickedChocolate: (choc: string | null) => void;

  /* derived */
  itemCount: () => number;
  subtotalCents: () => number;
};

let counter = 0;
function generateId(): string {
  counter += 1;
  return `ff-${Date.now()}-${counter}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      pickedFlavor: null,
      pickedChocolate: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (item) => {
        const id = generateId();
        set((s) => ({ items: [...s.items, { ...item, id }], isOpen: true }));
      },

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, qty) => {
        if (qty <= 0) {
          set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
        } else {
          set((s) => ({
            items: s.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
          }));
        }
      },

      clearCart: () => set({ items: [] }),

      setPickedFlavor: (flavor) => set({ pickedFlavor: flavor }),
      setPickedChocolate: (choc) => set({ pickedChocolate: choc }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotalCents: () =>
        get().items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0),
    }),
    {
      name: "frosted-fork-cart",
      partialize: (state) => ({
        items: state.items,
        pickedFlavor: state.pickedFlavor,
        pickedChocolate: state.pickedChocolate,
      }),
    }
  )
);

/** Helper to create a CartItem from a Product + selections */
export function buildCartItem(
  product: Product,
  options: Record<string, string>,
  quantity: number = 1
): Omit<CartItem, "id"> {
  return {
    productSlug: product.slug,
    name: product.name,
    priceCents: product.priceCents ?? 0,
    quantity,
    options,
    image: product.images[0] ?? "/images/products/cake-bites.png",
    quoteOnly: product.quoteOnly ?? false,
  };
}
