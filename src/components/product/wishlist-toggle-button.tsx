"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/stores/wishlist-store";

interface WishlistToggleButtonProps {
  productId: string;
}

export function WishlistToggleButton({ productId }: WishlistToggleButtonProps) {
  const { isInWishlist, toggleItem } = useWishlistStore();
  const wishlisted = isInWishlist(productId);

  return (
    <Button
      variant="outline"
      size="lg"
      className={`flex-1 gap-2 rounded-full border-2 transition-all hover:bg-muted active:scale-95 ${
        wishlisted ? "border-rose-400/50 bg-rose-50" : ""
      }`}
      onClick={() => toggleItem(productId)}
    >
      <Heart
        className={`h-5 w-5 transition-transform ${
          wishlisted ? "fill-red-500 text-red-500 scale-110" : ""
        }`}
      />
      <span className="font-semibold">
        {wishlisted ? "Tersimpan di Wishlist" : "Simpan ke Wishlist"}
      </span>
    </Button>
  );
}
