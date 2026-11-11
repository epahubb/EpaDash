import { create } from "zustand";
import { generateId } from "../utils";
export * from "../auth/auth-store";
const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (notification) => {
    const id = generateId();
    const newNotification = { ...notification, id };
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }));
    const duration = notification.duration ?? 4500;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id)
        }));
      }, duration);
    }
  },
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),
  clearAll: () => set({ notifications: [] })
}));
const useUIStore = create((set) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  isMobile: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebarCollapse: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setIsMobile: (isMobile) => set({ isMobile })
}));
export {
  useNotificationStore,
  useUIStore
};
