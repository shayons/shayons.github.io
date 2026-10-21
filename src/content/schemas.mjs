import { z } from "astro/zod";

const BANNED_COPY = /[\u2014\u00b7]/;

const id = z.string().regex(/^[a-z0-9-]+$/, "ids are lowercase kebab-case");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "dates use YYYY-MM-DD");
const httpsUrl = z.url().refine((value) => value.startsWith("https://"), "links must use https");
const copy = z
  .string()
  .min(1)
  .refine((value) => !BANNED_COPY.test(value), "copy must not contain em dashes or middle dots");

export const TALK_FORMATS = [
  "talk",
  "workshop",
  "chalk-talk",
  "builder-session",
  "code-talk",
  "webinar",
];

export const talkSchema = z.strictObject({
  id,
  title: copy,
  event: copy,
  format: z.enum(TALK_FORMATS),
  date: isoDate,
  location: copy,
  sessionId: z
    .string()
    .regex(/^[A-Z]{3}\d{3}$/)
    .optional(),
  coPresenters: z.array(copy).min(1).optional(),
  links: z.strictObject({
    video: httpsUrl.optional(),
    page: httpsUrl.optional(),
    code: httpsUrl.optional(),
  }),
});

export const postSchema = z.strictObject({
  id,
  title: copy,
  date: isoDate,
  publication: z.enum(["AWS Database Blog", "AWS Big Data Blog", "AWS Machine Learning Blog"]),
  url: httpsUrl,
});

export const caseStudySchema = z.strictObject({
  id,
  order: z.number().int().positive(),
  industry: copy,
  headline: copy,
  challenge: copy,
  action: copy,
  result: copy,
  metrics: z.array(copy).min(1).max(3),
});

export const projectSchema = z.strictObject({
  id,
  order: z.number().int().positive(),
  name: copy,
  description: copy,
  url: httpsUrl.optional(),
});
