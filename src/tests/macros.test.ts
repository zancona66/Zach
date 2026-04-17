import { describe, expect, it } from "vitest";
import { parseMacros } from "../agent/macroRouter.js";
import { buildIntent } from "../agent/orchestrator.js";

describe("parseMacros", () => {
  it("recognizes domain macros and strips them", () => {
    const p = parseMacros("/demand Draft a letter for Acme");
    expect(p.macros).toEqual(["/demand"]);
    expect(p.cleanedInput).toBe("Draft a letter for Acme");
    expect(p.domainHint).toBe("legal");
  });

  it("maps mode macros to AgentMode", () => {
    const p = parseMacros("/FAST explain karat math");
    expect(p.modeHint).toBe("FAST");
  });

  it("recognizes exhibit macros A..L", () => {
    const p = parseMacros("/exhA reference invoice");
    expect(p.exhibitTags).toEqual(["Exhibit A"]);
    expect(p.macros).toContain("/exhA");
  });

  it("accepts multiple macros", () => {
    const p = parseMacros("/DEEP /EVIDENCE build timeline");
    expect(p.macros).toContain("/DEEP");
    expect(p.macros).toContain("/EVIDENCE");
    expect(p.modeHint).toBe("DEEP");
    expect(p.domainHint).toBe("evidence");
  });

  it("leaves unknown slash tokens untouched", () => {
    const p = parseMacros("/NOT_A_MACRO run");
    expect(p.macros).toHaveLength(0);
    expect(p.cleanedInput).toContain("/NOT_A_MACRO");
  });

  it("is case-insensitive for uppercase macros", () => {
    const p = parseMacros("/fast go");
    expect(p.macros).toContain("/FAST");
  });
});

describe("buildIntent", () => {
  it("resolves mode hint to AgentMode", () => {
    const intent = buildIntent({ input: "/DEEP analyze complaint" });
    expect(intent.mode).toBe("DEEP");
  });

  it("explicit mode arg wins over macro", () => {
    const intent = buildIntent({ input: "/FAST go", mode: "LEGAL" });
    expect(intent.mode).toBe("LEGAL");
  });

  it("defaults to FULL_POWER without hints", () => {
    const intent = buildIntent({ input: "hello" });
    expect(intent.mode).toBe("FULL_POWER");
  });
});
