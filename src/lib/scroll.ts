/** Scroll viewport dokumen ke atas (kompatibel lintas browser). */
export function scrollWindowToTop() {
  if (typeof window === "undefined") return;
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}
