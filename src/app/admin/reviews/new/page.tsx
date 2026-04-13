import { ReviewForm } from "@/components/admin/review-form";

export default function NewReviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Tambah Review</h1>
        <p className="text-sm text-muted-foreground">Tambah review pelanggan</p>
      </div>
      <ReviewForm />
    </div>
  );
}
