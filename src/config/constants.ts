export const GRAMS_PER_TROY_OZ = 31.1034768;
export const GRAMS_PER_PENNYWEIGHT = 1.55517384;
export const PENNYWEIGHTS_PER_TROY_OZ = GRAMS_PER_TROY_OZ / GRAMS_PER_PENNYWEIGHT;

export const KARAT_PURITY: Record<number, number> = {
  24: 0.9999,
  22: 0.9167,
  18: 0.75,
  14: 0.5833,
  10: 0.4167,
};

export const SILVER_FINENESS: Record<string, number> = {
  fine: 0.999,
  sterling: 0.925,
  coin: 0.9,
};

export const DEFAULT_CAD_TOLERANCE_MM = 0.075;
export const CAD_UNIT = "mm" as const;

export const CONFIDENCE_LEVELS = ["H", "M", "L"] as const;

export const DEFAULT_FOOTER = "Prepared by pro se plaintiff.";

export const ALL_MACROS = [
  "/vc",
  "/summons",
  "/demand",
  "/preserve",
  "/discovery",
  "/nta",
  "/aos",
  "/toc",
  "/pricing",
  "/csv",
  "/cad",
  "/torah",
  "/zohar",
  "/FAST",
  "/DEEP",
  "/EVIDENCE",
  "/HEALTHCHECK",
  "/DECIDE",
  "/EXPORT_JSON",
  "/CSV_ROWS",
  "/PY_SNIPPET",
  "/exhA",
  "/exhB",
  "/exhC",
  "/exhD",
  "/exhE",
  "/exhF",
  "/exhG",
  "/exhH",
  "/exhI",
  "/exhJ",
  "/exhK",
  "/exhL",
] as const;

export type MacroName = (typeof ALL_MACROS)[number];
