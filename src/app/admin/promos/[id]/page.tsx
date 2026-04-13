"use client";

import { useParams } from "next/navigation";
import { PromoForm } from "@/components/admin/promo-form";

export default function EditPromoPage() {
  const params = useParams();
  const promoId = params.id as string;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Edit Promo</h1>
        <p className="text-sm text-muted-foreground">Perbarui informasi voucher & promo</p>
      </div>
      <PromoForm promoId={promoId} />
    </div>
  );
}
