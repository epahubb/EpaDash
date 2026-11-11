import { create } from "zustand";
const mockUser = {
  id: "rider-001",
  email: "kwame@epadash.com",
  firstName: "Kwame",
  lastName: "Mensah",
  phone: "+233 24 567 8901",
  role: "rider",
  vehicleType: "motorcycle",
  rating: 4.8,
  memberSince: "2024-03-15",
  totalDeliveries: 847,
  totalEarnings: 12650.4
};
const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  login: async (_email, _password) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1200));
    set({
      user: mockUser,
      token: "mock-jwt-token-rider",
      isAuthenticated: true,
      isLoading: false
    });
  },
  register: async (_data) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({
      user: mockUser,
      token: "mock-jwt-token-rider",
      isAuthenticated: true,
      isLoading: false
    });
  },
  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  },
  setLoading: (loading) => set({ isLoading: loading })
}));
export {
  useAuthStore
};
