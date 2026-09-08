import { Link, useRouterState } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/content";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", hash: "about", label: "About" },
  { to: "/talks", label: "Talks" },
  { to: "/blog", label: "Writing" },
  { to: "/", hash: "work", label: "Work" },
] as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-fg transition-opacity duration-150 hover:opacity-70"
        >
          <span className="flex size-7 items-center justify-center rounded-md bg-accent text-xs font-semibold text-accent-fg">
            S
          </span>
          <span className="text-sm font-semibold tracking-tight">
            {SITE.shortName}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {nav.map((item) => {
            const active = !("hash" in item) && pathname === item.to;
            return (
              <Link
                key={item.label}
                to={item.to}
                hash={"hash" in item ? item.hash : undefined}
                className={cn(
                  "text-sm font-medium text-muted transition-colors duration-150 hover:text-fg",
                  active && "text-fg",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link to="/" hash="contact">
              Let's talk
            </Link>
          </Button>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu />
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-fg/20 backdrop-blur-sm" />
              <Dialog.Content
                className="fixed inset-y-3 right-3 z-50 flex w-80 max-w-xs flex-col rounded-2xl bg-surface p-6 shadow-[var(--shadow-border)] outline-none"
                aria-describedby={undefined}
              >
                <div className="mb-8 flex items-center justify-between">
                  <Dialog.Title className="text-sm font-semibold text-fg">
                    {SITE.shortName}
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <Button variant="ghost" size="icon" aria-label="Close menu">
                      <X />
                    </Button>
                  </Dialog.Close>
                </div>
                <nav className="flex flex-col gap-1" aria-label="Mobile">
                  {nav.map((item) => (
                    <Dialog.Close asChild key={item.label}>
                      <Link
                        to={item.to}
                        hash={"hash" in item ? item.hash : undefined}
                        className="flex h-12 items-center text-lg text-fg"
                      >
                        {item.label}
                      </Link>
                    </Dialog.Close>
                  ))}
                  <Dialog.Close asChild>
                    <Link
                      to="/"
                      hash="contact"
                      className="mt-4 flex h-12 items-center text-lg font-medium text-fg"
                    >
                      Let's talk
                    </Link>
                  </Dialog.Close>
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
