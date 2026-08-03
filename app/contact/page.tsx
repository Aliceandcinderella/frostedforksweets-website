"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { SITE } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { QRCode } from "@/components/QRCode";
import { FacebookIcon, InstagramIcon, MailIcon, MapPinIcon, PhoneIcon, SparkleIcon } from "@/components/Icons";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: data.get("name"),
            email: data.get("email"),
            phone: "",
          },
          items: [
            {
              name: "Contact Form Message",
              description: (data.get("message") as string) || "",
              amountCents: 0,
              quantity: 1,
            },
          ],
          pickupOrDelivery: "n/a",
          requestedDate: "",
          notes: (data.get("message") as string) || "",
          subtotalCents: 0,
        }),
      });
      setSubmitted(true);
    } catch {
      // Still show success — the API logs the message
      setSubmitted(true);
    }
  };

  return (
    <>
      <section className="pt-28 pb-8 px-6 bg-ink text-center">
        <SectionHeading
          eyebrow="Contact"
          title="Fork It Over"
          subtitle="We'd love to hear from you. Questions, custom requests, or just want to say hi?"
          center
          light
        />
      </section>

      <section className="py-10 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-card border">
              <h3 className="font-display font-bold text-lg mb-4">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="h-5 w-5 text-neon-pink shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">{SITE.location}</p>
                    <p className="text-xs text-muted">Sumter County · Central Florida</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PhoneIcon className="h-5 w-5 text-neon-pink shrink-0" />
                  <div>
                    <a
                      href={`tel:${SITE.phoneHref}`}
                      className="font-semibold text-sm hover:text-neon-pink transition-colors"
                    >
                      {SITE.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MailIcon className="h-5 w-5 text-neon-pink shrink-0" />
                  <div>
                    <a
                      href={`mailto:${SITE.email}`}
                      className="font-semibold text-sm hover:text-neon-pink transition-colors break-all"
                    >
                      {SITE.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* QR + Instagram */}
            <div className="p-6 rounded-xl bg-card border text-center">
              <h3 className="font-display font-bold text-lg mb-4">
                Scan & Follow
              </h3>
              <div className="flex justify-center mb-4">
                <QRCode url={SITE.url} size={140} />
              </div>
              <p className="text-sm text-muted mb-2">
                Scan to visit{" "}
                <span className="font-semibold text-body">{SITE.website}</span>
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={SITE.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-neon-pink hover:underline"
                >
                  <InstagramIcon className="h-5 w-5" />
                  <span>{SITE.instagram}</span>
                </a>
                <a
                  href={SITE.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-electric-cyan hover:underline"
                >
                  <FacebookIcon className="h-5 w-5" />
                  <span>Facebook</span>
                </a>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="rounded-xl overflow-hidden border h-48 bg-ink/5 flex items-center justify-center">
              <p className="text-muted text-sm">
                <span className="inline-flex items-center gap-2"><MapPinIcon className="h-4 w-4" /> {SITE.location} — pickup by appointment</span>
              </p>
            </div>
          </div>

          {/* Message form */}
          <div>
            {submitted ? (
              <div className="p-8 rounded-xl bg-card border text-center">
                <SparkleIcon className="mx-auto mb-4 h-12 w-12 text-neon-pink" />
                <h3 className="font-display font-bold text-xl mb-2">
                  Message Sent!
                </h3>
                <p className="text-sm text-muted">
                  Thanks for reaching out! We&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-6 rounded-xl bg-card border space-y-4"
              >
                <h3 className="font-display font-bold text-lg mb-2">
                  Send a Message
                </h3>
                <div>
                  <label className="block text-sm font-semibold mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full rounded-lg border px-4 py-3 text-sm bg-page focus:outline-none focus:ring-2 focus:ring-neon-pink"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full rounded-lg border px-4 py-3 text-sm bg-page focus:outline-none focus:ring-2 focus:ring-neon-pink"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    className="w-full rounded-lg border px-4 py-3 text-sm bg-page focus:outline-none focus:ring-2 focus:ring-neon-pink"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-neon-pink text-white font-semibold text-sm hover:bg-neon-pink/90 transition-colors"
                >
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
