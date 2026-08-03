import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PRODUCTS, getProductsByCategory } from "@/data/products";
import type { ProductCategory } from "@/data/products";
import { ProductGrid } from "@/components/ProductGrid";
import { SectionHeading } from "@/components/SectionHeading";
import Link from "next/link";

const CATEGORY_META: Record<
  ProductCategory,
  { title: string; description: string; eyebrow: string }
> = {
  "cake-bites": {
    eyebrow: "Signature",
    title: "Cake Bites",
    description:
      "Rich cake blended with buttercream frosting and coated in your choice of milk or white chocolate. The perfect forking bite.",
  },
  "dot-cakes": {
    eyebrow: "On the Go",
    title: "Dot Cakes",
    description:
      "Fluffy cake topped with buttercream swirl and rainbow dot sprinkles. Served with a fork in its own lidded container.",
  },
  "sweet-treats": {
    eyebrow: "Dipped & Dressed",
    title: "Sweet Treats",
    description:
      "Sweet Treats customizable for any event, theme, or holiday.",
  },
  "custom-cakes": {
    eyebrow: "Custom",
    title: "Custom Cakes",
    description:
      "4-inch and 6-inch custom cakes with your choice of flavor, colors, themes, and buttercream designs.",
  },
  "party-platters": {
    eyebrow: "For a Crowd",
    title: "Party Platters",
    description:
      "Because sharing is caring… sort of. Sweet tables sized for every gathering, from the Little Forkful to the Full Forking Spread.",
  },
};

export async function generateStaticParams() {
  const categories = Array.from(new Set(PRODUCTS.map((p) => p.category)));
  return categories.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = CATEGORY_META[slug as ProductCategory];
  if (!meta) return { title: "Collection Not Found" };
  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = slug as ProductCategory;

  if (!CATEGORY_META[category]) notFound();

  const products = getProductsByCategory(category);
  const meta = CATEGORY_META[category];

  return (
    <>
      <section className="pt-28 pb-8 px-6 bg-ink text-center">
        <SectionHeading
          eyebrow={meta.eyebrow}
          title={meta.title}
          subtitle={meta.description}
          center
          light
        />
      </section>

      <section className="py-10 px-6 max-w-7xl mx-auto">
        <ProductGrid products={products} />

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/shop"
            className="text-sm text-muted hover:text-electric-cyan transition-colors"
          >
            ← Back to All Treats
          </Link>
        </div>
      </section>
    </>
  );
}
