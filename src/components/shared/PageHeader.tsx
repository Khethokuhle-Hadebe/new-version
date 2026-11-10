import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <div>
        <p className="nv-eyebrow text-plum/55">{eyebrow}</p>

        <h1 className="mt-2 font-heading text-4xl leading-tight text-ink sm:text-5xl">
          {title}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fog sm:text-base">
          {description}
        </p>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
