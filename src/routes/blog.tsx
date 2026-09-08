import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Badge } from "@/components/ui/badge";
import { formatDate, sortedPosts, yearOf } from "@/lib/content";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Writing — Shayon Sanyal" },
      {
        name: "description",
        content:
          "Technical essays on Aurora PostgreSQL, pgvector, migrations, and generative AI — mostly on the AWS Database Blog.",
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const posts = sortedPosts();
  const years = [...new Set(posts.map((p) => yearOf(p.pubDate)))].sort(
    (a, b) => b - a,
  );

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-5 pb-8 pt-16 sm:px-8 sm:pt-20">
        <Link to="/" className="text-xs font-medium text-subtle hover:text-fg">
          Home
        </Link>
        <h1 className="mt-4 text-4xl tracking-tight text-fg sm:text-5xl">
          Writing
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          Technical articles and customer stories, published on the AWS Database
          Blog and AWS Big Data Blog.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        {years.map((year) => {
          const yearPosts = posts.filter((p) => yearOf(p.pubDate) === year);
          return (
            <div key={year} className="mb-16">
              <div className="mb-2 flex items-baseline gap-3 border-b border-border pb-3">
                <h2 className="text-2xl font-semibold text-fg">{year}</h2>
                <Badge>{yearPosts.length}</Badge>
              </div>
              <ul>
                {yearPosts.map((post) => (
                  <li key={post.id} className="border-b border-border">
                    <a
                      href={post.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group grid gap-3 py-7 sm:grid-cols-[8.5rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8"
                    >
                      <time
                        dateTime={post.pubDate}
                        className="font-mono text-xs uppercase tracking-widest text-subtle"
                      >
                        {formatDate(post.pubDate)}
                      </time>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          {post.external ? (
                            <Badge variant="accent">AWS Blog</Badge>
                          ) : null}
                        </div>
                        <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-fg group-hover:text-accent">
                          {post.title}
                        </h3>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                          {post.description}
                        </p>
                        {post.tags.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {post.tags.slice(0, 4).map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <ArrowUpRight className="hidden size-5 text-subtle transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:block" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>
    </SiteShell>
  );
}
