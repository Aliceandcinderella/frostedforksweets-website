import type { Metadata } from "next";
import { PRODUCTS } from "@/data/products";
import { ProductGrid } from "@/components/ProductGrid";
import { SITE } from "@/data/site";
import Link from "next/link";
import { MailIcon, PhoneIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Ready to Make Your Celebration Sweeter?",
  description:
    "Browse Frosted Fork Sweet Treats and contact us to place an order or request a custom quote.",
};

export default function ShopPage() {
  const categories = [
    { label: "All", slug: null },
    { label: "Cake Bites", slug: "cake-bites" },
    { label: "Dot Cakes", slug: "dot-cakes" },
    { label: "Sweet Treats", slug: "sweet-treats" },
    { label: "Custom Cakes", slug: "custom-cakes" },
    { label: "Party Platters", slug: "party-platters" },
  ];

  return (
    <>
      <section className="pt-28 pb-10 px-6 bg-ink text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-electric-cyan mb-4">
            Made to Order Sweet Treats
          </p>
          <h1 className="font-display font-bold text-4xl sm:text-6xl text-white leading-tight mb-6">
            Ready to Make Your Celebration Sweeter?
          </h1>
          <div className="space-y-5 text-white/75 text-base sm:text-lg leading-relaxed">
            <p>
              Every order is handcrafted just for you. Whether you&apos;re celebrating a birthday, wedding, baby shower, holiday, or simply treating yourself, we&apos;d love to create something special.
            </p>
            <p>
              Ready to place an order or request a custom quote? Contact us by phone or email, and we&apos;ll help you create the perfect dessert with your favorite flavors, colors, and design—made just for your celebration.
            </p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center text-lg font-semibold">
            <a
              href={`tel:${SITE.phoneHref}`}
              className="inline-flex items-center justify-center rounded-full bg-neon-pink px-7 py-3 text-white hover:bg-neon-pink/90 transition-colors"
            >
              <PhoneIcon className="h-5 w-5" />
              <span>Phone: 352-399-8024</span>
            </a>
            <a
              href="mailto:contact@frostedforksweets.com"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3 text-white hover:border-electric-cyan hover:text-electric-cyan transition-colors"
            >
              <MailIcon className="h-5 w-5" />
              <span>Email: contact@frostedforksweets.com</span>
            </a>
          </div>
        </div>
      </section>

      <section className="py-10 px-6 max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.slug ? `/collections/${cat.slug}` : "/shop"}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                !cat.slug
                  ? "bg-ink text-white"
                  : "bg-page border hover:border-neon-pink hover:text-neon-pink"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        <ProductGrid products={PRODUCTS} />
      </section>
    </>
  );
}
