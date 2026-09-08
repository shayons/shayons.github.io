import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Database,
  Search,
  Workflow,
} from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { TalkCard } from "@/components/talk-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SITE,
  featuredTalks,
  formatDate,
  projects,
  recentPosts,
} from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shayon Sanyal — Databases & Agentic AI" },
      {
        name: "description",
        content:
          "Principal Solutions Architect at AWS. Aurora PostgreSQL, pgvector, and agentic systems.",
      },
    ],
  }),
  component: Home,
});

const FOCUS = [
  {
    icon: Database,
    title: "Aurora PostgreSQL",
    body: "Production OLTP at scale — global databases, serverless, and the operational backbone agents depend on.",
  },
  {
    icon: Search,
    title: "pgvector & retrieval",
    body: "Hybrid search, RAG, and embeddings treated as database concerns — not a side store.",
  },
  {
    icon: Workflow,
    title: "Agentic systems",
    body: "Bedrock, MCP, and workflows where the database is memory, tools, and ground truth.",
  },
] as const;

function Home() {
  const featured = featuredTalks(3);
  const writing = recentPosts(3);
  const [leadTalk, ...restTalks] = featured;

  return (
    <SiteShell>
      <Hero />
      <Stats />
      <About />
      <Focus />
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <SectionHead
          kicker="Talks"
          title="On stage"
          action={
            <Link
              to="/talks"
              className="inline-flex h-10 items-center gap-1.5 text-sm font-medium text-muted hover:text-fg"
            >
              All sessions
              <ArrowRight className="size-4" />
            </Link>
          }
        />
        <div className="mt-10 space-y-4">
          {leadTalk ? <TalkCard talk={leadTalk} featured /> : null}
          <div className="grid gap-4 md:grid-cols-2">
            {restTalks.map((talk) => (
              <TalkCard key={talk.id} talk={talk} />
            ))}
          </div>
        </div>
      </section>
      <Writing writing={writing} />
      <Work />
      <Contact />
    </SiteShell>
  );
}

function SectionHead({
  kicker,
  title,
  action,
}: {
  kicker: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          {kicker}
        </p>
        <h2 className="mt-2 text-3xl tracking-tight text-fg sm:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:pb-20 lg:pt-16">
      <div className="lg:col-span-7">
        <p className="reveal text-sm font-medium text-muted">
          {SITE.name} · {SITE.role}
        </p>
        <h1 className="reveal reveal-2 mt-5 max-w-xl text-4xl tracking-tight text-fg sm:text-5xl lg:text-6xl">
          Databases at the center of agentic systems.
        </h1>
        <p className="reveal reveal-3 mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
          {SITE.tagline}
        </p>
        <div className="reveal reveal-4 mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/talks">
              Watch talks
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/blog">Read writing</Link>
          </Button>
        </div>
      </div>

      <figure className="reveal reveal-3 mx-auto w-full max-w-sm lg:col-span-5 lg:mx-0 lg:max-w-none">
        <div className="overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-border)]">
          <img
            src={SITE.photo}
            alt={SITE.name}
            width={640}
            height={800}
            className="aspect-4/5 w-full object-cover object-top"
          />
        </div>
        <figcaption className="mt-3 flex items-center justify-between text-xs text-subtle">
          <span>{SITE.location}</span>
          <span>Aurora · pgvector · agents</span>
        </figcaption>
      </figure>
    </section>
  );
}

function Stats() {
  return (
    <section className="border-y border-border">
      <div className="mx-auto grid max-w-6xl grid-cols-3 px-5 sm:px-8">
        {SITE.stats.map((stat) => (
          <div key={stat.label} className="py-8 text-center sm:py-10">
            <p className="text-3xl font-semibold tracking-tight text-fg sm:text-5xl">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-subtle">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <p className="text-xs font-medium uppercase tracking-widest text-accent">
        About
      </p>
      <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <h2 className="text-3xl tracking-tight text-fg sm:text-4xl lg:col-span-5">
          Bridging OLTP and retrieval so agents can actually ship.
        </h2>
        <div className="space-y-4 text-base leading-relaxed text-muted lg:col-span-7 sm:text-lg">
          <p>
            I'm a Principal Solutions Architect at AWS. I help teams put
            databases at the center of agentic applications — Aurora PostgreSQL,
            pgvector, Amazon Bedrock, and the Model Context Protocol.
          </p>
          <p>
            Most of the work sits where production data becomes memory, tools,
            and ground truth. I speak at AWS re:Invent and PGConf, write on the
            AWS Database Blog, and publish workshop code as AWS samples.
          </p>
        </div>
      </div>
    </section>
  );
}

function Focus() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
      <div className="grid gap-4 md:grid-cols-3">
        {FOCUS.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl bg-surface p-6 shadow-[var(--shadow-border)]"
          >
            <item.icon className="size-5 text-accent" strokeWidth={1.75} />
            <h3 className="mt-4 text-base font-semibold text-fg">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Writing({
  writing,
}: {
  writing: ReturnType<typeof recentPosts>;
}) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <SectionHead
          kicker="Writing"
          title="AWS Database Blog"
          action={
            <Link
              to="/blog"
              className="inline-flex h-10 items-center gap-1.5 text-sm font-medium text-muted hover:text-fg"
            >
              All essays
              <ArrowRight className="size-4" />
            </Link>
          }
        />
        <ul className="mt-10 divide-y divide-border border-y border-border">
          {writing.map((post) => (
            <li key={post.id}>
              <a
                href={post.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:gap-10"
              >
                <time
                  dateTime={post.pubDate}
                  className="w-36 shrink-0 text-xs font-medium text-subtle"
                >
                  {formatDate(post.pubDate, "long")}
                </time>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold leading-snug tracking-tight text-fg group-hover:text-accent">
                    {post.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
                    {post.description}
                  </p>
                </div>
                <ArrowUpRight className="hidden size-4 shrink-0 text-subtle transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:block" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <SectionHead
        kicker="Work"
        title="Samples and labs"
        action={
          <a
            href="https://github.com/shayons"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-1.5 text-sm font-medium text-muted hover:text-fg"
          >
            GitHub
            <ArrowRight className="size-4" />
          </a>
        }
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <a
            key={project.name}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="lift group flex flex-col rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)]"
          >
            <div className="flex items-center justify-between gap-3">
              <Badge variant={project.kind === "aws-sample" ? "accent" : "default"}>
                {project.kind === "aws-sample" ? "AWS Samples" : "Personal"}
              </Badge>
              <span className="font-mono text-xs text-subtle">
                {project.language}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight text-fg">
              {project.title}
            </h3>
            <p className="mt-1 font-mono text-xs text-subtle">{project.name}</p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              {project.description}
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-muted group-hover:text-fg">
              Open repository
              <ArrowUpRight className="size-4" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          Contact
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl tracking-tight text-fg sm:text-5xl">
          Collaborating, speaking, or talking databases and AI.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
          {SITE.emailLabel} Events, workshops, and technical deep-dives on
          Aurora, PostgreSQL, and agentic architectures.
        </p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {SITE.socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="lift flex items-center justify-between rounded-xl bg-bg px-5 py-4 shadow-[var(--shadow-border)]"
            >
              <span>
                <span className="block text-sm font-medium text-fg">
                  {social.name}
                </span>
                <span className="mt-0.5 block text-sm text-muted">
                  {social.description}
                </span>
              </span>
              <ArrowUpRight className="size-4 text-subtle" />
            </a>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            Looking for a speaker for your next event?
          </p>
          <Button asChild>
            <a
              href="https://www.linkedin.com/in/shayonsanyal/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Connect on LinkedIn
              <ArrowUpRight />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
