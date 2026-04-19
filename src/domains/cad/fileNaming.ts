export type CadExtension = "stl" | "obj" | "3dm" | "step" | "iges";

export interface FileNameInput {
  piece: string;
  size: string | number;
  version: number;
  ext?: CadExtension;
  prefix?: string;
}

function sanitize(segment: string): string {
  return segment
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^A-Za-z0-9_.-]/g, "")
    .replace(/_+/g, "_");
}

export function buildFileName(input: FileNameInput): string {
  const prefix = sanitize(input.prefix ?? "ANCONA");
  const piece = sanitize(String(input.piece || "PIECE"));
  const size = sanitize(String(input.size ?? "NA"));
  const v = `v${String(Math.max(0, Math.floor(input.version))).padStart(3, "0")}`;
  const ext = (input.ext ?? "stl").toLowerCase() as CadExtension;
  return `${prefix}_${piece}_${size}_${v}.${ext}`;
}

export function parseFileName(name: string): FileNameInput | null {
  const m = name.match(
    /^([A-Za-z0-9]+)_([A-Za-z0-9-]+)_([A-Za-z0-9.-]+)_v(\d{3})\.([A-Za-z0-9]+)$/,
  );
  if (!m) return null;
  return {
    prefix: m[1],
    piece: m[2],
    size: m[3],
    version: parseInt(m[4], 10),
    ext: m[5].toLowerCase() as CadExtension,
  };
}

export function bumpVersion(name: string): string | null {
  const parsed = parseFileName(name);
  if (!parsed) return null;
  return buildFileName({ ...parsed, version: parsed.version + 1 });
}
