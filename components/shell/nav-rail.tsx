"use client";

/**
 * Collapsible left navigation rail.
 * - Expanded: 240px, icon + label. Collapsed: 64px, icon only + hover tooltip.
 * - Below the md breakpoint it is always icon-only to save space.
 * - Collapsed state persists in localStorage (see ShellProvider).
 * Width animates with a CSS transition, which the reduced-motion rule disables.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { ChevronsLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/nav";
import { useShellUI } from "./shell-context";

export function NavRail() {
  const { navCollapsed, toggleNav } = useShellUI();

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "relative z-20 flex shrink-0 flex-col border-r border-line bg-sidebar backdrop-blur-xl",
        "transition-[width] duration-300 ease-out",
        navCollapsed ? "w-16" : "w-60",
        "max-md:w-16",
      )}
    >
      <p
        className={cn(
          "micro-label px-5 pt-5 pb-3 text-[10px] text-ink-muted",
          (navCollapsed && "sr-only") || "max-md:sr-only",
        )}
      >
        Operations
      </p>

      {/* Reading the URL can suspend during prerender (see ActiveNavList), so the
          fallback renders the identical list with nothing highlighted. */}
      <Suspense fallback={<NavList pathname={null} navCollapsed={navCollapsed} />}>
        <ActiveNavList navCollapsed={navCollapsed} />
      </Suspense>

      <div className="mt-auto border-t border-line p-2 max-md:hidden">
        <button
          type="button"
          onClick={toggleNav}
          aria-label={navCollapsed ? "Expand navigation" : "Collapse navigation"}
          aria-expanded={!navCollapsed}
          className="flex h-9 w-full items-center gap-3 rounded-md px-4 text-xs text-ink-dim outline-none transition-colors hover:bg-white/[0.03] hover:text-ink focus-visible:ring-2 focus-visible:ring-cyan/60"
        >
          <ChevronsLeft
            className={cn("size-4 shrink-0 transition-transform duration-300", navCollapsed && "rotate-180")}
          />
          <span className={cn("whitespace-nowrap font-heading", navCollapsed && "sr-only")}>Collapse</span>
        </button>
      </div>
    </nav>
  );
}

/**
 * With cacheComponents on, usePathname() suspends while prerendering a route
 * whose dynamic param isn't known at build time (e.g. /sessions/[id]).
 * Isolating it here keeps the rest of the shell prerendered; only the
 * active highlight streams in.
 */
function ActiveNavList({ navCollapsed }: { navCollapsed: boolean }) {
  const pathname = usePathname();
  return <NavList pathname={pathname} navCollapsed={navCollapsed} />;
}

function NavList({ pathname, navCollapsed }: { pathname: string | null; navCollapsed: boolean }) {
  return (
    <ul className={cn("flex flex-col gap-1 px-2", navCollapsed && "pt-5", "max-md:pt-5")}>
      {NAV_ITEMS.map(({ label, href, icon: Icon, isActive }) => {
        const active = pathname !== null && isActive(pathname);
        return (
          <li key={href} className="group/item relative">
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              aria-label={label}
              className={cn(
                "relative flex h-10 items-center rounded-md px-[15px] font-heading text-sm",
                navCollapsed ? "gap-0" : "gap-3",
                "max-md:gap-0",
                "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-cyan/60",
                active ? "bg-cyan/[0.08] text-cyan" : "text-ink-dim hover:bg-white/[0.03] hover:text-ink",
              )}
            >
              {/* Active indicator: glowing bar on the left edge */}
              {active && <span className="absolute inset-y-2 -left-2 w-0.5 rounded-full bg-cyan shadow-glow-cyan" />}
              <Icon className={cn("size-[18px] shrink-0", active && "drop-shadow-[0_0_6px_rgb(0_240_255/0.7)]")} />
              <span
                className={cn(
                  "overflow-hidden whitespace-nowrap transition-opacity duration-200",
                  navCollapsed ? "w-0 opacity-0" : "opacity-100",
                  "max-md:w-0 max-md:opacity-0",
                )}
              >
                {label}
              </span>
            </Link>

            {/* Tooltip, only meaningful when labels are hidden */}
            <span
              role="tooltip"
              className={cn(
                "pointer-events-none absolute top-1/2 left-full z-30 ml-3 -translate-y-1/2 rounded-md",
                "glass px-2.5 py-1 font-heading text-xs whitespace-nowrap text-ink",
                "opacity-0 transition-opacity group-hover/item:opacity-100 group-focus-within/item:opacity-100",
                navCollapsed ? "block" : "hidden max-md:block",
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
