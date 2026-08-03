import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.8a2 2 0 0 1-.45 2.11L8.05 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.31 1.84.53 2.8.66A2 2 0 0 1 22 16.92Z" />
    </BaseIcon>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </BaseIcon>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </BaseIcon>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="17" cy="7" r=".8" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

export function CakeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 11h16v8H4z" />
      <path d="M4 15c2 1.2 4 1.2 6 0s4-1.2 6 0 3 .9 4 .2" />
      <path d="M8 11V8m4 3V8m4 3V8" />
    </BaseIcon>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </BaseIcon>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1Z" />
    </BaseIcon>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M3 4h2l2.2 10.4a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L20 8H6" />
    </BaseIcon>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M15 8h2.2V4.4c-.4-.1-1.7-.2-3.2-.2-3.2 0-5.4 2-5.4 5.6V13H5v4h3.6v7h4.4v-7h3.5l.6-4H13V10.2c0-1.2.3-2.2 2-2.2Z" />
    </BaseIcon>
  );
}
