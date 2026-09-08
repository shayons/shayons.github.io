import { Check, Link2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CopyLink({
  url,
  label = "Copy link",
  className,
}: {
  url: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex h-11 items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-150 hover:text-fg",
        className,
      )}
    >
      {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
      {copied ? "Copied" : label}
    </button>
  );
}
