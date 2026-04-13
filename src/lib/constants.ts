/**
 * Application-wide constants
 */

export const APP_NAME = "Moon Fleurs";
export const APP_DESCRIPTION =
  "Moon Fleurs menyediakan rangkaian bunga segar dan elegan untuk berbagai momen spesial. Pesan via WhatsApp.";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Pagination
export const PRODUCTS_PER_PAGE = 12;
export const REVIEWS_PER_PAGE = 10;

// Image placeholders
export const PLACEHOLDER_PRODUCT = "/images/placeholder-product.webp";
export const PLACEHOLDER_CATEGORY = "/images/placeholder-category.webp";
export const PLACEHOLDER_BANNER = "/images/placeholder-banner.webp";

// SEO
export const SEO_KEYWORDS = [
  "toko bunga",
  "florist",
  "rangkaian bunga",
  "bunga segar",
  "buket bunga",
  "Moon Fleurs",
  "Jakarta",
  "bunga papan",
  "bunga standing",
  "bunga pernikahan",
];

// Navigation links
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Store", href: "/store" },
] as const;

// Admin navigation links
export const ADMIN_NAV_LINKS = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Products", href: "/admin/products", icon: "Package" },
  { label: "Categories", href: "/admin/categories", icon: "Tags" },
  { label: "Banners", href: "/admin/banners", icon: "Image" },
  { label: "Reviews", href: "/admin/reviews", icon: "Star" },
  { label: "Promos", href: "/admin/promos", icon: "Ticket" },
  { label: "Store Info", href: "/admin/store", icon: "MapPin" },
] as const;
