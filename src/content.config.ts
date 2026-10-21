import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { caseStudySchema, postSchema, projectSchema, talkSchema } from "./content/schemas.mjs";

export const collections = {
  talks: defineCollection({ loader: file("src/data/talks.json"), schema: talkSchema }),
  posts: defineCollection({ loader: file("src/data/posts.json"), schema: postSchema }),
  caseStudies: defineCollection({
    loader: file("src/data/case-studies.json"),
    schema: caseStudySchema,
  }),
  projects: defineCollection({ loader: file("src/data/projects.json"), schema: projectSchema }),
};
