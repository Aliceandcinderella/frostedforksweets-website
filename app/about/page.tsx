import type { Metadata } from "next";
import {
  MISSION_STATEMENT,
  ABOUT_STORY,
  WHY_DIFFERENT,
  GIVING_BACK,
} from "@/data/content";
import { SectionHeading } from "@/components/SectionHeading";
import { NeonStrip } from "@/components/NeonStrip";

export const metadata: Metadata = {
  title: "About",
  description:
    "Frosted Fork — handcrafted desserts that bring people together. Our story, mission, and why we're different.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-16 px-6 bg-ink text-center">
        <SectionHeading
          eyebrow="Our Story"
          title="Why Frosted Fork Exists"
          subtitle={MISSION_STATEMENT}
          center
          light
        />
      </section>

      {/* Story */}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        <div className="prose prose-lg max-w-none">
          {ABOUT_STORY.paragraphs.map((para, i) => (
            <p key={i} className="text-body/80 leading-relaxed mb-6 text-base">
              {para}
            </p>
          ))}
        </div>
      </section>

      <NeonStrip text="More Than Dessert. It's a Forking Good Time." />

      {/* Why Different */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <SectionHeading
          eyebrow="Our Difference"
          title={WHY_DIFFERENT.headline}
          center
        />
        <p className="text-base text-body/80 leading-relaxed mb-10 text-center max-w-2xl mx-auto">
          {WHY_DIFFERENT.intro}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WHY_DIFFERENT.points.map((point) => (
            <div
              key={point.title}
              className="glow-card p-8 rounded-xl text-center"
            >
              <h3 className="font-display font-bold text-lg mb-3">
                {point.title}
              </h3>
              <p className="text-sm text-muted">{point.description}</p>
            </div>
          ))}
        </div>
        <p className="text-center mt-10 font-script text-xl text-neon-pink">
          {WHY_DIFFERENT.closing}
        </p>
      </section>

      <NeonStrip text="Cake + Frosting + Chocolate = The Perfect Forking Bite." color="cyan" />

      {/* Giving Back */}
      <section className="py-16 px-6 max-w-3xl mx-auto text-center">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-body mb-4">
          {GIVING_BACK.headline}
        </h2>
        <p className="text-base text-muted leading-relaxed max-w-xl mx-auto mb-4">
          {GIVING_BACK.body}
        </p>
        <p className="font-script text-lg text-neon-pink">
          {GIVING_BACK.tagline}
        </p>
      </section>
    </>
  );
}
