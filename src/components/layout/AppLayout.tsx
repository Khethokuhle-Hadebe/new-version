"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  BookOpen,
  Sparkles,
  ListChecks,
  TrendingUp,
  Settings,
  Menu,
  X,
} from "lucide-react";

import NewVersionLogo from "@/components/shared/NewVersionLogo";
import { useSettings } from "@/hooks/useAppData";

export const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/journal", label: "Journal", icon: BookOpen },
  { to: "/affirmations", label: "Affirmations", icon: Sparkles },
  { to: "/habits", label: "Daily Habits", icon: ListChecks },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/settings", label: "Settings", icon: Settings },
];

interface NavItemsProps {
  onNavigate?: () => void;
}

function NavItems({ onNavigate }: NavItemsProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1" aria-label="Main navigation">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
        const isActive =
          to === "/" ? pathname === "/" : pathname.startsWith(to);

        return (
          <Link
            key={to}
            href={to}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${
              isActive
                ? "bg-lavender font-medium text-plum shadow-[0_10px_30px_-16px_rgba(185,162,232,0.9)]"
                : "text-cream/65 hover:bg-white/5 hover:text-cream"
            }`}
          >
            <Icon
              className={`h-[18px] w-[18px] transition-colors ${
                isActive
                  ? "text-plum"
                  : "text-lavender/70 group-hover:text-lavender"
              }`}
              strokeWidth={1.8}
            />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <NewVersionLogo size={40} variant="lavender" />

      <div className="leading-tight">
        <p className="font-heading text-[22px] text-cream">New Version</p>
        <p className="text-[10px] uppercase tracking-[0.22em] text-cream/45">
          Next chapter
        </p>
      </div>
    </div>
  );
}

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [open, setOpen] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-cream">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col bg-plum px-5 py-7 lg:flex">
        <Brand />

        <div className="mt-10 flex-1">
          <p className="mb-3 px-4 text-[10px] uppercase tracking-[0.22em] text-cream/35">
            Your space
          </p>

          <NavItems />
        </div>

        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-xs text-cream/50">Growing as</p>
          <p className="mt-1 truncate font-heading text-lg text-cream">
            {settings.displayName || "Your future self"}
          </p>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-plum px-5 py-4 lg:hidden">
        <Brand />

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          aria-expanded={open}
          className="rounded-full p-2 text-cream/80 transition hover:bg-white/10 hover:text-cream"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          open ? "" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-plum/50 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        <div
          className={`absolute inset-y-0 right-0 flex w-[290px] flex-col bg-plum px-5 py-6 transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <Brand />

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="rounded-full p-2 text-cream/70 transition hover:bg-white/10 hover:text-cream"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-8 flex-1 overflow-y-auto">
            <NavItems onNavigate={() => setOpen(false)} />
          </div>
        </div>
      </div>

      {/* Main page content */}
      <main className="lg:pl-[264px]">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
