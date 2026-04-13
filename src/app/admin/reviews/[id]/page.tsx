"use client";

import { useParams } from "next/navigation";
import { ReviewForm } from "@/components/admin/review-form";

export default function EditReviewPage() {
  const params = useParams();
  const reviewId = params.id as string;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Edit Review</h1>
        <p className="text-sm text-muted-foreground">Perbarui data review pelanggan</p>
      </div>
      <ReviewForm reviewId={reviewId} />
    </div>
  );
}
