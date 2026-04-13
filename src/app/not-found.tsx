import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Container>
        <div className="mx-auto max-w-md text-center">
          <span className="mb-6 inline-block text-7xl">🌸</span>
          <h1 className="font-heading text-6xl font-bold text-primary">404</h1>
          <h2 className="mt-4 font-heading text-2xl font-semibold">
            Halaman Tidak Ditemukan
          </h2>
          <p className="mt-3 text-muted-foreground">
            Maaf, halaman yang kamu cari tidak tersedia atau sudah dipindahkan.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild className="rounded-full px-8">
              <Link href="/">Kembali ke Home</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-8">
              <Link href="/products">Lihat Produk</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
