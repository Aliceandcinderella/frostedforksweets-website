export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={`mb-8 ${center ? "text-center" : ""}`}>
      {eyebrow && (
        <p
          className={`text-xs font-semibold uppercase tracking-[0.25em] mb-3 flex items-center gap-3 ${
            center ? "justify-center" : ""
          } ${light ? "text-glow-yellow" : "text-neon-pink"}`}
        >
          <span
            className={`w-6 h-px ${light ? "bg-glow-yellow" : "bg-neon-pink"}`}
          />
          {eyebrow}
          {!center && (
            <span
              className={`w-6 h-px ${light ? "bg-glow-yellow" : "bg-neon-pink"}`}
            />
          )}
        </p>
      )}
      <h2
        className={`font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight ${
          light ? "text-white" : "text-body"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-base max-w-lg ${
            center ? "mx-auto" : ""
          } ${light ? "text-white/60" : "text-muted"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
