"use client";

import { useParams } from "next/navigation";
import { BannerForm } from "@/components/admin/banner-form";

export default function EditBannerPage() {
  const params = useParams();
  const bannerId = params.id as string;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Edit Banner</h1>
        <p className="text-sm text-muted-foreground">Perbarui informasi banner homepage</p>
      </div>
      <BannerForm bannerId={bannerId} />
    </div>
  );
}
