import type { Assumption, ExhibitEntry } from "../../core/types.js";
import { assume } from "../../core/assumptions.js";
import {
  caption,
  causeOfAction,
  exhibitReferences,
  footer,
  numberedFacts,
  prayerForRelief,
  verification,
  type CaptionInput,
  type CauseOfActionInput,
} from "./filingFormatter.js";
import { nextExhibitTag } from "./exhibitRegister.js";

export interface DemandLetterInput {
  sender: string;
  senderAddress?: string;
  recipient: string;
  recipientAddress?: string;
  date: string;
  facts: string[];
  demand: string;
  deadline?: string;
  consequencesIfUnmet?: string;
  exhibits?: string[];
  footer?: string;
}

export function draftDemandLetter(input: DemandLetterInput): string {
  const parts: string[] = [];
  parts.push(`${input.date}`);
  parts.push("");
  parts.push(input.recipient);
  if (input.recipientAddress) parts.push(input.recipientAddress);
  parts.push("");
  parts.push(`Re: Demand for ${input.demand}`);
  parts.push("");
  parts.push(`Dear ${input.recipient}:`);
  parts.push("");
  parts.push("This letter constitutes a formal demand based on the following facts:");
  parts.push("");
  parts.push(numberedFacts({ facts: input.facts }));
  parts.push("");
  parts.push(
    `Accordingly, I hereby demand ${input.demand}${
      input.deadline ? ` no later than ${input.deadline}` : ""
    }.`,
  );
  if (input.consequencesIfUnmet) {
    parts.push("");
    parts.push(
      `Failure to comply will result in ${input.consequencesIfUnmet}, including but not limited to the commencement of litigation and pursuit of all available remedies at law and equity.`,
    );
  }
  if (input.exhibits && input.exhibits.length > 0) {
    parts.push("");
    parts.push(exhibitReferences(input.exhibits));
  }
  parts.push("");
  parts.push("This letter is sent without waiver of any rights or remedies, all of which are expressly reserved.");
  parts.push("");
  parts.push("Sincerely,");
  parts.push("");
  parts.push(input.sender);
  if (input.senderAddress) parts.push(input.senderAddress);
  if (input.footer) parts.push(footer(input.footer));
  return parts.join("\n");
}

export interface VerifiedComplaintInput {
  caption: CaptionInput;
  introduction?: string;
  parties: string[];
  jurisdictionVenue: string[];
  facts: string[];
  causesOfAction: CauseOfActionInput[];
  damages?: string[];
  prayer: string[];
  exhibits?: ExhibitEntry[];
  verificationCounty?: string;
  footer?: string;
}

export interface VerifiedComplaintOutput {
  document: string;
  assumptions: Assumption[];
  usedExhibitTags: string[];
}

export function draftVerifiedComplaint(
  input: VerifiedComplaintInput,
): VerifiedComplaintOutput {
  const assumptions: Assumption[] = [];
  const exhibits = input.exhibits ?? [];
  const usedTags = exhibits.map((e) => e.tag);

  if (!input.caption.court) {
    assumptions.push(
      assume("Filed in NY Supreme Court unless otherwise specified.", {
        basis: "Default jurisdiction for ZRA pro se filings.",
        impact: "medium",
        confidence: "M",
      }),
    );
  }
  if (!input.caption.county) {
    assumptions.push(
      assume("County caption left blank for attorney/filer to complete.", {
        impact: "low",
        confidence: "M",
      }),
    );
  }

  const parts: string[] = [];
  parts.push(caption(input.caption));
  parts.push("");
  if (input.introduction) {
    parts.push("PRELIMINARY STATEMENT");
    parts.push("");
    parts.push(input.introduction);
    parts.push("");
  }
  parts.push("PARTIES");
  parts.push(numberedFacts({ facts: input.parties }));
  parts.push("");
  parts.push("JURISDICTION AND VENUE");
  parts.push(
    numberedFacts({
      facts: input.jurisdictionVenue,
      startAt: input.parties.length + 1,
    }),
  );
  parts.push("");
  parts.push("FACTUAL ALLEGATIONS");
  parts.push(
    numberedFacts({
      facts: input.facts,
      startAt: input.parties.length + input.jurisdictionVenue.length + 1,
    }),
  );
  parts.push("");
  for (const coa of input.causesOfAction) {
    parts.push(causeOfAction(coa));
    parts.push("");
  }
  if (input.damages && input.damages.length > 0) {
    parts.push("DAMAGES");
    parts.push(numberedFacts({ facts: input.damages }));
    parts.push("");
  }
  parts.push(prayerForRelief(input.prayer));
  parts.push("");
  if (exhibits.length > 0) {
    parts.push("EXHIBIT REGISTER");
    parts.push(
      exhibits
        .map((e) => `  ${e.tag} — ${e.title}${e.description ? `: ${e.description}` : ""}`)
        .join("\n"),
    );
    parts.push("");
  }
  parts.push(verification(
    input.caption.plaintiff,
    input.verificationCounty ?? input.caption.county,
  ));
  if (input.footer) parts.push(footer(input.footer));

  return {
    document: parts.join("\n"),
    assumptions,
    usedExhibitTags: usedTags,
  };
}

export interface SummonsInput {
  caption: CaptionInput;
  defendants: string[];
  plaintiffAddress?: string;
  basisForVenue?: string;
  footer?: string;
}

export function draftSummons(input: SummonsInput): string {
  const parts: string[] = [];
  parts.push(caption({ ...input.caption, docTitle: "SUMMONS" }));
  parts.push("");
  parts.push(`To the above-named Defendant(s): ${input.defendants.join(", ")}`);
  parts.push("");
  parts.push(
    "YOU ARE HEREBY SUMMONED to answer the complaint in this action and to serve a copy of your answer on the plaintiff within twenty (20) days after service of this summons, exclusive of the day of service, or within thirty (30) days after completion of service where service is made in any other manner than by personal delivery within the State.",
  );
  parts.push("");
  parts.push(
    "In case of your failure to appear or answer, judgment will be taken against you by default for the relief demanded in the complaint.",
  );
  if (input.basisForVenue) {
    parts.push("");
    parts.push(`Basis of venue: ${input.basisForVenue}`);
  }
  if (input.plaintiffAddress) {
    parts.push("");
    parts.push(`Plaintiff's address: ${input.plaintiffAddress}`);
  }
  if (input.footer) parts.push(footer(input.footer));
  return parts.join("\n");
}

export interface PreservationLetterInput {
  date: string;
  sender: string;
  recipient: string;
  matter: string;
  scope: string[];
  footer?: string;
}

export function draftPreservationLetter(input: PreservationLetterInput): string {
  return [
    input.date,
    "",
    input.recipient,
    "",
    `Re: Preservation of Evidence — ${input.matter}`,
    "",
    "This letter serves as formal notice of your obligation to preserve evidence",
    "relevant to the above-referenced matter. You are directed to preserve, and",
    "not to destroy, alter, overwrite, or otherwise modify, the following:",
    "",
    ...input.scope.map((s, i) => `${i + 1}. ${s}`),
    "",
    "This duty extends to all custodians, employees, agents, and third parties",
    "within your control. Failure to preserve such evidence may give rise to",
    "sanctions and an adverse-inference instruction.",
    "",
    "Sincerely,",
    "",
    input.sender,
    input.footer ? footer(input.footer) : "",
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}

export interface DiscoveryInput {
  caption: CaptionInput;
  type: "interrogatories" | "document_requests" | "requests_for_admission";
  items: string[];
  footer?: string;
}

export function draftDiscovery(input: DiscoveryInput): string {
  const titleMap: Record<DiscoveryInput["type"], string> = {
    interrogatories: "PLAINTIFF'S FIRST SET OF INTERROGATORIES",
    document_requests: "PLAINTIFF'S FIRST REQUEST FOR PRODUCTION OF DOCUMENTS",
    requests_for_admission: "PLAINTIFF'S FIRST REQUESTS FOR ADMISSION",
  };
  return [
    caption({ ...input.caption, docTitle: titleMap[input.type] }),
    "",
    numberedFacts({ facts: input.items }),
    input.footer ? footer(input.footer) : "",
  ].join("\n");
}

export function allocateExhibit(
  existing: ExhibitEntry[],
  title: string,
  meta: Partial<ExhibitEntry> = {},
): ExhibitEntry {
  const tag = meta.tag ?? nextExhibitTag(existing);
  return { tag, title, ...meta };
}
