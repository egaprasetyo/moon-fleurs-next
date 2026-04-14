import { PopupBannerForm } from "@/components/admin/popup-banner-form";

export default function NewPopupBannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Tambah Popup Banner</h1>
        <p className="text-sm text-muted-foreground">Buat popup promo baru untuk halaman publik</p>
      </div>
      <PopupBannerForm />
    </div>
  );
}
