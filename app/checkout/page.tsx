import { Suspense } from "react";
import { CheckoutForm } from "@/components/CheckoutForm";
import { SectionHeading } from "@/components/SectionHeading";

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <section className="pt-28 pb-16 px-6 max-w-2xl mx-auto">
          <SectionHeading title="Checkout" center />
          <p className="text-center text-muted">Loading checkout...</p>
        </section>
      }
    >
      <CheckoutForm />
    </Suspense>
  );
}
