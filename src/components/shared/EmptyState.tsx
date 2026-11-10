import type { ComponentType, ReactNode, SVGProps } from "react";

interface EmptyStateProps {
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-ink/12 bg-white/40 px-6 py-12 text-center">
      {Icon && (
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-lilac text-plum">
          <Icon className="h-5 w-5" strokeWidth={1.6} />
        </span>
      )}

      <p className="mt-4 font-heading text-xl text-ink">{title}</p>

      {description && (
        <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-fog">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
