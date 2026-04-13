import { PromoForm } from "@/components/admin/promo-form";

export default function NewPromoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Tambah Promo</h1>
        <p className="text-sm text-muted-foreground">Tambah voucher atau promo baru</p>
      </div>
      <PromoForm />
    </div>
  );
}
