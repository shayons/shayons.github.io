import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { TALK_FORMATS } from "#src/content/schemas.mjs";
import {
  FORMAT_LABELS,
  formatDate,
  formatMonth,
  groupByYear,
  isUpcoming,
  newestFirst,
} from "./dates.mjs";

const items = [
  { id: "b", date: "2025-12-05" },
  { id: "a", date: "2025-12-05" },
  { id: "c", date: "2026-04-21" },
  { id: "d", date: "2024-01-02" },
];

describe("newestFirst", () => {
  it("sorts by date descending and breaks ties by id", () => {
    assert.deepEqual(
      newestFirst(items).map((item) => item.id),
      ["c", "a", "b", "d"],
    );
  });

  it("does not mutate its input", () => {
    const copy = [...items];
    newestFirst(items);
    assert.deepEqual(items, copy);
  });
});

describe("groupByYear", () => {
  it("groups newest year first with sorted entries", () => {
    const groups = groupByYear(items);
    assert.deepEqual(
      groups.map((g) => g.year),
      ["2026", "2025", "2024"],
    );
    assert.deepEqual(
      groups[1].entries.map((e) => e.id),
      ["a", "b"],
    );
  });
});

describe("formatting", () => {
  it("formats full dates and months without time zone drift", () => {
    assert.equal(formatDate("2026-09-30"), "Sep 30, 2026");
    assert.equal(formatDate("2026-01-01"), "Jan 1, 2026");
    assert.equal(formatMonth("2026-05-08"), "May 2026");
  });

  it("labels every talk format", () => {
    for (const format of TALK_FORMATS) assert.ok(FORMAT_LABELS[format], format);
  });
});

describe("isUpcoming", () => {
  const now = new Date("2026-10-21T12:00:00Z");

  it("is true only for dates after today", () => {
    assert.equal(isUpcoming("2026-10-22", now), true);
    assert.equal(isUpcoming("2026-10-21", now), false);
    assert.equal(isUpcoming("2026-10-20", now), false);
  });
});
