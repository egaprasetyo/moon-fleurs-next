import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: string[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleItem: (id: string) => void;
  clearAll: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (id) =>
        set((state) => {
          if (state.items.includes(id)) return state;
          return { items: [...state.items, id] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i !== id),
        })),

      isInWishlist: (id) => get().items.includes(id),

      toggleItem: (id) => {
        const { items } = get();
        if (items.includes(id)) {
          set({ items: items.filter((i) => i !== id) });
        } else {
          set({ items: [...items, id] });
        }
      },

      clearAll: () => set({ items: [] }),
    }),
    {
      name: "moon-fleurs-wishlist",
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (
          version === 0 &&
          persistedState &&
          typeof persistedState === "object" &&
          "items" in persistedState &&
          Array.isArray((persistedState as Record<string, unknown>).items)
        ) {
          const state = persistedState as { items: unknown[] };
          state.items = state.items
            .map((i) => (typeof i === "string" ? i : (i as { id?: string })?.id))
            .filter(Boolean);
        }
        return persistedState as WishlistState;
      }
    }
  )
);
