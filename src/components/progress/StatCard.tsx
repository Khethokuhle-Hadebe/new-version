interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "plain" | "plum" | "lilac";
}

export default function StatCard({
  label,
  value,
  hint,
  tone = "plain",
}: StatCardProps) {
  const styles =
    tone === "plum"
      ? "bg-plum text-cream"
      : tone === "lilac"
        ? "bg-lilac text-plum"
        : "border border-white/70 bg-white/80 text-ink";

  return (
    <div className={`rounded-3xl p-5 ${styles}`}>
      <p
        className={`text-[10px] uppercase tracking-[0.2em] ${
          tone === "plum" ? "text-cream/45" : "text-fog"
        }`}
      >
        {label}
      </p>

      <p className="mt-2 font-heading text-4xl leading-none">{value}</p>

      {hint && (
        <p
          className={`mt-2 text-[11px] ${
            tone === "plum" ? "text-cream/45" : "text-fog"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
