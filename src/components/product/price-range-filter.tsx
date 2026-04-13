"use client";

import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import { usePriceRange } from "@/hooks/use-products";

export function PriceRangeFilter() {
  const { priceRange, setPriceRange } = useAppStore();
  const { data: range } = usePriceRange();

  const min = range?.min ?? 0;
  const max = range?.max ?? 10000000;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Harga</span>
        <span className="text-xs text-muted-foreground">
          {formatPrice(priceRange[0])} — {formatPrice(priceRange[1])}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={10000}
        value={priceRange}
        onValueChange={(val) => setPriceRange(val as [number, number])}
        className="w-full"
      />
    </div>
  );
}
