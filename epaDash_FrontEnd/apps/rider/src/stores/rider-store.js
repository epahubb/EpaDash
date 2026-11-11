import { create } from "zustand";
const useRiderStore = create((set) => ({
  isOnline: false,
  toggleOnline: () => set((state) => ({ isOnline: !state.isOnline })),
  setOnline: (online) => set({ isOnline: online })
}));
export {
  useRiderStore
};
