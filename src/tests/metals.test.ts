import { describe, expect, it } from "vitest";
import {
  convertWeight,
  karatPurity,
  meltValue,
} from "../domains/finance/preciousMetals.js";
import { cogs, grossMargin, roi, breakeven } from "../domains/finance/roi.js";
import { GRAMS_PER_TROY_OZ, GRAMS_PER_PENNYWEIGHT } from "../config/constants.js";

describe("precious metals conversions", () => {
  it("1 troy ounce equals 31.1034768 g", () => {
    expect(convertWeight(1, "ozt", "g")).toBeCloseTo(31.1034768, 7);
  });

  it("1 pennyweight equals 1.55517384 g", () => {
    expect(convertWeight(1, "dwt", "g")).toBeCloseTo(1.55517384, 8);
  });

  it("20 dwt equals 1 troy ounce", () => {
    expect(convertWeight(20, "dwt", "ozt")).toBeCloseTo(1, 8);
  });

  it("round trips grams -> ozt -> grams", () => {
    const g = 12.3456;
    const ozt = convertWeight(g, "g", "ozt");
    expect(convertWeight(ozt, "ozt", "g")).toBeCloseTo(g, 8);
  });

  it("constants match spec", () => {
    expect(GRAMS_PER_TROY_OZ).toBe(31.1034768);
    expect(GRAMS_PER_PENNYWEIGHT).toBe(1.55517384);
  });
});

describe("karat purity", () => {
  it("24K is ~0.9999", () => {
    expect(karatPurity(24)).toBeCloseTo(0.9999, 4);
  });
  it("14K is 0.5833", () => {
    expect(karatPurity(14)).toBeCloseTo(0.5833, 4);
  });
  it("18K is 0.75", () => {
    expect(karatPurity(18)).toBe(0.75);
  });
  it("non-standard karat falls back to k/24", () => {
    expect(karatPurity(12)).toBeCloseTo(0.5, 4);
  });
});

describe("melt value", () => {
  it("14K 5g at $2,000/ozt ≈ 187.43 USD", () => {
    const { value, audit } = meltValue({
      grossWeight: 5,
      unit: "g",
      karat: 14,
      spotPricePerTroyOz: 2000,
    });
    // 5 * 0.5833 = 2.9165 g pure; /31.1034768 = 0.09376 ozt; *2000 = 187.528
    expect(value).toBeGreaterThan(187);
    expect(value).toBeLessThan(188);
    expect(audit.formula).toMatch(/pureGrams/);
    expect(audit.unit).toBe("USD");
  });
});

describe("cogs / margin / roi / breakeven", () => {
  it("cogs sums all components", () => {
    const { value } = cogs({ material: 100, labor: 20, overhead: 5, findings: 2, packaging: 3 });
    expect(value).toBe(130);
  });

  it("gross margin computes $ and %", () => {
    const { value, percent } = grossMargin(200, 130);
    expect(value).toBe(70);
    expect(percent).toBe(35);
  });

  it("roi is percentage gain over cost", () => {
    const { value } = roi(150, 100);
    expect(value).toBe(50);
  });

  it("breakeven units are integer ceiling", () => {
    const { units } = breakeven(500, 50, 30);
    expect(units).toBe(25);
  });

  it("breakeven returns Infinity when contribution margin is non-positive", () => {
    const { units } = breakeven(500, 20, 30);
    expect(units).toBe(Infinity);
  });
});
