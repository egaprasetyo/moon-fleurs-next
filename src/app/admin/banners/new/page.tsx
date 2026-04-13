import { BannerForm } from "@/components/admin/banner-form";

export default function NewBannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Tambah Banner</h1>
        <p className="text-sm text-muted-foreground">Tambah banner homepage baru</p>
      </div>
      <BannerForm />
    </div>
  );
}
