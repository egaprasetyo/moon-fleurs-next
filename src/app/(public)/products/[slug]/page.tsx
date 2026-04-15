import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ProductGallery } from "@/components/product/product-gallery";
import { WhatsAppOrderBtn } from "@/components/product/whatsapp-order-btn";
import { ShareButton } from "@/components/product/share-button";
import { WishlistToggleButton } from "@/components/product/wishlist-toggle-button";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { PLACEHOLDER_PRODUCT, SITE_URL } from "@/lib/constants";
import type { Product, Promo, StoreInfo } from "@/types";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

type ProductPageData = {
  product: Product;
  store: StoreInfo | null;
  activePromo: Promo | null;
  relatedProducts: Product[];
};

function toAbsoluteUrl(url: string | null | undefined) {
  if (!url) return `${SITE_URL}${PLACEHOLDER_PRODUCT}`;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

const getProductPageData = cache(
  async (slug: string): Promise<ProductPageData | null> => {
    const supabase = await createClient();
    const nowIso = new Date().toISOString();

    const { data: productData, error: productError } = await supabase
      .from("products")
      .select("*, category:categories(*), images:product_images(*)")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (productError) throw productError;
    if (!productData) return null;

    const product = productData as Product;
    const manualIds = Array.isArray(product.related_product_ids)
      ? product.related_product_ids
      : [];

    const [storeResult, promoResult, relatedResult] = await Promise.all([
      supabase.from("store_info").select("*").maybeSingle(),
      supabase
        .from("promos")
        .select("*")
        .eq("is_active", true)
        .lte("valid_from", nowIso)
        .or(`valid_until.is.null,valid_until.gte.${nowIso}`)
        .order("created_at", { ascending: false })
        .limit(1),
      manualIds.length > 0
        ? supabase
            .from("products")
            .select("*, category:categories(name, slug)")
            .in("id", manualIds)
            .eq("is_active", true)
            .limit(4)
        : supabase
            .from("products")
            .select("*, category:categories(name, slug)")
            .eq("category_id", product.category_id)
            .eq("is_active", true)
            .neq("id", product.id)
            .order("created_at", { ascending: false })
            .limit(4),
    ]);

    if (storeResult.error) throw storeResult.error;
    if (promoResult.error) throw promoResult.error;
    if (relatedResult.error) throw relatedResult.error;

    return {
      product,
      store: (storeResult.data as StoreInfo | null) ?? null,
      activePromo: ((promoResult.data ?? [])[0] as Promo | undefined) ?? null,
      relatedProducts: (relatedResult.data ?? []) as Product[],
    };
  }
);

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductPageData(slug);

  if (!data) {
    return {
      title: "Produk Tidak Ditemukan",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { product } = data;
  const hasDiscount =
    product.discount_price !== null && product.discount_price < product.price;
  const finalPrice = hasDiscount ? product.discount_price! : product.price;
  const title = `${product.name} | Moon Fleurs`;
  const description =
    product.description?.trim() ||
    `Miliki ${product.name} bunga artificial premium dari Moon Fleurs.`;
  const productUrl = `${SITE_URL}/products/${product.slug}`;
  const imageUrl = toAbsoluteUrl(product.thumbnail_url);

  return {
    title,
    description,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: productUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    other: {
      "product:price:amount": `${finalPrice}`,
      "product:price:currency": "IDR",
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const data = await getProductPageData(slug);

  if (!data) {
    notFound();
  }

  const { product, store, activePromo, relatedProducts } = data;
  const hasDiscount =
    product.discount_price !== null && product.discount_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.discount_price! / product.price) * 100)
    : 0;
  const finalPrice = hasDiscount ? product.discount_price! : product.price;

  const schemaImages = [
    product.thumbnail_url,
    ...(product.images ?? []).map((image) => image.image_url),
  ]
    .filter(Boolean)
    .map((url) => toAbsoluteUrl(url));

  return (
    <section className="relative min-h-screen overflow-hidden py-6 md:py-20">
      <div className="pointer-events-none absolute -left-[10%] top-0 -z-10 h-[500px] w-[500px] rounded-full bg-rose-light/20 blur-[120px] dark:bg-rose-dark/10" />

      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <ProductGallery
            thumbnail={product.thumbnail_url}
            images={product.images || []}
            productName={product.name}
          />

          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {product.category && (
                  <Badge variant="secondary" className="rounded-full px-3 py-1 font-semibold">
                    {product.category.name}
                  </Badge>
                )}
                {hasDiscount && (
                  <Badge className="bg-gradient-to-r from-destructive to-rose-400 rounded-full px-3 py-1 text-white shadow-sm font-semibold border-0">
                    Diskon {discountPercent}%
                  </Badge>
                )}
                {activePromo && (
                  <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-full px-3 py-1 text-white shadow-sm font-semibold border-0">
                    Promo: {activePromo.code}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <h1 className="font-sans text-4xl font-extrabold tracking-tight md:text-5xl">
                  {product.name}
                </h1>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl font-black text-primary md:text-4xl">
                    {formatPrice(finalPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-xl font-medium text-muted-foreground line-through decoration-muted-foreground/40">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {product.description && (
              <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground leading-relaxed">
                <p>{product.description}</p>
              </div>
            )}

            <div className="h-px w-full bg-gradient-to-r from-border/80 via-border/40 to-transparent" />

            <div className="space-y-4 pt-2">
              {store?.whatsapp_number && (
                <div className="group w-full">
                  <WhatsAppOrderBtn
                    productName={product.name}
                    price={finalPrice}
                    whatsappNumber={store.whatsapp_number}
                    promoCode={activePromo?.code}
                  />
                </div>
              )}

              <div className="flex gap-3">
                <WishlistToggleButton productId={product.id} />
                <div className="shrink-0">
                  <ShareButton
                    productName={product.name}
                    productSlug={product.slug}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-24 md:mt-32">
            <section className="mt-16">
              <h2 className="mb-6 font-heading text-2xl font-bold">Produk Terkait</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </section>
          </div>
        )}
      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: schemaImages,
            description:
              product.description ||
              `Miliki ${product.name} bunga artificial premium dari Moon Fleurs.`,
            sku: product.slug,
            offers: {
              "@type": "Offer",
              url: `${SITE_URL}/products/${product.slug}`,
              priceCurrency: "IDR",
              price: finalPrice,
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />
    </section>
  );
}
