import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { TalksTable } from "@/components/talks-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isSessionFormat, sortedTalks } from "@/lib/content";

export const Route = createFileRoute("/talks")({
  head: () => ({
    meta: [
      { title: "Talks — Shayon Sanyal" },
      {
        name: "description",
        content:
          "Conference talks, workshops, and sessions on PostgreSQL, Aurora, and agentic AI.",
      },
    ],
  }),
  component: TalksPage,
});

type Kind = "all" | "talks" | "sessions";

function TalksPage() {
  const all = sortedTalks();
  const [kind, setKind] = useState<Kind>("all");
  const [query, setQuery] = useState("");

  const data = useMemo(() => {
    return all.filter((talk) => {
      if (kind === "talks" && isSessionFormat(talk.eventType)) return false;
      if (kind === "sessions" && !isSessionFormat(talk.eventType)) return false;
      return true;
    });
  }, [all, kind]);

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-5 pb-8 pt-12 sm:px-8 sm:pt-16">
        <Link to="/" className="text-xs font-medium text-subtle hover:text-fg">
          Home
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl tracking-tight text-fg sm:text-5xl">Talks</h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
              Conference sessions, workshops, chalk talks, and builder labs from
              re:Invent, PGConf, and the AWS circuit.
            </p>
          </div>
          <p className="text-sm text-subtle">
            {data.length} {data.length === 1 ? "session" : "sessions"}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["all", "All"],
                ["talks", "Talks"],
                ["sessions", "Workshops"],
              ] as const
            ).map(([value, label]) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={kind === value ? "default" : "outline"}
                aria-pressed={kind === value}
                onClick={() => setKind(value)}
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="sm:ml-auto sm:w-64">
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter sessions…"
              aria-label="Filter sessions"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <TalksTable
          data={data}
          globalFilter={query}
          onGlobalFilterChange={setQuery}
        />
      </section>
    </SiteShell>
  );
}
