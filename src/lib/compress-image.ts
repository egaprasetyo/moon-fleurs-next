import imageCompression, { type Options } from "browser-image-compression";

const MAX_INPUT_BYTES = 12 * 1024 * 1024; // sebelum kompresi — izinkan foto besar dari kamera

/** Target & batas dimensi untuk tampilan web (cukup tajam, hemat storage). */
const OPTIONS: Options = {
  maxSizeMB: 0.85,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  initialQuality: 0.82,
};

export { MAX_INPUT_BYTES };

/**
 * Kompresi di browser sebelum upload ke storage.
 * PNG dengan transparansi tetap dioptimalkan tanpa paksa jadi JPEG.
 */
export async function compressImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  if (file.type === "image/gif") return file;

  try {
    const out = await imageCompression(file, OPTIONS);
    return out.size < file.size ? out : file;
  } catch {
    return file;
  }
}

export function extensionForMime(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/jpeg" || mime === "image/jpg") return "jpg";
  return "jpg";
}
