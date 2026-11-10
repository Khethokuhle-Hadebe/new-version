import { formatLong } from "@/lib/dates";

interface WelcomeHeaderProps {
  name: string;
  motivation: string;
}

function greeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";

  return "Good evening";
}

export default function WelcomeHeader({
  name,
  motivation,
}: WelcomeHeaderProps) {
  return (
    <header className="mb-8">
      <p className="nv-eyebrow">{formatLong(new Date())}</p>

      <h1 className="mt-3 font-heading text-[34px] leading-[1.1] text-ink sm:text-[42px]">
        {greeting()}
        {name ? `, ${name}` : ""}.
      </h1>

      <p className="mt-3 max-w-xl font-heading text-lg italic text-fog">
        {motivation}
      </p>
    </header>
  );
}
