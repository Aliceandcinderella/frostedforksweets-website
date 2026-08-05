import Link from "next/link";
import { SITE, FOOTER_LINKS } from "@/data/site";
import { QRCode } from "@/components/QRCode";

export function Footer() {
  return (
    <>
      <footer className="bg-ink text-white/90 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Brand */}
            <div>
              <span className="block font-script text-3xl text-white mb-2">
                Frosted Fork
              </span>
              <p className="text-sm text-white/80 leading-relaxed max-w-xs">
                Small Cakes & Sweet Treats
                <br />
                handcrafted in {SITE.location}.
              </p>
              <div className="mt-4 flex items-center gap-4">
                <QRCode url={SITE.url} size={80} />
                <div className="text-xs text-white/75">
                  <span className="block">{SITE.instagram}</span>
                  <span className="block">{SITE.website}</span>
                </div>
              </div>
            </div>

            {/* Connect */}
            <div className="md:justify-self-start text-center">
              <h3 className="font-display text-xs font-bold tracking-[0.2em] uppercase text-white mb-4">
                Connect
              </h3>
              <ul className="space-y-2">
                {FOOTER_LINKS.connect.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/85 hover:text-electric-cyan transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="text-sm text-white/85 hover:text-electric-cyan transition-colors"
                  >
                    {SITE.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${SITE.phoneHref}`}
                    className="text-sm text-white/85 hover:text-electric-cyan transition-colors"
                  >
                    {SITE.phone}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-white/[0.08] pt-6 text-white/80 text-xs leading-relaxed">
            <div className="mb-6 max-w-5xl rounded-xl border border-neon-pink/40 bg-neon-pink/[0.08] p-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-neon-pink mb-3">
                Allergen Warning
              </h3>
              <p>
                Our products are made in a kitchen that handles major food allergens including wheat, eggs, milk, soy, peanuts, tree nuts, fish, shellfish, and sesame. While we take strict precautions to prevent cross-contamination, we cannot guarantee that our treats are 100% free from traces of these allergens. If you have a severe allergy, please notify us when you place your order.
              </p>
            </div>

            <div className="max-w-5xl rounded-xl border border-neon-pink/40 bg-neon-pink/[0.08] p-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-neon-pink mb-3">
                Privacy Statement
              </h3>
              <div className="space-y-3">
                <p>
                  At Frosted Fork Sweet Treats, we respect your privacy. Any information you provide through our website, email, or phone—including your name, contact information, and order details—is used solely to communicate with you, process your order, and provide the best possible customer service.
                </p>
                <p>
                  We do not sell, rent, or share your personal information with third parties for marketing purposes. Your information is kept confidential and used only as necessary to fulfill your request or comply with applicable laws.
                </p>
                <p>
                  By using this website, you agree to the terms of this Privacy Statement. We may update this statement periodically, and any changes will be posted on this page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="bg-ink border-t border-white/[0.06] py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-xs text-white/75">
            © 2026 Frosted Fork Sweets, LLC. All Rights Reserved.
          </span>
          <span className="text-xs text-white/70">
            Made in Central Florida
          </span>
        </div>
      </div>
    </>
  );
}
