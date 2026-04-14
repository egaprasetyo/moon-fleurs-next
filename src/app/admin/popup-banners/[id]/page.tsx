import { PopupBannerForm } from "@/components/admin/popup-banner-form";

export default async function EditPopupBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Edit Popup Banner</h1>
        <p className="text-sm text-muted-foreground">Perbarui informasi popup promo</p>
      </div>
      <PopupBannerForm popupId={id} />
    </div>
  );
}
