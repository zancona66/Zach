export interface CaptionInput {
  court?: string;
  county?: string;
  index?: string;
  plaintiff: string;
  defendants: string[];
  docTitle: string;
}

export function caption(input: CaptionInput): string {
  const court = input.court ?? "SUPREME COURT OF THE STATE OF NEW YORK";
  const county = input.county ? `COUNTY OF ${input.county.toUpperCase()}` : "";
  const index = input.index ? `Index No. ${input.index}` : "Index No. ___________";
  const header = [court.toUpperCase(), county].filter(Boolean).join("\n");
  const v = `${input.plaintiff.toUpperCase()},\n\t\t\t\t\t\tPlaintiff,\n\n\t\t\t-against-\n\n${input.defendants
    .map((d) => d.toUpperCase())
    .join(",\n")},\n\t\t\t\t\t\tDefendants.`;
  return [
    header,
    "-----------------------------------------------------------X",
    v,
    "-----------------------------------------------------------X",
    index,
    "",
    input.docTitle.toUpperCase(),
  ].join("\n");
}

export interface NumberedFactsInput {
  facts: string[];
  startAt?: number;
}

export function numberedFacts({ facts, startAt = 1 }: NumberedFactsInput): string {
  return facts
    .map((f, i) => `${i + startAt}. ${f.trim().replace(/\s+/g, " ")}`)
    .join("\n");
}

export interface CauseOfActionInput {
  number: number;
  title: string;
  elements: string[];
  facts: string[];
  relief?: string;
}

export function causeOfAction(c: CauseOfActionInput): string {
  return [
    `AS AND FOR A ${ordinal(c.number)} CAUSE OF ACTION`,
    `(${c.title})`,
    "",
    numberedFacts({ facts: c.facts }),
    "",
    "Elements:",
    c.elements.map((e) => `  - ${e}`).join("\n"),
    c.relief ? `\nRelief: ${c.relief}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function ordinal(n: number): string {
  const s = ["TH", "ST", "ND", "RD"];
  const v = n % 100;
  const suffix = s[(v - 20) % 10] ?? s[v] ?? s[0];
  return `${n}${suffix}`;
}

export function prayerForRelief(items: string[]): string {
  return [
    "WHEREFORE, Plaintiff respectfully demands judgment against Defendants as follows:",
    ...items.map((it, i) => `\t${letter(i)}. ${it};`),
    "\ttogether with such other and further relief as this Court deems just and proper.",
  ].join("\n");
}

function letter(i: number): string {
  return String.fromCharCode("a".charCodeAt(0) + (i % 26));
}

export function verification(plaintiff: string, county?: string): string {
  return [
    "VERIFICATION",
    "",
    `STATE OF NEW YORK\t)`,
    `${county ? `COUNTY OF ${county.toUpperCase()}` : "COUNTY OF ____________"}\t) ss.:`,
    "",
    `${plaintiff.toUpperCase()}, being duly sworn, deposes and says:`,
    "",
    "I am the plaintiff in the above-captioned action. I have read the foregoing",
    "and know the contents thereof; the same is true to my own knowledge, except",
    "as to matters therein stated to be alleged upon information and belief, and",
    "as to those matters I believe them to be true.",
    "",
    "_________________________________",
    plaintiff,
    "",
    "Sworn to before me this ____ day of __________, 20____.",
    "",
    "_________________________________",
    "Notary Public",
  ].join("\n");
}

export function footer(text: string): string {
  return `\n---\n${text}\n`;
}

export function exhibitReferences(tags: string[]): string {
  if (tags.length === 0) return "";
  return `Exhibits referenced: ${tags.join(", ")}`;
}
