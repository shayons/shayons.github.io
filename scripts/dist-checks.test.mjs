import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import { checkDist, findBannedCharacters, internalTargets } from "./dist-checks.mjs";

describe("findBannedCharacters", () => {
  it("finds a literal em dash and a literal middle dot", () => {
    const found = findBannedCharacters("<p>one \u2014 two \u00b7 three</p>");
    assert.deepEqual(
      found.map((f) => f.name),
      ["em dash", "middle dot"],
    );
  });

  it("finds entity-encoded forms", () => {
    assert.equal(findBannedCharacters("<p>a &mdash; b &#183; c</p>").length, 2);
  });

  it("allows an en dash in a numeric range", () => {
    assert.deepEqual(findBannedCharacters("<p>100\u2013200B</p>"), []);
  });

  it("ignores characters inside style blocks", () => {
    assert.deepEqual(
      findBannedCharacters('<style>a::before{content:"\u00b7"}</style><p>ok</p>'),
      [],
    );
  });
});

describe("theme script allowance", () => {
  let dist;
  let source;

  before(async () => {
    dist = await mkdtemp(path.join(tmpdir(), "theme-dist-checks-"));
    source = await readFile(new URL("../src/scripts/theme.js", import.meta.url), "utf8");
  });

  after(async () => {
    await rm(dist, { recursive: true, force: true });
  });

  it("allows the approved inline theme controller", async () => {
    await writeFile(
      path.join(dist, "index.html"),
      `<script id="color-theme-controller">${source}</script>`,
    );
    assert.deepEqual(await checkDist(dist), []);
  });

  for (const variant of ["modified", "duplicate", "additional"]) {
    it(`rejects ${variant} scripts`, async () => {
      const controller = `<script id="color-theme-controller">${source}</script>`;
      const html = {
        modified: `<script id="color-theme-controller">${source}alert(1)</script>`,
        duplicate: controller + controller,
        additional: `${controller}<script src="https://example.com/extra.js"></script>`,
      }[variant];
      await writeFile(path.join(dist, "index.html"), html);
      assert.deepEqual(
        (await checkDist(dist)).map((problem) => problem.message),
        ["<script> tag in page"],
      );
    });
  }
});

describe("internalTargets", () => {
  it("returns root-relative href and src values only", () => {
    const html =
      '<a href="/talks/">t</a><a href="https://x.com/">x</a><img src="/a.png"><a href="//cdn">c</a>';
    assert.deepEqual(internalTargets(html), ["/talks/", "/a.png"]);
  });
});

describe("checkDist", () => {
  let dist;

  before(async () => {
    dist = await mkdtemp(path.join(tmpdir(), "dist-checks-"));
    await mkdir(path.join(dist, "talks"));
    await writeFile(path.join(dist, "talks", "index.html"), '<h1 id="top">Talks</h1>');
    await writeFile(
      path.join(dist, "index.html"),
      [
        '<section id="work"></section>',
        '<a href="/talks/">ok</a>',
        '<a href="/#work">ok anchor</a>',
        '<a href="/blog/">missing page</a>',
        '<a href="/talks">no slash</a>',
        '<a href="/talks/#nope">missing anchor</a>',
        '<a href="https://example.com/">external</a>',
      ].join(""),
    );
    await writeFile(path.join(dist, "app.js"), "console.log(1)");
    await writeFile(path.join(dist, "bad.html"), "<p>a \u2014 b</p><script>1</script>");
  });

  after(async () => {
    await rm(dist, { recursive: true, force: true });
  });

  it("reports each problem class exactly once and nothing else", async () => {
    const messages = (await checkDist(dist)).map((p) => `${path.basename(p.file)}: ${p.message}`);
    const expected = [
      /^app\.js: JavaScript file in build output$/,
      /^bad\.html: em dash near /,
      /^bad\.html: <script> tag in page$/,
      /^index\.html: no file for \/blog\/$/,
      /^index\.html: missing trailing slash: \/talks$/,
      /^index\.html: missing #nope for \/talks\/#nope$/,
    ];
    assert.equal(messages.length, expected.length, messages.join("\n"));
    for (const pattern of expected) {
      assert.ok(
        messages.some((m) => pattern.test(m)),
        `expected ${pattern} in:\n${messages.join("\n")}`,
      );
    }
  });
});
