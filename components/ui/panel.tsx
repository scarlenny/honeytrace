/**
 * <Panel>: the glassmorphic container every HoneyTrace screen is built from.
 *
 *   <Panel title="Top source IPs" icon={Globe} meta="Last 24h" actions={<Button/>}>
 *     ...content...
 *   </Panel>
 *
 * Visuals live in globals.css (.ht-panel) and are switched with data attributes,
 * so this file is only structure. It uses no hooks, so it works in Server and
 * Client Components alike.
 */
import type { LucideIcon } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PanelTone = "default" | "cyan" | "alert" | "warn" | "ok";

export type PanelProps = Omit<ComponentPropsWithoutRef<"section">, "title"> & {
  /** Uppercase micro-label shown in the header. Omit for a header-less panel. */
  title?: string;
  /** Small icon before the title, tinted with the tone color. */
  icon?: LucideIcon;
  /** Secondary header text in monospace, e.g. "LAST 24H" or "3 SESSIONS". */
  meta?: ReactNode;
  /** Right-aligned header slot: buttons, toggles, a timestamp. */
  actions?: ReactNode;
  /** Accent color for the border, glow, corners, and icon. Default: neutral with cyan hover. */
  tone?: PanelTone;
  /** When the border glows. "hover" (default) also covers keyboard focus inside the panel. */
  glow?: "hover" | "always" | "none";
  /** Body padding. Use "none" for edge-to-edge tables and charts. */
  padding?: "none" | "sm" | "md" | "lg";
  /** HUD corner brackets. On by default. */
  corners?: boolean;
  /** Element to render. "section" gives screen readers a named landmark. */
  as?: "section" | "div" | "article" | "aside";
  /** Heading level for the title, to keep the page outline correct. */
  headingLevel?: 2 | 3 | 4;
  /** Extra classes for the body wrapper (the outer element takes `className`). */
  bodyClassName?: string;
};

const PADDING = { none: "", sm: "p-3", md: "p-4", lg: "p-6" } as const;

const ICON_TONE: Record<PanelTone, string> = {
  default: "text-cyan",
  cyan: "text-cyan",
  alert: "text-alert",
  warn: "text-warn",
  ok: "text-ok",
};

export function Panel({
  title,
  icon: Icon,
  meta,
  actions,
  tone = "default",
  glow = "hover",
  padding = "md",
  corners = true,
  as: Tag = "section",
  headingLevel = 2,
  bodyClassName,
  className,
  children,
  ...rest
}: PanelProps) {
  const Heading = `h${headingLevel}` as const;
  const hasHeader = Boolean(title || meta || actions);

  return (
    <Tag
      data-tone={tone}
      data-glow={glow}
      aria-label={Tag !== "div" && title ? title : undefined}
      className={cn("ht-panel", className)}
      {...rest}
    >
      {corners && (
        <>
          <span aria-hidden className="ht-panel-corner" data-pos="tl" />
          <span aria-hidden className="ht-panel-corner" data-pos="tr" />
          <span aria-hidden className="ht-panel-corner" data-pos="bl" />
          <span aria-hidden className="ht-panel-corner" data-pos="br" />
        </>
      )}

      {hasHeader && (
        <>
          <header className="flex min-h-11 items-center gap-3 px-4 py-2.5">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              {Icon && <Icon aria-hidden className={cn("size-3.5 shrink-0", ICON_TONE[tone])} />}
              {/* Title gets its natural width first; meta (basis-0, grow) only fills what is left */}
              {title && <Heading className="micro-label min-w-0 truncate">{title}</Heading>}
              {meta && (
                <span className="data min-w-0 flex-1 basis-0 truncate text-[10px] tracking-wider text-ink-dim uppercase">
                  {title && <span className="mr-2 text-ink-muted">/</span>}
                  {meta}
                </span>
              )}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
          </header>
          <div aria-hidden className="ht-panel-rule" />
        </>
      )}

      <div className={cn("min-h-0 flex-1", PADDING[padding], bodyClassName)}>{children}</div>
    </Tag>
  );
}
