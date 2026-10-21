import { readFileSync } from "node:fs";

export const PAGES = ["/", "/talks/", "/blog/", "/404.html"] as const;
export const WIDTHS = [320, 390, 768, 1440] as const;

export type TalkData = { id: string; title: string; date: string; coPresenters?: string[] };
export type PostData = { id: string; title: string; date: string; url: string };

function load<T>(name: string): T[] {
  const file = new URL(`../src/data/${name}.json`, import.meta.url);
  return JSON.parse(readFileSync(file, "utf8")) as T[];
}

export const talks = load<TalkData>("talks");
export const posts = load<PostData>("posts");
