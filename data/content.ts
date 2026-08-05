/**
 * Frosted Fork — Verbatim website copy.
 * Owner-approved. Use exactly as written.
 */

export const HERO = {
  kicker: "Fresh Local Delivery in Wildwood, The Villages & Surrounding Communities",
  headline: "Life is short. Eat dessert first.",
} as const;

export const CATEGORY_TILES = [
  {
    name: "Cake Bites",
    slug: "cake-bites",
    blurb: "Rich cake blended with buttercream, dipped in chocolate. The signature bite.",
    image: "/images/products/cake-bites.png",
  },
  {
    name: "Dot Cakes",
    slug: "dot-cakes",
    blurb: "Fluffy cake + buttercream swirl + rainbow sprinkles. Cake on the go.",
    image: "/images/products/dot-cakes.png",
  },
  {
    name: "Sweet Treats",
    slug: "sweet-treats",
    blurb: "Handcrafted sweet treats, dressed to impress for every occasion.",
    image: "/images/products/sweet-treats.png",
  },
  {
    name: "Custom Cakes",
    slug: "custom-cakes",
    blurb: "4\" & 6\" custom creations for your milestone moments.",
    image: "/images/products/custom-cakes.png",
  },
  {
    name: "Party Platters",
    slug: "party-platters",
    blurb: "Because sharing is caring… sort of. Sweet tables for every crowd.",
    image: "/images/products/party-platters.png",
  },
] as const;

export const MORE_THAN_DESSERT = {
  headline: "More Than Dessert. It's a Forking Good Time.",
  body: `At Frosted Fork, we believe life's sweetest moments deserve more than ordinary desserts. Every Cake Bite, Dot Cake, sweet treat, custom cake, and party platter is handcrafted specifically for you through our made-to-order process.
We don't mass-produce desserts. We create them. Fresh. Small batch. Made just for you.`,
} as const;

export const BRAND_PHRASE_STRIP =
  "Serving Central Florida - Cake Bites - Dot Cakes - Sweet Treats - Party Platters - Custom Cakes" as const;

export const GIVING_BACK = {
  headline: "Giving Back Is Always on the Menu",
  body: `At Frosted Fork, we believe sweet treats should do more than make people smile—they should help make our community a little sweeter, too. That's why a percentage of our profits is donated throughout the year to charitable causes that strengthen our community.`,
  tagline: "One Cake Bite. One Dot Cake. One Sweet Treat at a Time.",
} as const;

export const MISSION_STATEMENT =
  "To create handcrafted desserts that bring people together, celebrate life's sweetest moments, and strengthen the communities we serve." as const;

export const ABOUT_STORY = {
  headline: "Our Story",
  paragraphs: [
    `Frosted Fork was created from a simple observation: some of life's happiest moments happen around dessert. The purpose of Frosted Fork is to create happiness through handcrafted desserts while strengthening the communities it serves.`,
    `The company exists because celebrations matter. Gatherings matter. Family traditions matter. Friendships matter. Community matters.`,
    `In today's fast-paced world, people often struggle to find opportunities to connect with one another. Dessert has a unique ability to bring people together. A platter of sweet treats can transform a club meeting. A custom cake can become the centerpiece of a milestone celebration. A box of Cake Bites can brighten someone's day. These moments may seem small, but they have lasting impact. Frosted Fork exists to create those moments.`,
    `The company also exists to prove that business can be a force for good. A percentage of profits is donated throughout the year to charitable causes that strengthen the community. This commitment reflects the belief that success should be shared.`,
  ],
} as const;

export const WHY_DIFFERENT = {
  headline: "Why Frosted Fork Is Different",
  intro: `Many bakeries sell desserts. Frosted Fork sells experiences. The difference begins with our philosophy. We don't believe dessert should be an afterthought. We believe dessert should be part of the celebration. Every decision within the Frosted Fork brand reflects this belief.`,
  points: [
    {
      title: "We Bake to Order",
      description:
        "Nothing sits around waiting to be purchased. Every order is created specifically for the customer.",
    },
    {
      title: "Sweet Treats for Every Season",
      description:
        "Our desserts can be customized for holidays, milestones, awareness events, community gatherings, and special celebrations. If there's a reason to celebrate, there's a reason for frosting.",
    },
  ],
  closing: '"Life is short. Eat dessert first."',
} as const;

export const CUSTOM_ORDERS = {
  headline: "Build Your Custom Order",
  intro:
    "One of Frosted Fork's competitive advantages is flexibility. Don't see your favorite? Fork it over! We're always happy to discuss special flavors and custom creations.",
  formIntro:
    "Share your event details, flavor preferences, colors, and any special requests. We'll get back to you with design ideas and a quote.",
  events: [
    "Birthday Party",
    "Wedding",
    "Baby Shower",
    "Bridal Shower",
    "Corporate Event",
    "Holiday Gathering",
    "Fundraiser",
    "Other",
  ],
  sizes: ['4" Cake', '6" Cake', "Both / Not Sure"],
} as const;

export const FAQ = [
  {
    q: "How far in advance should I order?",
    a: "We recommend at least 48–72 hours for standard Cake Bites and Sweet Treats orders. Custom cakes and large party platters need at least 2 weeks. If you need something sooner, reach out — we'll do our best to accommodate!",
  },
  {
    q: "Do you deliver?",
    a: "Currently, all orders are available for pickup in Wildwood, FL. We're happy to discuss local delivery options for larger events — just mention it in your order notes.",
  },
  {
    q: "How does the custom order process work?",
    a: "Reach out via the Custom Orders page, Instagram DM, or email with your event type, date, flavor preferences, theme/colors, and any inspiration. We'll confirm availability, discuss design options, and provide a quote — usually within 24 hours.",
  },
  {
    q: "What about allergens?",
    a: "All Frosted Fork treats are made in a kitchen that handles common allergens including wheat, dairy, eggs, soy, and nuts. We cannot guarantee allergen-free products. If you have specific concerns, please contact us before placing your order.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards securely through our online checkout. For custom orders, we'll send a payment link once your design is confirmed.",
  },
  {
    q: "Can I customize colors and themes?",
    a: "Absolutely! That's what we do best. Whether it's coordinating with school colors, a wedding palette, an awareness ribbon, or a party theme — we can match your vision with custom sprinkles, drizzles, and decorations.",
  },
  {
    q: "Do you make seasonal or holiday treats?",
    a: "Yes! We love creating special treats for every season and holiday — from Valentine's Day and Easter to Halloween, Christmas, and everything in between. Follow us on Instagram @frostedforksweets for seasonal drops.",
  },
] as const;
