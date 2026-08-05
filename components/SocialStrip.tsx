import { SITE } from "@/data/site";
import { FacebookIcon, InstagramIcon } from "@/components/Icons";

export function SocialStrip() {
  return (
    <section className="pt-6 pb-6 px-6 text-center bg-page">
      <h2 className="font-script text-3xl sm:text-4xl text-neon-pink mb-2">
        Follow the Fork
      </h2>
      <p className="text-muted text-sm mb-6 max-w-md mx-auto">
        Tag your treats with{" "}
        <span className="font-semibold text-body">#FrostedForkSweets</span> —
        we&apos;ll feature you on our page!
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href={SITE.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-neon-pink text-white font-semibold text-sm hover:bg-neon-pink/90 transition-colors"
        >
          <InstagramIcon className="h-5 w-5" />
          <span>Follow {SITE.instagram}</span>
        </a>
        <a
          href={SITE.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-electric-cyan/40 text-electric-cyan font-semibold text-sm hover:border-neon-pink hover:text-neon-pink transition-colors"
        >
          <FacebookIcon className="h-5 w-5" />
          <span>Follow on Facebook</span>
        </a>
      </div>
    </section>
  );
}
