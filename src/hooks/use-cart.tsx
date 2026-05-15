import { createContext, useContext, useMemo, useState } from "react";
import { MediaAssetModel } from "../types";

interface CartContextValue {
  items: MediaAssetModel[];
  addItem: (item: MediaAssetModel) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  total: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MediaAssetModel[]>([]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem: (item) => {
        setItems((prev) => (prev.some((it) => it.id === item.id) ? prev : [...prev, item]));
      },
      removeItem: (id) => {
        setItems((prev) => prev.filter((it) => it.id !== id));
      },
      clear: () => setItems([]),
      total: items.reduce((sum, item) => sum + Number(item.price), 0)
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
