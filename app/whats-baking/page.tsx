import type { Metadata } from "next";
import { readWhatsBakingPosts } from "@/data/whatsBakingStore";
import { SectionHeading } from "@/components/SectionHeading";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "What's Baking",
  description:
    "Fresh news, photos, seasonal treats, and bakery updates from Frosted Fork Sweet Treats.",
};

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export default async function WhatsBakingPage() {
  const posts = await readWhatsBakingPosts();

  return (
    <>
      <section className="pt-28 pb-10 px-6 bg-ink text-center">
        <SectionHeading
          eyebrow="Fresh from Frosted Fork"
          title="What's Baking"
          subtitle="Photos, bakery news, seasonal treats, custom cake inspiration, and sweet updates from the Frosted Fork kitchen."
          center
          light
        />
      </section>

      <section className="py-12 px-6 max-w-6xl mx-auto">
        {posts.length === 0 ? (
          <div className="glow-card rounded-2xl p-8 text-center">
            <h2 className="font-display font-bold text-2xl mb-3">No updates yet</h2>
            <p className="text-muted">Check back soon for fresh Frosted Fork news.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {posts.map((update) => (
              <article
                key={update.id}
                className="glow-card rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-[minmax(280px,420px)_1fr]"
              >
                {update.image && (
                  <div className="bg-ink product-placeholder min-h-[280px] lg:min-h-full p-4">
                    <img
                      src={update.image}
                      alt={update.imageAlt ?? update.title}
                      className="h-full w-full object-contain drop-shadow-xl"
                    />
                  </div>
                )}

                <div className="p-6 sm:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-electric-cyan mb-3">
                    {formatDate(update.date)}
                  </p>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-body mb-3">
                    {update.title}
                  </h2>
                  <p className="text-neon-pink font-semibold text-sm sm:text-base mb-5">
                    {update.summary}
                  </p>
                  <div className="space-y-4 text-sm sm:text-base text-body/75 leading-relaxed">
                    {update.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
