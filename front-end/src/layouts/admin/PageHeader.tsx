import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        {/* Title */}
        <h1 className="text-xl font-bold tracking-tight text-text-primary">
          {title}
        </h1>

        {/* Gradient accent bar */}
        <div className="mt-2 h-0.5 w-12 rounded-full bg-[image:var(--token-gradient-brand)]" />

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-2 text-sm text-text-secondary">{subtitle}</p>
        )}
      </div>

      {/* Right-side action slot */}
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}