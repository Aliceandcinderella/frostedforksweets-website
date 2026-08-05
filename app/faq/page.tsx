import type { Metadata } from "next";
import { FAQ } from "@/data/content";
import { SectionHeading } from "@/components/SectionHeading";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Frosted Fork ordering, pickup, custom orders, allergens, and more.",
};

export default function FAQPage() {
  return (
    <>
      <section className="pt-28 pb-8 px-6 bg-ink text-center">
        <SectionHeading
          eyebrow="FAQ"
          title="Forking Questions?"
          subtitle="Everything you need to know about ordering, pickup, custom treats, and more."
          center
          light
        />
      </section>

      <section className="py-12 px-6 max-w-3xl mx-auto">
        <div className="space-y-4">
          {FAQ.map((item, index) => (
            <details
              key={index}
              className="group rounded-xl border bg-card overflow-hidden"
            >
              <summary className="cursor-pointer px-6 py-4 font-semibold text-sm sm:text-base flex items-center justify-between gap-4 hover:text-neon-pink transition-colors">
                {item.q}
                <span className="text-muted group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="px-6 pb-4 text-sm text-muted leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted mb-4">
            Still have questions? We&apos;re happy to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-block px-8 py-3 rounded-full bg-neon-pink text-white font-semibold text-sm hover:bg-neon-pink/90 transition-colors"
            >
              Contact Us →
            </Link>
            <Link
              href="/custom-orders"
              className="inline-block px-8 py-3 rounded-full border text-body font-semibold text-sm hover:border-neon-pink hover:text-neon-pink transition-colors"
            >
              Start a Custom Order →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
