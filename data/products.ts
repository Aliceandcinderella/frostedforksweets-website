/**
 * Frosted Fork — Product Catalog
 *
 * SINGLE SOURCE OF TRUTH for all product data.
 * Colleen: edit this file to update products, descriptions, and prices.
 * Prices marked // TODO: confirm are placeholders — set final values here.
 */

export type ProductCategory =
  | "cake-bites"
  | "dot-cakes"
  | "sweet-treats"
  | "custom-cakes"
  | "party-platters";

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  tagline?: string;
  description: string;
  sizeText?: string;
  /** Price in cents. Omit for quote-only items. */
  priceCents?: number;
  /** When true, replaces Add-to-Cart with "Request a Quote" */
  quoteOnly?: boolean;
  flavors?: string[];
  options?: { name: string; values: string[] }[];
  images: string[];
  featured?: boolean;
};

/* ── Shared flavor list ── */
export const CAKE_FLAVORS = [
  "Chocolate",
  "Vanilla",
  "Yellow",
  "Funfetti",
  "Carrot",
  "Lemon",
  "White",
  "Raspberry",
  "Red Velvet",
  "Cookies & Cream",
  "Strawberry",
] as const;

export type CakeFlavor = (typeof CAKE_FLAVORS)[number];

export const CHOCOLATE_OPTIONS = ["Milk", "White"] as const;
export type ChocolateOption = (typeof CHOCOLATE_OPTIONS)[number];

/* ── Special-request message ── */
export const SPECIAL_REQUEST_MESSAGE =
  "Don't see your favorite? Have a flavor craving? Fork it over! We love special requests and are always happy to discuss custom flavors and specialty cakes.";

/* ── Catalog ── */
export const PRODUCTS: Product[] = [
  /* ---- Cake Bites ---- */
  {
    slug: "cake-bites",
    name: "Cake Bites",
    category: "cake-bites",
    tagline: "Cake + Frosting + Chocolate = The Perfect Forking Bite.",
    description:
      "Our signature treat. Rich cake blended with buttercream frosting and coated in your choice of milk or white chocolate. Every bite is a perfect, forkable moment of sweet indulgence.",
    sizeText: '~2 1/8" wide × 1" high',
    priceCents: undefined, // TODO: confirm
    flavors: [...CAKE_FLAVORS],
    options: [{ name: "Coating", values: ["Milk Chocolate", "White Chocolate"] }],
    images: ["/images/products/cake-bites.png"],
    featured: true,
  },
  /* ---- Dot Cakes ---- */
  {
    slug: "dot-cakes",
    name: "Dot Cakes",
    category: "dot-cakes",
    tagline: "One fork. Zero regrets.",
    description:
      "A fluffy layer of cake topped with a swirl of buttercream frosting and rainbow dot sprinkles, tucked into its own lidded container and served with a fork. Because sometimes life calls for cake on the go.",
    sizeText: '~3.3" wide × 1.5" high',
    priceCents: undefined, // TODO: confirm
    flavors: [...CAKE_FLAVORS],
    images: ["/images/products/dot-cakes.png"],
    featured: true,
  },
  /* ---- Sweet Treats ---- */
  {
    slug: "chocolate-covered-oreos",
    name: "Sweet Treats",
    category: "sweet-treats",
    tagline: "Because dressing up your chocolate is always a good idea.",
    description:
      "Our signature sweet treats are covered in premium milk or white chocolate and finished with colorful drizzles, sprinkles, and decorations. Customizable to match any event, theme, holiday, or special occasion.",
    priceCents: undefined, // TODO: confirm
    options: [{ name: "Chocolate", values: ["Milk Chocolate", "White Chocolate"] }],
    images: ["/images/products/sweet-treats.png"],
    featured: true,
  },
  /* ---- Custom Cakes ---- */
  {
    slug: "custom-cakes",
    name: "Custom Cakes",
    category: "custom-cakes",
    tagline: "Custom cakes made to match your celebration.",
    description:
      "Available in 4-inch and 6-inch sizes with your choice of cake flavor. Customize with colors, themes, buttercream designs, sprinkles, seasonal decorations, and special requests. Pricing varies based on design complexity.",
    quoteOnly: true,
    flavors: [...CAKE_FLAVORS],
    images: ["/images/products/custom-cakes.png"],
    featured: true,
  },
  /* ---- Party Platters ---- */
  {
    slug: "little-forkful",
    name: "The Little Forkful",
    category: "party-platters",
    tagline: "Small platter. Big sweet tooth.",
    description:
      "Serves 6–10. Includes 4 Cake Bites, 4 Dot Cakes, and 6 Sweet Treats. The perfect introduction to everything Frosted Fork.",
    priceCents: undefined, // TODO: confirm
    images: ["/images/products/party-platters.png"],
    featured: true,
  },
  {
    slug: "sweet-forking-deal",
    name: "The Sweet Forking Deal",
    category: "party-platters",
    tagline: "Enough treats to share. Whether you do is up to you.",
    description:
      "Serves 12–20. Includes 8 Cake Bites, 8 Dot Cakes, and 12 Sweet Treats.",
    priceCents: undefined, // TODO: confirm
    images: ["/images/products/party-platters.png"],
    featured: false,
  },
  {
    slug: "full-forking-spread",
    name: "The Full Forking Spread",
    category: "party-platters",
    tagline: "When 'just a few treats' gets completely out of hand.",
    description:
      "Serves 25–40. Includes 12 Cake Bites, 12 Dot Cakes, and 24 Sweet Treats. Go big or go home.",
    priceCents: undefined, // TODO: confirm
    images: ["/images/products/party-platters.png"],
    featured: false,
  },
];

/** Sweet Table builder items — the individual components used in the builder */
export const SWEET_TABLE_ITEMS = [
  { slug: "cake-bites-builder", name: "Cake Bites", priceCents: undefined /* TODO: confirm */ },
  { slug: "dot-cakes-builder", name: "Dot Cakes", priceCents: undefined /* TODO: confirm */ },
  { slug: "oreos-builder", name: "Sweet Treats", priceCents: undefined /* TODO: confirm */ },
];

/* ── Helpers ── */
export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}
