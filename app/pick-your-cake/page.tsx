import type { Metadata } from "next";
import { OrderWizard } from "@/components/OrderWizard";

export const metadata: Metadata = {
  title: "Pick Your Cake",
  description:
    "Fork your flavor, pick your style, accessorize with sweet treats, and build your perfect dessert spread. The full Frosted Fork ordering experience.",
};

export default function PickYourCakePage() {
  return <OrderWizard />;
}
