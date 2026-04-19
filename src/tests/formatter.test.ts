import { describe, expect, it } from "vitest";
import { buildResponse, renderMarkdown } from "../core/responseFormatter.js";
import { ResponsePayloadSchema } from "../core/schemas.js";
import { buildFileName, parseFileName, bumpVersion } from "../domains/cad/fileNaming.js";

describe("buildResponse", () => {
  it("enforces 4-6 bullets by padding or clamping", () => {
    const r = buildResponse({ tldr: "x", bullets: ["a"] });
    expect(r.bullets.length).toBeGreaterThanOrEqual(4);
    expect(r.bullets.length).toBeLessThanOrEqual(6);
  });

  it("clamps too many bullets to 6", () => {
    const r = buildResponse({ tldr: "x", bullets: ["a", "b", "c", "d", "e", "f", "g"] });
    expect(r.bullets.length).toBe(6);
  });

  it("emits required sections in payload", () => {
    const r = buildResponse({
      tldr: "summary",
      bullets: ["one", "two", "three", "four"],
      fullDraft: "DRAFT",
      nextActions: ["do x"],
      confidence: "H",
    });
    expect(r.tldr).toBe("summary");
    expect(r.fullDraft).toBe("DRAFT");
    expect(r.nextActions).toEqual(["do x"]);
    expect(r.confidence).toBe("H");
  });

  it("passes zod validation", () => {
    const r = buildResponse({ tldr: "t", bullets: ["a", "b", "c", "d"] });
    const parsed = ResponsePayloadSchema.safeParse(r);
    expect(parsed.success).toBe(true);
  });
});

describe("renderMarkdown", () => {
  it("includes all five labeled sections", () => {
    const r = buildResponse({
      tldr: "t",
      bullets: ["b1", "b2", "b3", "b4"],
      fullDraft: "DRAFT",
      nextActions: ["na1"],
      confidence: "M",
    });
    const md = renderMarkdown(r);
    expect(md).toMatch(/## TL;DR/);
    expect(md).toMatch(/## Bullets/);
    expect(md).toMatch(/## Full Draft/);
    expect(md).toMatch(/## Next Actions/);
    expect(md).toMatch(/## Confidence/);
  });
});

describe("CAD file naming", () => {
  it("builds canonical ANCONA_<Piece>_<Size>_v###.ext", () => {
    const name = buildFileName({ piece: "SignetRing", size: "10", version: 3 });
    expect(name).toBe("ANCONA_SignetRing_10_v003.stl");
  });

  it("supports obj extension", () => {
    expect(buildFileName({ piece: "Pendant", size: "M", version: 12, ext: "obj" })).toBe(
      "ANCONA_Pendant_M_v012.obj",
    );
  });

  it("parses its own canonical output", () => {
    const parsed = parseFileName("ANCONA_SignetRing_10_v003.stl");
    expect(parsed?.piece).toBe("SignetRing");
    expect(parsed?.size).toBe("10");
    expect(parsed?.version).toBe(3);
    expect(parsed?.ext).toBe("stl");
  });

  it("bumps version", () => {
    expect(bumpVersion("ANCONA_SignetRing_10_v003.stl")).toBe(
      "ANCONA_SignetRing_10_v004.stl",
    );
  });

  it("sanitizes unsafe characters", () => {
    const name = buildFileName({ piece: "Sig net/ Ring", size: "10 1/2", version: 1 });
    expect(name).toMatch(/^ANCONA_Sig_net_Ring_10_12_v001\.stl$/);
  });
});
