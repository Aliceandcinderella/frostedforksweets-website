import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { CakeIcon, HeartIcon, SparkleIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Meet the Baker",
  description:
    "Meet Colleen Jolicoeur, the owner and baker behind Frosted Fork Sweet Treats in Central Florida.",
};

const reasons = [
  {
    Icon: CakeIcon,
    title: "Handcrafted with Care",
    body: "Every dessert is made to order using quality ingredients, careful attention to detail, and a passion for creating something truly special.",
  },
  {
    Icon: SparkleIcon,
    title: "Made for Every Celebration",
    body: "Whether you're celebrating a birthday, wedding, baby shower, anniversary, holiday, or simply treating yourself, every order is designed to make your occasion a little sweeter.",
  },
  {
    Icon: HeartIcon,
    title: "Baked with Passion",
    body: "I'm constantly learning, growing, and exploring new decorating techniques and recipes so I can continue creating desserts that are as beautiful as they are delicious.",
  },
];

export default function MeetTheBakerPage() {
  return (
    <>
      <section className="pt-28 pb-10 px-6 bg-ink text-center">
        <SectionHeading
          eyebrow="Meet the Baker"
          title="Baking Memories One Sweet Treat at a Time"
          subtitle="A little more about the hands and heart behind Frosted Fork Sweet Treats."
          center
          light
        />
      </section>

      <section className="py-14 px-6">
        <div className="max-w-4xl mx-auto glow-card rounded-2xl p-6 sm:p-10">
          <div className="mb-8 overflow-hidden rounded-2xl border border-neon-pink/20 bg-ink">
            <img
              src="/meet-the-baker/ME.png"
              alt="Colleen Jolicoeur, baker and owner of Frosted Fork Sweet Treats"
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="space-y-5 text-body/80 text-base sm:text-lg leading-relaxed">
            <p>
              Hi, I&apos;m Colleen Jolicoeur, the owner and baker behind Frosted Fork Sweet Treats.
            </p>
            <p>
              Baking has always been more than creating desserts—it&apos;s my way of bringing people together and helping create memories that last long after the last bite. Whether I&apos;m decorating a custom cake, dipping chocolate-covered treats, or adding the finishing touches to a batch of cake bites, I put the same care and attention into every order.
            </p>
            <p>
              I believe every celebration deserves something special. From birthdays and baby showers to weddings, anniversaries, and holidays, my goal is to create desserts that are every bit as beautiful as they are delicious.
            </p>
            <p>
              As a lifelong learner, I&apos;m always refining my skills, exploring new techniques, and finding fresh inspiration to bring to my customers. Every order is handcrafted, made to order, and prepared with quality ingredients and attention to every detail.
            </p>
            <p>
              Thank you for visiting Frosted Fork Sweet Treats. I&apos;m honored to be a small part of your celebrations, and I look forward to creating something sweet for your next special occasion.
            </p>
            <p className="font-script text-2xl text-neon-pink">— Colleen</p>
          </div>
        </div>
      </section>

      <section className="py-14 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <SectionHeading title="Why Customers Love Frosted Fork" center />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {reasons.map(({ Icon, ...reason }) => (
              <article key={reason.title} className="glow-card rounded-2xl p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-electric-cyan/30 bg-electric-cyan/10 text-electric-cyan">
                  <Icon className="h-7 w-7" />
                </div>
                <h2 className="font-display font-bold text-xl mb-3 text-body">
                  {reason.title}
                </h2>
                <p className="text-sm text-muted leading-relaxed">{reason.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
