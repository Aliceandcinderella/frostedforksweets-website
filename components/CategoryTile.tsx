"use client";

import Link from "next/link";

export function CategoryTile({
  name,
  slug,
  image,
}: {
  name: string;
  slug: string;
  image: string;
}) {
  return (
    <Link
      href={`/collections/${slug}`}
      className="glow-card rounded-card overflow-hidden group fork-cursor flex flex-col min-h-[440px]"
    >
      <div className="flex-1 min-h-[360px] product-placeholder rounded-t-card p-2 sm:p-3">
        <img
          src={image}
          alt={name}
          className="w-full h-full max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-[1.03] drop-shadow-xl"
          loading="lazy"
          onError={(e) => {
            const el = e.target as HTMLImageElement;
            el.style.display = "none";
            el.parentElement!.textContent = name;
          }}
        />
      </div>
      <div className="p-6 text-center">
        <h3 className="font-display font-bold text-xl text-body leading-tight">
          {name}
        </h3>
      </div>
    </Link>
  );
}
