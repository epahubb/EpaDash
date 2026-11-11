import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TokenManager } from "./token-manager";
const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: (user, tokenInput) => {
        const tokens = typeof tokenInput === "string" ? {
          accessToken: tokenInput,
          refreshToken: `${tokenInput}_refresh`,
          expiresAt: Date.now() + 3600 * 1e3
        } : tokenInput;
        TokenManager.setTokens(tokens);
        set({
          user,
          tokens,
          token: tokens.accessToken,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      },
      logout: () => {
        TokenManager.clearTokens();
        set({
          user: null,
          tokens: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      },
      setUser: (user) => set({ user }),
      setTokens: (tokens) => {
        TokenManager.setTokens(tokens);
        set({ tokens, token: tokens.accessToken });
      },
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error })
    }),
    {
      name: "epadash_auth_storage",
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
TokenManager.onAuthFailure(() => {
  useAuthStore.getState().logout();
});
export {
  useAuthStore
};
