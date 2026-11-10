interface ProgressBarProps {
  value?: number;
  className?: string;
  tone?: "lavender" | "plum" | "cream";
  height?: string;
}

export default function ProgressBar({
  value = 0,
  className = "",
  tone = "lavender",
  height = "h-2",
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));

  const fill =
    tone === "plum" ? "bg-plum" : tone === "cream" ? "bg-cream" : "bg-lavender";

  return (
    <div
      className={`${height} w-full overflow-hidden rounded-full bg-plum/10 ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`${height} rounded-full ${fill} transition-[width] duration-500 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
