import { create } from "zustand";

interface AppState {
  // Product filters
  selectedCategory: string | null;
  priceRange: [number, number];
  sortBy: "newest" | "price_asc" | "price_desc" | "name";
  searchQuery: string;

  // Actions
  setSelectedCategory: (slug: string | null) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: "newest" | "price_asc" | "price_desc" | "name") => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

const initialState = {
  selectedCategory: null,
  priceRange: [0, 10000000] as [number, number],
  sortBy: "newest" as const,
  searchQuery: "",
};

export const useAppStore = create<AppState>()((set) => ({
  ...initialState,

  setSelectedCategory: (slug) => set({ selectedCategory: slug }),
  setPriceRange: (range) => set({ priceRange: range }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  resetFilters: () => set(initialState),
}));
