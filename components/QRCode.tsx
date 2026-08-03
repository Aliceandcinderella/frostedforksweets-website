"use client";

import { useEffect, useState } from "react";

export function QRCode({ url, size = 120 }: { url: string; size?: number }) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    import("qrcode").then((QRCodeLib) => {
      if (cancelled) return;
      QRCodeLib.toDataURL(
        url,
        {
          width: size * 2,
          margin: 1,
          color: { dark: "#FFFFFF", light: "#0A0A0F" },
        },
        (err, dataUrl) => {
          if (!cancelled && !err) setDataUrl(dataUrl);
        }
      );
    });
    return () => { cancelled = true; };
  }, [url, size]);

  if (!dataUrl) {
    return (
      <div
        className="bg-white/10 rounded"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <img
      src={dataUrl}
      alt={`QR code for ${url}`}
      width={size}
      height={size}
      className="rounded"
    />
  );
}
