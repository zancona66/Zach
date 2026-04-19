import { readFile } from "node:fs/promises";

export interface PdfExtractArgs {
  path: string;
}

export interface PdfExtractResult {
  bytes: number;
  text: string;
  note?: string;
}

export async function extractPdfText(args: PdfExtractArgs): Promise<PdfExtractResult> {
  const buf = await readFile(args.path);
  const bytes = buf.byteLength;
  const snippet = buf
    .slice(0, 4096)
    .toString("latin1")
    .replace(/[^\x20-\x7E\r\n]/g, "")
    .slice(0, 2048);
  return {
    bytes,
    text: snippet,
    note:
      "PDF adapter is a stub. Install a real PDF parser (pdf-parse, pdfjs-dist) and replace this function to get full text.",
  };
}
