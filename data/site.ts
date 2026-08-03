/**
 * Frosted Fork — Site-wide constants.
 * Edit this file to update business info across the entire site.
 */

export const SITE = {
  name: "Frosted Fork",
  fullName: "Frosted Fork Sweet Treats",
  tagline: "Small Cakes & Sweet Treats",
  location: "Wildwood, FL",
  phone: "(352) 399-8024",
  phoneHref: "3523998024",
  email: "contact@frostedforksweets.com",
  notificationEmail: "frostedforksweets@outlook.com",
  futureEmail: "orders@frostedforksweets.com",
  futureEmailForwardTo: "frostedforksweets@outlook.com",
  futureEmailRelayProvider: "Cloudflare Email Routing",
  website: "www.frostedforksweets.com",
  url: "https://www.frostedforksweets.com",
  instagram: "@frostedforksweets",
  instagramUrl: "https://www.instagram.com/frostedforksweets/",
  facebook: "Frosted Fork Sweets on Facebook",
  facebookUrl: "https://www.facebook.com/profile.php?id=61591591750589",
} as const;

export const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "What's Baking", href: "/whats-baking" },
  { label: "Cake Bites", href: "/collections/cake-bites" },
  { label: "Dot Cakes", href: "/collections/dot-cakes" },
  { label: "Sweet Treats", href: "/collections/sweet-treats" },
  { label: "Custom Cakes", href: "/collections/custom-cakes" },
  { label: "Party Platters", href: "/collections/party-platters" },
  { label: "About", href: "/about" },
  { label: "Meet the Baker", href: "/meet-the-baker" },
] as const;

export const FOOTER_LINKS = {
  navigate: [
  ],
  connect: [
    { label: "About", href: "/about" },
    { label: "Meet the Baker", href: "/meet-the-baker" },
    { label: "Contact", href: "/contact" },
    { label: "Instagram", href: "https://www.instagram.com/frostedforksweets/" },
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61591591750589" },
  ],
} as const;
