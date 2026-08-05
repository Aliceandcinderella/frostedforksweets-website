"use client";

import { useState } from "react";
import Link from "next/link";

export default function WhatsBakingAdminPage() {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/whats-baking", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (!response.ok) {
        setStatus(result.error || "Unable to publish update.");
        return;
      }
      form.reset();
      setStatus("Published! View it on the What's Baking page.");
    } catch {
      setStatus("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="pt-28 pb-16 px-6 max-w-3xl mx-auto">
      <div className="glow-card rounded-2xl p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-electric-cyan mb-3">
          Private Posting Tool
        </p>
        <h1 className="font-display font-bold text-3xl mb-3">Post to What's Baking</h1>
        <p className="text-sm text-muted mb-8">
          Use this page to publish a photo and news/blog update. Keep the admin password private.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1">Admin Password</label>
            <input name="password" type="password" required className="w-full rounded-lg border px-4 py-3 text-sm bg-page focus:outline-none focus:ring-2 focus:ring-neon-pink" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Post Title</label>
              <input name="title" required className="w-full rounded-lg border px-4 py-3 text-sm bg-page focus:outline-none focus:ring-2 focus:ring-neon-pink" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Date</label>
              <input name="date" type="date" className="w-full rounded-lg border px-4 py-3 text-sm bg-page focus:outline-none focus:ring-2 focus:ring-neon-pink" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Short Summary</label>
            <input name="summary" required className="w-full rounded-lg border px-4 py-3 text-sm bg-page focus:outline-none focus:ring-2 focus:ring-neon-pink" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Blog / News Update</label>
            <textarea name="body" rows={8} required placeholder="Write your update here. Use blank lines between paragraphs." className="w-full rounded-lg border px-4 py-3 text-sm bg-page focus:outline-none focus:ring-2 focus:ring-neon-pink" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Upload Photo</label>
            <input name="imageFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="w-full rounded-lg border px-4 py-3 text-sm bg-page" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Image Alt Text</label>
            <input name="imageAlt" placeholder="Describe the photo for accessibility" className="w-full rounded-lg border px-4 py-3 text-sm bg-page focus:outline-none focus:ring-2 focus:ring-neon-pink" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Or Existing Image URL</label>
            <input name="imageUrl" placeholder="/brand/logo.png or /whats-baking/photo.jpg" className="w-full rounded-lg border px-4 py-3 text-sm bg-page focus:outline-none focus:ring-2 focus:ring-neon-pink" />
          </div>

          {status && <p className="text-sm font-semibold text-neon-pink">{status}</p>}

          <div className="flex flex-col sm:flex-row gap-3">
            <button disabled={submitting} className="px-8 py-3 rounded-full bg-neon-pink text-white font-bold text-sm disabled:opacity-50">
              {submitting ? "Publishing..." : "Publish Update"}
            </button>
            <Link href="/whats-baking" className="px-8 py-3 rounded-full border text-center text-sm font-semibold hover:border-neon-pink hover:text-neon-pink">
              View What's Baking
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
