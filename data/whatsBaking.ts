/**
 * Frosted Fork — What's Baking updates.
 *
 * To add a new update:
 * 1. Add your image to: public/whats-baking/
 * 2. Add a new object to WHATS_BAKING_UPDATES below.
 * 3. Use the image path like: /whats-baking/my-photo.jpg
 */

export type BakingUpdate = {
  title: string;
  date: string;
  summary: string;
  body: string[];
  image?: string;
  imageAlt?: string;
};

export const WHATS_BAKING_UPDATES: BakingUpdate[] = [
  {
    title: "Welcome to What's Baking",
    date: "2026-07-14",
    summary:
      "This is where Frosted Fork Sweet Treats will share new photos, seasonal treats, custom cake updates, and bakery news.",
    body: [
      "Check back here for fresh flavor announcements, behind-the-scenes photos, holiday specials, party platter ideas, and custom cake inspiration.",
    ],
    image: "/brand/logo.png",
    imageAlt: "Frosted Fork Sweet Treats logo",
  },
];
