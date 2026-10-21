import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { caseStudySchema, postSchema, projectSchema, talkSchema } from "./schemas.mjs";

async function load(name) {
  return JSON.parse(await readFile(new URL(`../data/${name}.json`, import.meta.url), "utf8"));
}

const DATASETS = [
  ["talks", talkSchema],
  ["posts", postSchema],
  ["case-studies", caseStudySchema],
  ["projects", projectSchema],
];

describe("data files", () => {
  for (const [name, schema] of DATASETS) {
    it(`${name}.json matches its schema and has unique ids`, async () => {
      const entries = await load(name);
      for (const entry of entries) {
        const result = schema.safeParse(entry);
        assert.ok(result.success, `${name}/${entry.id}: ${result.error?.message}`);
      }
      const ids = entries.map((entry) => entry.id);
      assert.equal(new Set(ids).size, ids.length, `${name}.json has duplicate ids`);
    });
  }

  it("has at least the launch content", async () => {
    const floors = [
      ["talks", 22],
      ["posts", 15],
      ["projects", 4],
    ];
    for (const [name, floor] of floors) {
      const count = (await load(name)).length;
      assert.ok(count >= floor, `${name}.json has ${count} entries, expected at least ${floor}`);
    }
    const cases = (await load("case-studies")).length;
    assert.equal(cases, 5, `case-studies.json has ${cases} entries, the spec fixes five`);
  });

  it("case studies name no customers", async () => {
    const text = JSON.stringify(await load("case-studies"));
    assert.doesNotMatch(text, /\b(Netflix|Ring)\b/);
  });
});

const validCase = {
  id: "x",
  order: 1,
  industry: "Global bank",
  headline: "Headline",
  challenge: "Challenge",
  action: "Action",
  result: "Result",
  metrics: ["Metric"],
};

describe("caseStudySchema", () => {
  it("accepts a valid case study", () => {
    assert.ok(caseStudySchema.safeParse(validCase).success);
  });

  it("rejects a customer name field", () => {
    assert.equal(caseStudySchema.safeParse({ ...validCase, client: "Acme" }).success, false);
  });

  it("rejects a link field", () => {
    const withUrl = { ...validCase, url: "https://example.com/" };
    assert.equal(caseStudySchema.safeParse(withUrl).success, false);
  });

  it("rejects em dashes and middle dots in copy", () => {
    assert.equal(
      caseStudySchema.safeParse({ ...validCase, headline: "a \u2014 b" }).success,
      false,
    );
    assert.equal(
      caseStudySchema.safeParse({ ...validCase, headline: "01 \u00b7 Discover" }).success,
      false,
    );
  });
});

describe("talkSchema", () => {
  const valid = {
    id: "t",
    title: "Title",
    event: "Event",
    format: "talk",
    date: "2026-01-01",
    location: "Virtual",
    links: {},
  };

  it("accepts a minimal talk", () => {
    assert.ok(talkSchema.safeParse(valid).success);
  });

  it("rejects plain http links", () => {
    const http = { ...valid, links: { video: "http://example.com/" } };
    assert.equal(talkSchema.safeParse(http).success, false);
  });

  it("rejects unknown formats and malformed dates", () => {
    assert.equal(talkSchema.safeParse({ ...valid, format: "keynote" }).success, false);
    assert.equal(talkSchema.safeParse({ ...valid, date: "Sep 30 2026" }).success, false);
  });
});
