"use client";

import { useCategories } from "@/hooks/use-categories";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";

export function CategoryFilter() {
  const { data: categories } = useCategories();
  const { selectedCategory, setSelectedCategory } = useAppStore();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setSelectedCategory(null)}
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-medium transition-colors border",
          !selectedCategory
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-transparent text-muted-foreground border-border hover:border-primary hover:text-primary"
        )}
      >
        Semua
      </button>
      {categories?.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setSelectedCategory(cat.slug)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors border",
            selectedCategory === cat.slug
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-transparent text-muted-foreground border-border hover:border-primary hover:text-primary"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
