const TICKER_TEXT =
  "- Serving Central Florida - Cake Bites - Dot Cakes - Sweet Treats - Party Platters - Custom Cakes";

export function TextTicker() {
  return (
    <section
      className="ticker-shell bg-[#050507] border-y border-electric-cyan/20 overflow-hidden py-3 sm:py-4"
      aria-label={TICKER_TEXT}
    >
      <div className="ticker-track flex w-max whitespace-nowrap">
        {[0, 1].map((group) => (
          <div key={group} className="ticker-group flex shrink-0 items-center">
            {[0, 1, 2, 3].map((item) => (
              <span
                key={`${group}-${item}`}
                className="ticker-text font-script text-2xl sm:text-3xl md:text-4xl px-1 sm:px-2"
              >
                {TICKER_TEXT}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
