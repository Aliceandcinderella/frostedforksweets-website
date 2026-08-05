"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Simple client-only guard.
 * Prevents hydration mismatch by only rendering children after mount.
 */
const CartContext = createContext<{ mounted: boolean }>({ mounted: false });

export function useCartMounted() {
  return useContext(CartContext).mounted;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <CartContext.Provider value={{ mounted }}>{children}</CartContext.Provider>
  );
}
