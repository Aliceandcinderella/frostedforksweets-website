export function NeonStrip({
  text,
  color = "pink",
}: {
  text: string;
  color?: "pink" | "cyan";
}) {
  return (
    <section className="neon-strip py-8 px-6 text-center" aria-label={text}>
      <p
        className={`font-script text-2xl sm:text-3xl md:text-4xl ${
          color === "cyan" ? "neon-text-cyan" : "neon-text"
        }`}
      >
        {text}
      </p>
    </section>
  );
}
