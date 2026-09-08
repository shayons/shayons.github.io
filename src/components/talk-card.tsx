import { ArrowUpRight, Github, Play } from "lucide-react";
import { CopyLink } from "@/components/copy-link";
import { Badge } from "@/components/ui/badge";
import {
  EVENT_TYPE_LABELS,
  formatDate,
  isUpcoming,
  youtubeId,
  youtubeThumb,
  type Talk,
} from "@/lib/content";
import { cn } from "@/lib/utils";

export function TalkCard({
  talk,
  featured = false,
}: {
  talk: Talk;
  featured?: boolean;
}) {
  const vid = youtubeId(talk.videoUrl);
  const thumb = vid ? youtubeThumb(vid) : undefined;
  const github = talk.blogUrl?.includes("github.com");
  const shareUrl =
    talk.videoUrl || talk.blogUrl || talk.pageUrl || talk.slidesUrl;
  const upcoming = isUpcoming(talk.date);

  return (
    <article
      className={cn(
        "lift group overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-border)]",
        featured && thumb ? "grid md:grid-cols-2" : "flex h-full flex-col",
      )}
    >
      {thumb ? (
        <a
          href={talk.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "relative block w-full overflow-hidden bg-surface-2",
            featured ? "aspect-video md:min-h-80 md:aspect-auto" : "aspect-video",
          )}
        >
          <img
            src={thumb}
            alt=""
            className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-fg/10" />
          <span className="absolute bottom-3 left-3 inline-flex size-11 items-center justify-center rounded-full bg-fg text-bg">
            <Play className="ml-0.5 size-4 fill-current" />
          </span>
        </a>
      ) : null}

      <div className={cn("flex flex-1 flex-col p-5 sm:p-6", featured && "md:p-8")}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="accent">{EVENT_TYPE_LABELS[talk.eventType]}</Badge>
          {upcoming ? <Badge>Upcoming</Badge> : null}
          {talk.sessionId ? <Badge>{talk.sessionId}</Badge> : null}
          <time
            dateTime={talk.date}
            className="ml-auto font-mono text-xs uppercase tracking-widest text-subtle"
          >
            {formatDate(talk.date)}
          </time>
        </div>

        <h3
          className={cn(
            "text-lg font-semibold leading-snug tracking-tight text-fg",
            featured && "md:text-2xl md:leading-tight",
          )}
        >
          {talk.title}
        </h3>

        <p className="mt-2 text-sm text-muted">
          {talk.event}
          {talk.location ? ` · ${talk.location}` : ""}
        </p>

        <p
          className={cn(
            "mt-3 text-sm leading-relaxed text-muted",
            !featured && "line-clamp-3",
          )}
        >
          {talk.description}
        </p>

        {talk.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {talk.tags.slice(0, featured ? 6 : 3).map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-5">
          {talk.videoUrl ? (
            <a
              href={talk.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-1.5 text-sm font-medium text-fg"
            >
              Watch
              <ArrowUpRight className="size-4" />
            </a>
          ) : null}
          {talk.blogUrl ? (
            <a
              href={talk.blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-1.5 text-sm font-medium text-muted hover:text-fg"
            >
              {github ? <Github className="size-4" /> : null}
              {github ? "GitHub" : "Notes"}
              <ArrowUpRight className="size-4" />
            </a>
          ) : null}
          {talk.pageUrl ? (
            <a
              href={talk.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-1.5 text-sm font-medium text-muted hover:text-fg"
            >
              Session
              <ArrowUpRight className="size-4" />
            </a>
          ) : null}
          {talk.slidesUrl ? (
            <a
              href={talk.slidesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-1.5 text-sm font-medium text-muted hover:text-fg"
            >
              Slides
              <ArrowUpRight className="size-4" />
            </a>
          ) : null}
          {shareUrl ? <CopyLink url={shareUrl} /> : null}
        </div>
      </div>
    </article>
  );
}
