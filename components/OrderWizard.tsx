"use client";

import { useState, useMemo } from "react";
import { CAKE_FLAVORS } from "@/data/products";
import { SectionHeading } from "@/components/SectionHeading";
import { NeonStrip } from "@/components/NeonStrip";
import { CakeIcon, CartIcon, SparkleIcon } from "@/components/Icons";

/* ── Types ── */
type FormFactor = "bite" | "bowl" | "bigdeal" | null;
type Coating = "White Chocolate" | "Milk Chocolate" | null;
type SweetItem = "oreos";
type Platter = "little-forkful" | "sweet-forking-deal" | "full-forking-spread" | null;

interface OrderState {
  /* Step 1 */
  flavors: string[];
  /* Step 2 */
  formFactors: FormFactor[];
  coating: Coating;
  customCakeSize: string;
  /* Step 3 */
  sweetItems: SweetItem[];
  sweetCoating: Coating;
  sweetCustomization: string;
  /* Step 4 */
  platter: Platter;
  buildOwnTable: boolean;
  /* Step 5 */
  name: string;
  contact: string;
  eventDate: string;
  occasion: string;
  occasionOther: string;
  community: string;
  communityOther: string;
}

const INITIAL: OrderState = {
  flavors: [],
  formFactors: [],
  coating: null,
  customCakeSize: "",
  sweetItems: [],
  sweetCoating: null,
  sweetCustomization: "",
  platter: null,
  buildOwnTable: false,
  name: "",
  contact: "",
  eventDate: "",
  occasion: "",
  occasionOther: "",
  community: "",
  communityOther: "",
};

const FLAVOR_ICONS: Record<string, string> = {
  Chocolate: "CH",
  Vanilla: "VA",
  Yellow: "YE",
  Funfetti: "FN",
  Carrot: "CA",
  Lemon: "LE",
  White: "WH",
  Raspberry: "RA",
  "Red Velvet": "RV",
  "Cookies & Cream": "CC",
  Strawberry: "ST",
};

const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Golf Group",
  "Club Gathering",
  "Holiday",
  "Other",
];

const COMMUNITIES = ["The Villages", "Surrounding Communities"];

const STEPS = [
  { num: 1, label: "Fork Your Flavor" },
  { num: 2, label: "How Do You Cake?" },
  { num: 3, label: "Sweet Treats" },
  { num: 4, label: "Party Platters" },
  { num: 5, label: "Put a Fork In It!" },
];

/* ── Component ── */
export function OrderWizard() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<OrderState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = <K extends keyof OrderState>(key: K, value: OrderState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const toggleArray = <K extends keyof OrderState>(
    key: K,
    item: string
  ) => {
    setState((s) => {
      const arr = s[key] as string[];
      return { ...s, [key]: arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item] };
    });
  };

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  /* ── Order summary for Step 5 ── */
  const summary = useMemo(() => {
    const lines: string[] = [];
    if (state.flavors.length) lines.push(`Flavors: ${state.flavors.join(", ")}`);
    if (state.formFactors.length) {
      const names = state.formFactors.map((f) => {
        if (f === "bite") return `Cake Bites${state.coating ? ` (${state.coating})` : ""}`;
        if (f === "bowl") return "Dot Cakes";
        if (f === "bigdeal") return `Custom Cake${state.customCakeSize ? ` (${state.customCakeSize})` : ""}`;
        return f;
      });
      lines.push(`Style: ${names.join(", ")}`);
    }
    if (state.sweetItems.length) {
      const names = state.sweetItems.map(() => "Sweet Treats");
      lines.push(`Treats: ${names.join(", ")}${state.sweetCoating ? ` (${state.sweetCoating})` : ""}`);
    }
    if (state.sweetCustomization) lines.push(`Custom: ${state.sweetCustomization}`);
    if (state.platter) {
      const names: Record<string, string> = {
        "little-forkful": "The Little Forkful (Serves 6–10)",
        "sweet-forking-deal": "The Sweet Forking Deal (Serves 12–20)",
        "full-forking-spread": "The Full Forking Spread (Serves 25–40)",
      };
      lines.push(`Platter: ${names[state.platter]}`);
    }
    if (state.buildOwnTable) lines.push("Build Your Own Sweet Table");
    return lines;
  }, [state]);

  const handleSubmit = async () => {
    if (!state.name || !state.contact) {
      setError("Please fill in your name and email/phone.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: state.name,
            email: state.contact.includes("@") ? state.contact : "",
            phone: state.contact,
          },
          items: [
            {
              name: "Custom Order - Frosted Fork Wizard",
              description: summary.join("\n"),
              amountCents: 0,
              quantity: 1,
            },
          ],
          pickupOrDelivery: "pickup",
          requestedDate: state.eventDate,
          notes: [
            `Occasion: ${state.occasion === "Other" ? state.occasionOther : state.occasion}`,
            `Community: ${state.community === "Surrounding Communities" ? state.communityOther : state.community}`,
          ].join("\n"),
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

  /* ── Success ── */
  if (submitted) {
    return (
      <section className="pt-28 pb-16 px-6 max-w-2xl mx-auto text-center">
        <SparkleIcon className="mx-auto mb-6 h-16 w-16 text-neon-pink" />
        <SectionHeading
          title="You're Officially Forking!"
          subtitle="We've received your order! We'll review your custom requests and follow up with a finalized quote and confirmation. Keep an eye on your inbox!"
          center
        />
        <p className="text-sm text-muted mt-4">Follow us on Instagram @frostedforksweets for behind-the-scenes sweetness!</p>
      </section>
    );
  }

  return (
    <>
      {/* Step indicator */}
      <section className="pt-28 pb-4 px-6 bg-ink">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((s, i) => (
              <div key={s.num} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      step >= s.num
                        ? "bg-neon-pink text-white"
                        : "bg-white/10 text-white/30"
                    }`}
                  >
                    {step > s.num ? "✓" : s.num}
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-semibold uppercase tracking-wider hidden sm:block ${
                      step >= s.num ? "text-neon-pink" : "text-white/20"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-2 ${
                      step > s.num ? "bg-neon-pink" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-white/50 text-xs mt-2 sm:hidden">
            Step {step}: {STEPS[step - 1].label}
          </p>
        </div>
      </section>

      {/* ── Step 1: Fork Your Flavor ── */}
      {step === 1 && (
        <section className="py-10 px-6 max-w-3xl mx-auto">
          <SectionHeading
            eyebrow={`Step 1 of 5`}
            title="Fork Your Flavor"
            subtitle="Choose your favorite base and we'll do the frosting magic. Have a custom craving? Fork it over!"
            center
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-6">
            {CAKE_FLAVORS.map((flavor) => {
              const selected = state.flavors.includes(flavor);
              return (
                <button
                  key={flavor}
                  onClick={() => toggleArray("flavors", flavor)}
                  className={`relative rounded-xl p-4 text-center font-semibold text-sm transition-all duration-200 ${
                    selected
                      ? "ring-2 ring-neon-pink ring-offset-2 scale-[1.03] shadow-lg bg-ink text-white"
                      : "bg-card border hover:border-neon-pink hover:scale-[1.02]"
                  }`}
                >
                  <span className="text-2xl block mb-1">
                    {FLAVOR_ICONS[flavor] ?? ""}
                  </span>
                  {flavor}
                  {selected && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-neon-pink text-white text-[10px] rounded-full flex items-center justify-center">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-page border text-sm text-center">
            <p>
              <strong>Don&apos;t See Your Favorite?</strong>
            </p>
            <p className="text-muted mt-1">
              Have a flavor craving? Fork it over! We love special requests and
              are always happy to discuss custom flavors and specialty cakes.
            </p>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={next}
              disabled={state.flavors.length === 0}
              className="px-8 py-3 rounded-full bg-neon-pink text-white font-bold text-sm hover:bg-neon-pink/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next: How Do You Cake? →
            </button>
          </div>
        </section>
      )}

      {/* ── Step 2: How Do You Cake? ── */}
      {step === 2 && (
        <section className="py-10 px-6 max-w-3xl mx-auto">
          <SectionHeading
            eyebrow={`Step 2 of 5`}
            title="How Do You Cake?"
            subtitle="Bite, bowl, or big deal? Let's pick your style."
            center
          />

          <div className="space-y-4 mt-6">
            {/* The Bite */}
            <button
              onClick={() =>
                toggleArray("formFactors", "bite")
              }
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${
                state.formFactors.includes("bite")
                  ? "border-neon-pink bg-neon-pink/5 shadow-lg"
                  : "border-muted/20 bg-card hover:border-neon-pink/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <CakeIcon className="h-8 w-8 shrink-0 text-neon-pink" />
                <div className="flex-1">
                  <h3 className="font-display font-bold text-lg">
                    The Bite: Frosted Fork Cake Bites
                  </h3>
                  <p className="text-sm text-muted mt-1">
                    Our signature treat! We take delicious cake, mix it with
                    fluffy buttercream, and roll it into a bite-sized bundle of
                    happiness.
                  </p>
                  {state.formFactors.includes("bite") && (
                    <div className="mt-4 p-4 rounded-xl bg-white/50 border">
                      <p className="text-sm font-semibold mb-3">
                        Your Chocolate Coating Option (Pick One):
                      </p>
                      <div className="flex gap-3">
                        {(["White Chocolate", "Milk Chocolate"] as const).map(
                          (c) => (
                            <button
                              key={c}
                              onClick={(e) => {
                                e.stopPropagation();
                                update("coating", state.coating === c ? null : c);
                              }}
                              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex-1 ${
                                state.coating === c
                                  ? "bg-ink text-white ring-2 ring-neon-pink"
                                  : "bg-page border hover:border-neon-pink"
                              }`}
                            >
                              {c}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {state.formFactors.includes("bite") && (
                  <span className="text-neon-pink text-xl">✓</span>
                )}
              </div>
            </button>

            {/* The Bowl */}
            <button
              onClick={() => toggleArray("formFactors", "bowl")}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${
                state.formFactors.includes("bowl")
                  ? "border-neon-pink bg-neon-pink/5 shadow-lg"
                  : "border-muted/20 bg-card hover:border-neon-pink/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <CakeIcon className="h-8 w-8 shrink-0 text-neon-pink" />
                <div className="flex-1">
                  <h3 className="font-display font-bold text-lg">
                    The Bowl: Dot Cakes
                  </h3>
                  <p className="text-sm text-muted mt-1">
                    A fluffy layer of cake topped with a swirl of buttercream and
                    rainbow dot sprinkles. Tucked into its own lidded container
                    with a fork included.
                  </p>
                </div>
                {state.formFactors.includes("bowl") && (
                  <span className="text-neon-pink text-xl">✓</span>
                )}
              </div>
            </button>

            {/* The Big Deal */}
            <button
              onClick={() => toggleArray("formFactors", "bigdeal")}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${
                state.formFactors.includes("bigdeal")
                  ? "border-neon-pink bg-neon-pink/5 shadow-lg"
                  : "border-muted/20 bg-card hover:border-neon-pink/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <CakeIcon className="h-8 w-8 shrink-0 text-neon-pink" />
                <div className="flex-1">
                  <h3 className="font-display font-bold text-lg">
                    The Big Deal: Custom Cakes
                  </h3>
                  <p className="text-sm text-muted mt-1">
                    Available in 4-inch and 6-inch sizes. Share your celebration details,
                    and we&apos;ll bring the frosting, custom colors, and theme
                    designs to life.
                  </p>
                  {state.formFactors.includes("bigdeal") && (
                    <div className="mt-4 p-4 rounded-xl bg-white/50 border">
                      <p className="text-sm font-semibold mb-3">Pick a size:</p>
                      <div className="flex gap-3">
                        {['4" Cake', '6" Cake', "Not Sure"].map((size) => (
                          <button
                            key={size}
                            onClick={(e) => {
                              e.stopPropagation();
                              update(
                                "customCakeSize",
                                state.customCakeSize === size ? "" : size
                              );
                            }}
                            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex-1 ${
                              state.customCakeSize === size
                                ? "bg-ink text-white ring-2 ring-neon-pink"
                                : "bg-page border hover:border-neon-pink"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {state.formFactors.includes("bigdeal") && (
                  <span className="text-neon-pink text-xl">✓</span>
                )}
              </div>
            </button>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={prev}
              className="px-6 py-3 rounded-full border text-sm font-semibold hover:border-neon-pink transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={next}
              disabled={state.formFactors.length === 0}
              className="px-8 py-3 rounded-full bg-neon-pink text-white font-bold text-sm hover:bg-neon-pink/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next: Sweet Treats →
            </button>
          </div>
        </section>
      )}

      {/* ── Step 3: Sweet Treats ── */}
      {step === 3 && (
        <section className="py-10 px-6 max-w-3xl mx-auto">
          <SectionHeading
            eyebrow={`Step 3 of 5`}
            title="Time to Accessorize! Sweet Treats"
            subtitle="Drizzles, sprinkles, and custom colors—let's match your party vibe!"
            center
          />

          {/* Sub-Step A: Choose Treats */}
          <div className="mt-6 space-y-3">
            <h3 className="font-display font-bold text-lg">
              Sub-Step A: Choose Your Treats
            </h3>
            <p className="text-sm text-muted">Select all that apply:</p>
            {[
              { key: "oreos" as const, label: "Sweet Treats", icon: "ST" },
            ].map((item) => {
              const selected = state.sweetItems.includes(item.key);
              return (
                <button
                  key={item.key}
                  onClick={() => toggleArray("sweetItems", item.key)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    selected
                      ? "border-neon-pink bg-neon-pink/5"
                      : "border-muted/20 bg-card hover:border-neon-pink/50"
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-semibold text-sm flex-1">{item.label}</span>
                  <span
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs ${
                      selected
                        ? "bg-neon-pink border-neon-pink text-white"
                        : "border-muted"
                    }`}
                  >
                    {selected ? "✓" : ""}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sub-Step B: Coating */}
          {state.sweetItems.length > 0 && (
            <div className="mt-6">
              <h3 className="font-display font-bold text-lg">
                Sub-Step B: Pick Your Chocolate Coating
              </h3>
              <div className="flex gap-3 mt-3">
                {(["White Chocolate", "Milk Chocolate"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() =>
                      update("sweetCoating", state.sweetCoating === c ? null : c)
                    }
                    className={`px-6 py-4 rounded-xl text-sm font-semibold transition-all flex-1 ${
                      state.sweetCoating === c
                        ? "bg-ink text-white ring-2 ring-neon-pink"
                        : "bg-card border hover:border-neon-pink"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sub-Step C: Customization */}
          <div className="mt-6">
            <h3 className="font-display font-bold text-lg">
              Sub-Step C: Customize the Look
            </h3>
            <p className="text-xs text-muted mb-2">Optional</p>
            <textarea
              value={state.sweetCustomization}
              onChange={(e) => update("sweetCustomization", e.target.value)}
              rows={3}
              placeholder="Tell us your event theme, holiday, or club colors! We can add custom sprinkles, colored drizzles, and decorations to coordinate perfectly."
              className="w-full rounded-xl border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
            />
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={prev}
              className="px-6 py-3 rounded-full border text-sm font-semibold hover:border-neon-pink transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={next}
              className="px-8 py-3 rounded-full bg-neon-pink text-white font-bold text-sm hover:bg-neon-pink/90 transition-colors"
            >
              Next: Party Platters →
            </button>
          </div>
        </section>
      )}

      {/* ── Step 4: Party Platters ── */}
      {step === 4 && (
        <section className="py-10 px-6 max-w-3xl mx-auto">
          <SectionHeading
            eyebrow={`Step 4 of 5`}
            title="Time to Share (Or Not)"
            subtitle="Pick a pre-bundled party platter or design your own custom sweet table layout."
            center
          />

          {/* Option A: Pre-Bundled */}
          <div className="mt-6">
            <h3 className="font-display font-bold text-lg mb-3">
              Option A: Choose a Pre-Bundled Platter
            </h3>
            <div className="space-y-3">
              {[
                {
                  key: "little-forkful" as const,
                  name: "The Little Forkful",
                  desc: "Small platter. Big sweet tooth.",
                  detail: "Includes 4 Cake Bites, 4 Dot Cakes, and 6 Sweet Treats.",
                  serves: "Serves 6–10",
                },
                {
                  key: "sweet-forking-deal" as const,
                  name: "The Sweet Forking Deal",
                  desc: "Enough treats to share. Whether you do is up to you.",
                  detail: "Includes 8 Cake Bites, 8 Dot Cakes, and 12 Sweet Treats.",
                  serves: "Serves 12–20",
                },
                {
                  key: "full-forking-spread" as const,
                  name: "The Full Forking Spread",
                  desc: 'When "just a few treats" gets completely out of hand.',
                  detail: "Includes 12 Cake Bites, 12 Dot Cakes, and 24 Sweet Treats.",
                  serves: "Serves 25–40",
                },
              ].map((p) => (
                <button
                  key={p.key}
                  onClick={() =>
                    update("platter", state.platter === p.key ? null : p.key)
                  }
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                    state.platter === p.key
                      ? "border-neon-pink bg-neon-pink/5 shadow-lg"
                      : "border-muted/20 bg-card hover:border-neon-pink/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-display font-bold">{p.name}</h4>
                      <p className="text-xs text-neon-pink font-medium mt-0.5">
                        {p.serves}
                      </p>
                      <p className="text-sm text-muted mt-1">{p.detail}</p>
                    </div>
                    <span
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        state.platter === p.key
                          ? "bg-neon-pink border-neon-pink text-white"
                          : "border-muted"
                      }`}
                    >
                      {state.platter === p.key ? "✓" : ""}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Option B: Build Your Own */}
          <div className="mt-6">
            <h3 className="font-display font-bold text-lg mb-3">
              Option B: Build Your Own Sweet Table
            </h3>
            <button
              onClick={() => update("buildOwnTable", !state.buildOwnTable)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                state.buildOwnTable
                  ? "border-neon-pink bg-neon-pink/5 shadow-lg"
                  : "border-muted/20 bg-card hover:border-neon-pink/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center text-xs shrink-0 ${
                    state.buildOwnTable
                      ? "bg-neon-pink border-neon-pink text-white"
                      : "border-muted"
                  }`}
                >
                  {state.buildOwnTable ? "✓" : ""}
                </span>
                <div>
                  <span className="font-semibold text-sm">
                    I want to customize my own dessert table spread!
                  </span>
                  <p className="text-xs text-muted mt-1">
                    You bring the party, we&apos;ll bring the frosting. We will
                    design a custom layout featuring your favorite combination
                    of treats.
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={prev}
              className="px-6 py-3 rounded-full border text-sm font-semibold hover:border-neon-pink transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={next}
              className="px-8 py-3 rounded-full bg-neon-pink text-white font-bold text-sm hover:bg-neon-pink/90 transition-colors"
            >
              Next: Put a Fork In It! →
            </button>
          </div>
        </section>
      )}

      {/* ── Step 5: Put a Fork In It! ── */}
      {step === 5 && (
        <section className="py-10 px-6 max-w-2xl mx-auto">
          <SectionHeading
            eyebrow={`Step 5 of 5`}
            title="Put a Fork In It!"
            subtitle="Ready to get forking? Let's make your next event a little sweeter. Fill out the quick details below to lock in your sweet treats!"
            center
          />

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Order Summary */}
          <div className="mb-8 p-6 rounded-2xl bg-card border">
            <h3 className="font-display font-bold text-lg mb-3">
              Final Order Review
            </h3>
            <div className="space-y-2">
              {summary.length > 0 ? (
                summary.map((line, i) => (
                  <p key={i} className="text-sm">{line}</p>
                ))
              ) : (
                <p className="text-sm text-muted italic">
                  Nothing selected yet. Go back and pick your treats!
                </p>
              )}
            </div>
          </div>

          {/* Contact form */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg">
              Delivery & Event Details
            </h3>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Name <span className="text-neon-pink">*</span>
              </label>
              <input
                type="text"
                value={state.name}
                onChange={(e) => update("name", e.target.value)}
                required
                className="w-full rounded-xl border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Email / Phone <span className="text-neon-pink">*</span>
              </label>
              <input
                type="text"
                value={state.contact}
                onChange={(e) => update("contact", e.target.value)}
                required
                className="w-full rounded-xl border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
                placeholder="you@email.com or (352) 555-0000"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Event Date
                </label>
                <input
                  type="date"
                  value={state.eventDate}
                  onChange={(e) => update("eventDate", e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Occasion
                </label>
                <select
                  value={state.occasion}
                  onChange={(e) => update("occasion", e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
                >
                  <option value="">Select occasion</option>
                  {OCCASIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>

            {state.occasion === "Other" && (
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Please describe
                </label>
                <input
                  type="text"
                  value={state.occasionOther}
                  onChange={(e) => update("occasionOther", e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
                  placeholder="Tell us about your event..."
                />
              </div>
            )}

            {/* Local Delivery */}
            <div>
              <h3 className="font-display font-bold text-lg mt-4 mb-3">
                Local Delivery Verification
              </h3>
              <p className="text-sm text-muted mb-3">Select your community:</p>
              <div className="space-y-2">
                {COMMUNITIES.map((c) => (
                  <button
                    key={c}
                    onClick={() =>
                      update("community", state.community === c ? "" : c)
                    }
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      state.community === c
                        ? "border-neon-pink bg-neon-pink/5"
                        : "border-muted/20 bg-card hover:border-neon-pink/50"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs ${
                        state.community === c
                          ? "bg-neon-pink border-neon-pink text-white"
                          : "border-muted"
                      }`}
                    >
                      {state.community === c ? "✓" : ""}
                    </span>
                    <span className="text-sm font-semibold">{c}</span>
                  </button>
                ))}
              </div>
              {state.community === "Surrounding Communities" && (
                <input
                  type="text"
                  value={state.communityOther}
                  onChange={(e) => update("communityOther", e.target.value)}
                  className="w-full mt-2 rounded-xl border px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-neon-pink"
                  placeholder="Enter your community / town name"
                />
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-12 py-5 rounded-full bg-neon-pink text-white font-bold text-lg shadow-[0_0_20px_rgba(255,46,166,0.4)] hover:shadow-[0_0_30px_rgba(255,46,166,0.6)] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Sending..." : "CLICK HERE TO GET STARTED"}
            </button>
            <p className="text-xs text-muted mt-4 max-w-md mx-auto">
              Once you submit, we&apos;ll do the frosting magic, review any
              custom requests, and follow up with a finalized quote and
              confirmation!
            </p>
          </div>

          <div className="flex justify-start mt-6">
            <button
              onClick={prev}
              className="px-6 py-3 rounded-full border text-sm font-semibold hover:border-neon-pink transition-colors"
            >
              ← Back
            </button>
          </div>
        </section>
      )}

      <NeonStrip text="Cake + Frosting + Chocolate = The Perfect Forking Bite." />
    </>
  );
}
