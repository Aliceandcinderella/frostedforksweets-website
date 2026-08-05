"use client";

import { useState } from "react";
import Link from "next/link";
import { CUSTOM_ORDERS } from "@/data/content";
import { CAKE_FLAVORS } from "@/data/products";
import { SectionHeading } from "@/components/SectionHeading";
import { NeonStrip } from "@/components/NeonStrip";
import { CakeIcon } from "@/components/Icons";

export default function CustomOrdersPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: data.get("name"),
            email: data.get("email"),
            phone: data.get("phone"),
          },
          items: [
            {
              name: `${data.get("size") || "Custom"} Custom Cake / Order`,
              description: `Event: ${data.get("eventType")} · Date: ${data.get("eventDate")} · Theme: ${data.get("theme")} · Flavors: ${data.getAll("flavors").join(", ")} · Budget: ${data.get("budget")}`,
              amountCents: 0,
              quantity: 1,
            },
          ],
          pickupOrDelivery: "pickup",
          requestedDate: data.get("eventDate") as string,
          notes: (data.get("notes") as string) || "",
          subtotalCents: 0,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <section className="pt-28 pb-16 px-6 max-w-2xl mx-auto text-center">
          <CakeIcon className="mx-auto mb-6 h-14 w-14 text-neon-pink" />
          <SectionHeading
            title="Request Received!"
            subtitle="Thanks for reaching out! We'll review your request and get back to you within 24 hours with design ideas and a quote."
            center
          />
          <Link
            href="/shop"
            className="inline-block mt-6 px-8 py-3 rounded-full bg-neon-pink text-white font-semibold text-sm"
          >
            Back to Shop →
          </Link>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="pt-28 pb-8 px-6 bg-ink text-center">
        <SectionHeading
          eyebrow="Custom Orders"
          title={CUSTOM_ORDERS.headline}
          subtitle={CUSTOM_ORDERS.formIntro}
          center
          light
        />
      </section>

      <section className="py-10 px-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Name <span className="text-neon-pink">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full rounded-lg border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Email <span className="text-neon-pink">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-lg border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Phone <span className="text-neon-pink">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              className="w-full rounded-lg border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Event Type
              </label>
              <select
                name="eventType"
                className="w-full rounded-lg border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
              >
                {CUSTOM_ORDERS.events.map((ev) => (
                  <option key={ev} value={ev}>
                    {ev}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Event Date
              </label>
              <input
                type="date"
                name="eventDate"
                className="w-full rounded-lg border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Cake Size
            </label>
            <select
              name="size"
              className="w-full rounded-lg border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
            >
              {CUSTOM_ORDERS.sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Flavor Preferences
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CAKE_FLAVORS.map((flavor) => (
                <label
                  key={flavor}
                  className="flex items-center gap-2 text-sm p-2 rounded-lg border cursor-pointer hover:border-neon-pink"
                >
                  <input type="checkbox" name="flavors" value={flavor} />
                  {flavor}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Theme / Colors
            </label>
            <input
              type="text"
              name="theme"
              placeholder="e.g. pink & gold princess, baby blue elephant, school colors..."
              className="w-full rounded-lg border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Budget Range
            </label>
            <select
              name="budget"
              className="w-full rounded-lg border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
            >
              <option value="">Select a range</option>
              <option value="under-50">Under $50</option>
              <option value="50-100">$50 – $100</option>
              <option value="100-200">$100 – $200</option>
              <option value="200+">$200+</option>
              <option value="not-sure">Not sure yet</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Additional Notes
            </label>
            <textarea
              name="notes"
              rows={4}
              placeholder="Share inspiration photos, special requests, allergies, colors, flavors, or theme details..."
              className="w-full rounded-lg border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-full bg-neon-pink text-white font-bold text-base hover:bg-neon-pink/90 transition-colors disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Send Custom Request →"}
          </button>
        </form>

        <p className="mt-6 text-xs text-muted text-center">
          {CUSTOM_ORDERS.intro}
        </p>
      </section>

      <NeonStrip text="Custom desserts made for your celebration." color="cyan" />
    </>
  );
}
