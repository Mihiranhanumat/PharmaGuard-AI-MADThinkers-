import { VCFParseResult, VCFVariant } from "@/types/pharmacogenomics";

export function parseVCF(content: string): VCFParseResult {
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
  const errors: string[] = [];
  const variants: VCFVariant[] = [];
  const meta: Record<string, string> = {};
  let hasHeader = false;
  let headerFields: string[] = [];

  for (const line of lines) {
    if (line.startsWith("##")) {
      const match = line.match(/^##(\w+)=(.+)/);
      if (match) meta[match[1]] = match[2];
      continue;
    }

    if (line.startsWith("#CHROM")) {
      hasHeader = true;
      headerFields = line.substring(1).split("\t");
      continue;
    }

    if (!hasHeader) {
      errors.push("Missing VCF header line (#CHROM...)");
      continue;
    }

    const fields = line.split("\t");
    if (fields.length < 8) {
      errors.push(`Invalid line (expected >=8 fields): ${line.substring(0, 50)}`);
      continue;
    }

    const info = parseInfo(fields[7]);
    const variant: VCFVariant = {
      chrom: fields[0],
      pos: parseInt(fields[1], 10),
      id: fields[2],
      ref: fields[3],
      alt: fields[4],
      qual: fields[5],
      filter: fields[6],
      info,
      rsid: fields[2] !== "." ? fields[2] : info.RS ? `rs${info.RS}` : undefined,
      gene: info.GENE || undefined,
      starAllele: info.STAR || undefined,
    };

    variants.push(variant);
  }

  if (!hasHeader) {
    errors.push("No valid VCF header found");
  }

  // Check for fileformat
  if (!meta.fileformat?.startsWith("VCFv4")) {
    errors.push("VCF file format version not v4.x");
  }

  return {
    success: errors.length === 0 && variants.length > 0,
    variants,
    errors,
    meta,
  };
}

function parseInfo(infoStr: string): Record<string, string> {
  const info: Record<string, string> = {};
  if (infoStr === ".") return info;
  const pairs = infoStr.split(";");
  for (const pair of pairs) {
    const [key, value] = pair.split("=");
    info[key] = value || "true";
  }
  return info;
}

export function validateVCFFile(file: File): { valid: boolean; error?: string } {
  if (!file.name.endsWith(".vcf")) {
    return { valid: false, error: "File must have .vcf extension" };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: "File size exceeds 5MB limit" };
  }
  return { valid: true };
}
