import Link from "next/link";
import {
  CATEGORY_TILES,
  MORE_THAN_DESSERT,
  GIVING_BACK,
} from "@/data/content";
import { SITE } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { NeonHero } from "@/components/NeonHero";
import { CategoryTile } from "@/components/CategoryTile";
import { SocialStrip } from "@/components/SocialStrip";
import { MailIcon, PhoneIcon } from "@/components/Icons";

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <NeonHero />

      {/* ── What We Make ── */}
      <section className="py-16 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="What We Make"
            title="Find Your Sweet Spot"
            subtitle="Handcrafted desserts for every occasion—from a single sweet bite to an unforgettable dessert spread. Every creation is made to order, with your choice of cake flavors, fillings, frostings, and color palette to perfectly match your celebration."
            center
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 mt-12">
            {CATEGORY_TILES.map((cat, index) => (
              <div
                key={cat.slug}
                className={`lg:col-span-2 ${
                  index === 3 ? "lg:col-start-2" : index === 4 ? "lg:col-start-4" : ""
                }`}
              >
                <CategoryTile {...cat} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Celebration CTA ── */}
      <section className="py-16 px-6 bg-ink text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white leading-tight mb-6">
            Ready to Make Your Celebration Sweeter?
          </h2>
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

      {/* ── More Than Dessert ── */}
      <section className="neon-strip py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading
            eyebrow="Our Philosophy"
            title={MORE_THAN_DESSERT.headline}
            center
            light
          />
          <p className="text-white/70 text-base leading-relaxed whitespace-pre-line max-w-xl mx-auto">
            {MORE_THAN_DESSERT.body}
          </p>
        </div>
      </section>

      {/* ── Giving Back ── */}
      <section className="pt-16 pb-6 px-6 max-w-3xl mx-auto text-center">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-body mb-4">
          {GIVING_BACK.headline}
        </h2>
        <p className="text-muted text-base leading-relaxed max-w-xl mx-auto mb-4">
          {GIVING_BACK.body}
        </p>
        <p className="font-script text-lg text-neon-pink">
          {GIVING_BACK.tagline}
        </p>
      </section>

      {/* ── Instagram ── */}
      <SocialStrip />

      {/* ── Newsletter / Contact Prompt ── */}
      <section className="pt-6 pb-16 px-6 max-w-xl mx-auto text-center">
        <h2 className="font-display font-bold text-2xl mb-2">
          Stay in the Sweet Loop
        </h2>
        <p className="text-muted text-sm mb-6">
          Follow along on Instagram for new flavors, seasonal drops, and behind-the-scenes treats.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-muted/30 text-body font-semibold text-sm hover:border-neon-pink hover:text-neon-pink transition-colors"
          >
            <MailIcon className="h-5 w-5" />
            <span>Get in Touch</span>
          </Link>
        </div>
      </section>
    </>
  );
}
