import { create } from "zustand";
const useCartStore = create((set, get) => ({
  items: [],
  addItem: (item) => {
    const existing = get().items.find((i) => i.id === item.id);
    if (existing) {
      set({
        items: get().items.map(
          (i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      });
    } else {
      set({ items: [...get().items, { ...item, quantity: 1 }] });
    }
  },
  removeItem: (id) => {
    set({ items: get().items.filter((i) => i.id !== id) });
  },
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    set({
      items: get().items.map((i) => i.id === id ? { ...i, quantity } : i)
    });
  },
  clearCart: () => set({ items: [] }),
  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  deliveryFee: () => {
    const items = get().items;
    if (items.length === 0) return 0;
    return 5;
  },
  serviceFee: () => {
    const sub = get().subtotal();
    if (sub === 0) return 0;
    return Math.round(sub * 0.05 * 100) / 100;
  },
  total: () => get().subtotal() + get().deliveryFee() + get().serviceFee(),
  merchantId: () => {
    const items = get().items;
    return items.length > 0 ? items[0].merchantId : null;
  }
}));
export {
  useCartStore
};
