/**
 * Standard page heading: eyebrow (section path), h1, optional description,
 * and an optional right-hand slot for page-level actions.
 */
import type { ReactNode } from "react";

type PageHeaderProps = {
  /** Small uppercase path above the title, e.g. "Operations / Attack Feed". */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0 space-y-1.5">
        {eyebrow && <p className="micro-label">{eyebrow}</p>}
        <h1 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">{title}</h1>
        {description && <p className="max-w-2xl text-sm text-ink-dim">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
