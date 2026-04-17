import type { EvidenceEvent, ExhibitEntry, ChainOfCustodyEntry } from "../core/types.js";

export const demandLetterExample = {
  input: "/demand Draft a demand letter regarding outstanding invoice balance.",
  context: {
    demandLetter: {
      sender: "Zachary R. Ancona",
      senderAddress: "123 Diamond Row, New York, NY",
      recipient: "Acme Retailers, Inc.",
      recipientAddress: "500 Fifth Ave, New York, NY",
      date: "2026-04-17",
      facts: [
        "On 2025-10-01, Plaintiff delivered goods per Invoice #1042 totaling $18,750.",
        "Defendant accepted delivery and raised no objection to conformity.",
        "Defendant has failed to remit payment despite multiple written demands.",
      ],
      demand: "payment of $18,750 plus interest at the statutory rate",
      deadline: "2026-05-01",
      consequencesIfUnmet: "the commencement of a civil action in NY Supreme Court",
      exhibits: ["Exhibit A", "Exhibit B"],
    },
  },
};

export const verifiedComplaintExample = {
  input: "/vc Draft a verified complaint for breach of contract.",
  context: {
    verifiedComplaint: {
      caption: {
        plaintiff: "Zachary Robert Ancona",
        defendants: ["Acme Retailers, Inc."],
        docTitle: "Verified Complaint",
        county: "New York",
      },
      introduction:
        "This is an action for breach of contract arising out of goods sold and delivered.",
      parties: [
        "Plaintiff is an individual residing in New York County.",
        "Defendant is a domestic corporation with a principal place of business in New York County.",
      ],
      jurisdictionVenue: [
        "This Court has subject-matter jurisdiction pursuant to CPLR § 301.",
        "Venue is proper in New York County pursuant to CPLR § 503.",
      ],
      facts: [
        "Plaintiff and Defendant entered into a written contract dated 2025-09-01.",
        "Plaintiff delivered conforming goods on 2025-10-01.",
        "Defendant accepted the goods without objection.",
        "Defendant failed to pay the agreed sum.",
      ],
      causesOfAction: [
        {
          number: 1,
          title: "Breach of Contract",
          elements: [
            "Existence of a valid contract",
            "Plaintiff's performance",
            "Defendant's breach",
            "Resulting damages",
          ],
          facts: [
            "The contract was supported by consideration.",
            "Plaintiff fully performed.",
            "Defendant failed to pay the amount due.",
          ],
          relief: "Money damages of not less than $18,750, with interest.",
        },
      ],
      damages: [
        "Plaintiff suffered damages of $18,750 plus interest, costs, and disbursements.",
      ],
      prayer: [
        "money damages of not less than $18,750",
        "pre- and post-judgment interest",
        "costs and disbursements of this action",
      ],
    },
  },
};

export const pricingExample = {
  input: "/pricing Price a 14K yellow gold 5g band at spot $2,350 w/ 15% markup.",
  context: {
    pricing: {
      weight: 5,
      unit: "g",
      karat: 14,
      spotPricePerTroyOz: 2350,
      laborCost: 60,
      findings: 15,
      overhead: 25,
      markup: 15,
    },
  },
};

export const cadExample = {
  input: "/cad Create spec for a signet ring size 10 v1.",
  context: {
    cad: {
      piece: "SignetRing",
      size: "10",
      version: 1,
      dimensionsMm: {
        bandWidth: 4.5,
        bandThickness: 1.8,
        faceDiameter: 14.0,
      },
      alloyKarat: 14,
      ext: "stl",
    },
  },
};

export const evidenceExample = {
  input: "/EVIDENCE Build a timeline and flag contradictions.",
  context: {
    events: [
      {
        id: "e1",
        date: "2025-10-01",
        source: "Invoice #1042",
        summary: "Goods delivered to Acme.",
        exhibitTag: "Exhibit A",
        confidence: "H",
      },
      {
        id: "e2",
        date: "2025-10-02",
        source: "Email from Acme",
        summary: "Acme acknowledges receipt, no objection.",
        exhibitTag: "Exhibit B",
        confidence: "H",
      },
      {
        id: "e3",
        date: "2025-11-15",
        source: "Email from Acme",
        summary: "Acme disputes delivery.",
        exhibitTag: "Exhibit C",
        confidence: "M",
      },
    ] satisfies EvidenceEvent[],
    exhibits: [
      { tag: "Exhibit A", title: "Invoice #1042" },
      { tag: "Exhibit B", title: "Delivery acknowledgement email" },
      { tag: "Exhibit C", title: "Dispute email" },
    ] satisfies ExhibitEntry[],
    custody: [
      {
        exhibitTag: "Exhibit A",
        timestamp: "2025-10-01T14:00:00Z",
        actor: "ZRA",
        action: "created",
      },
      {
        exhibitTag: "Exhibit A",
        timestamp: "2025-10-02T09:00:00Z",
        actor: "ZRA",
        action: "stored",
        location: "encrypted drive",
      },
    ] satisfies ChainOfCustodyEntry[],
  },
};
