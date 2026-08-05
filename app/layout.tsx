import type { Metadata } from "next";
import { Poppins, Plus_Jakarta_Sans, Pacifico } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider } from "@/components/CartProvider";

const display = Poppins({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const script = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.frostedforksweets.com"),
  alternates: {
    canonical: "/",
  },
   title: {
    default: "Frosted Fork Sweets | Custom Cakes & Sweet Treats in Wildwood, FL",
    template: "%s | Frosted Fork Sweets",
  },
  description:
  "Small cakes, custom cakes, cake bites, Dot Cakes, chocolate-covered treats, party platters, and handcrafted desserts made fresh to order in Wildwood, Florida with local delivery near The Villages.",
  keywords:
    "cake bites, dot cakes, sweet treats, custom cakes, party platters, Wildwood Florida, chocolate-covered oreos, handcrafted desserts, made to order",
  openGraph: {
    title: "Frosted Fork | Small Cakes & Sweet Treats",
    description:
      "Handcrafted desserts made fresh to order in Wildwood, Florida. Cake Bites, Dot Cakes, sweet treats, custom cakes, and party platters.",
    url: "https://www.frostedforksweets.com",
    siteName: "Frosted Fork Sweets",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${script.variable}`}
    >
      <body className="font-body bg-page text-body antialiased">
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
