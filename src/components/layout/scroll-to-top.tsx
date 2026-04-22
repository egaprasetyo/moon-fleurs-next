"use client";

import { Suspense, useEffect, useLayoutEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { scrollWindowToTop } from "@/lib/scroll";

/**
 * App Router tidak selalu mengembalikan scroll ke atas saat navigasi client.
 * Memakai pathname + query agar tiap navigasi unik; beberapa pass menangani layout konten tinggi / animasi.
 */
function ScrollToTopInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;

  useLayoutEffect(() => {
    scrollWindowToTop();
  }, [routeKey]);

  useEffect(() => {
    scrollWindowToTop();
    const t = window.setTimeout(scrollWindowToTop, 0);
    const raf = requestAnimationFrame(() => {
      scrollWindowToTop();
      requestAnimationFrame(scrollWindowToTop);
    });
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, [routeKey]);

  return null;
}

export function ScrollToTop() {
  return (
    <Suspense fallback={null}>
      <ScrollToTopInner />
    </Suspense>
  );
}
