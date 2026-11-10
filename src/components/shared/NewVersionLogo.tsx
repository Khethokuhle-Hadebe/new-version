interface NewVersionLogoProps {
  size?: number;
  className?: string;
  variant?: "plum" | "plain" | "lavender";
}

export default function NewVersionLogo({
  size = 38,
  className = "",
  variant = "plum",
}: NewVersionLogoProps) {
  const shell =
    variant === "plum"
      ? "bg-plum text-lavender"
      : variant === "plain"
        ? "bg-transparent text-plum"
        : "bg-lavender text-plum";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[14px] ${shell} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={size * 0.62}
        height={size * 0.62}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M3.5 8.4c1.9 0 1.9-1.9 3.8-1.9s1.9 1.9 3.8 1.9 1.9-1.9 3.8-1.9 1.9 1.9 3.8 1.9"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          opacity="0.95"
        />
        <path
          d="M3.5 13.2c1.9 0 1.9-2.6 3.8-2.6s1.9 2.6 3.8 2.6 1.9-2.6 3.8-2.6 1.9 2.6 3.8 2.6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          opacity="0.65"
        />
        <path
          d="M3.5 18c1.9 0 1.9-3.2 3.8-3.2s1.9 3.2 3.8 3.2 1.9-3.2 3.8-3.2 1.9 3.2 3.8 3.2"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>
    </span>
  );
}
