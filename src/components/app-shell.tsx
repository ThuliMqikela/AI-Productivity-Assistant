import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  ListChecks,
  Search,
  MessagesSquare,
  Settings,
  Menu,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { usePreferences } from "@/lib/workspace-store";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "text-primary" },
  { to: "/email", label: "Smart Email", icon: Mail, color: "text-tool-1" },
  { to: "/meetings", label: "Meeting Summarizer", icon: FileText, color: "text-tool-2" },
  { to: "/tasks", label: "Task Planner", icon: ListChecks, color: "text-tool-3" },
  { to: "/research", label: "Research Assistant", icon: Search, color: "text-tool-4" },
  { to: "/chat", label: "AI Chat", icon: MessagesSquare, color: "text-tool-5" },
  { to: "/settings", label: "Settings", icon: Settings, color: "text-muted-foreground" },
] as const;

function Brand() {
  return (
    <Link to="/dashboard" className="flex items-center gap-2.5 rounded-md px-1 py-1">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Sparkles className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-bold">Workplace AI</span>
        <span className="block text-xs text-muted-foreground">Productivity Assistant</span>
      </span>
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav aria-label="Main" className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ to, label, icon: Icon, color }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_0_var(--color-primary)]"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooterNote() {
  return (
    <div className="rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
      <span className="mb-1 flex items-center gap-1.5 font-semibold text-foreground">
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
        Responsible AI
      </span>
      Outputs are drafts. Always review before sending or acting on them.
    </div>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { prefs, hydrated } = usePreferences();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  const initials = (hydrated ? prefs.name : "")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between border-r border-sidebar-border bg-sidebar px-3 py-4 lg:flex">
        <div className="flex flex-col gap-6">
          <Brand />
          <NavList />
        </div>
        <SidebarFooterNote />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur md:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation menu">
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-4">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-full flex-col justify-between gap-6">
                <div className="flex flex-col gap-6">
                  <Brand />
                  <NavList onNavigate={() => setOpen(false)} />
                </div>
                <SidebarFooterNote />
              </div>
            </SheetContent>
          </Sheet>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold md:text-lg">{title}</h1>
            <p className="hidden truncate text-sm text-muted-foreground sm:block">{description}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">{hydrated ? prefs.name : "\u00a0"}</p>
              <p className="text-xs text-muted-foreground">Workspace member</p>
            </div>
            <Avatar className="h-9 w-9 border border-border">
              <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
                {initials || "·"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>

        <footer className="border-t border-border px-4 py-5 text-xs text-muted-foreground md:px-8">
          AI-generated content may contain errors or omissions. Review important information before using it for
          workplace, business, legal, financial or other consequential decisions. The assistant does not replace
          professional judgment.
        </footer>
      </div>
    </div>
  );
}
