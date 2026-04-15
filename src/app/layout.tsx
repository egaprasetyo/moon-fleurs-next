import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { createClient } from "@/lib/supabase/server";
import { GoogleAnalytics } from "@/components/providers/google-analytics";
import { APP_NAME, APP_DESCRIPTION, SEO_KEYWORDS, SITE_URL } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${APP_NAME} — Premium Artificial Flowers`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  authors: [{ name: APP_NAME }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: APP_NAME,
    title: `${APP_NAME} — Premium Artificial Flowers`,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — Premium Artificial Flowers`,
    description: APP_DESCRIPTION,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: store } = await supabase.from("store_info").select("*").single();

  // Memecah "Jl. Bunga Mawar No. 123, Jakarta Selatan" apabila memungkinkan, atau fallback ke standar.
  // Jika formatnya hanya sebaris, kita masukkan utuh ke streetAddress.
  const fallbackAddress = {
    streetAddress: store?.address || "Jakarta",
    addressLocality: "Jakarta",
    addressRegion: "DKI Jakarta",
    postalCode: "10000",
    addressCountry: "ID",
  };

  return (
    <html
      lang="id"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Global Schema - Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Florist",
              name: APP_NAME,
              image: `${SITE_URL}/images/og-image.jpg`,
              description: APP_DESCRIPTION,
              url: SITE_URL,
              telephone: store?.phone || store?.whatsapp_number || "+6281234567890",
              address: {
                "@type": "PostalAddress",
                ...fallbackAddress,
              },
            }),
          }}
        />
        {/* WebSite Schema - helps Google display correct site name */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: APP_NAME,
              alternateName: "Moon Fleurs — Premium Artificial Flowers",
              url: SITE_URL,
            }),
          }}
        />
        <QueryProvider>
          {children}
          <Toaster position="top-right" richColors />
        </QueryProvider>
        <GoogleAnalytics />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
