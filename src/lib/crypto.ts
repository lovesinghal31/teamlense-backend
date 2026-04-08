import crypto from "crypto";

interface InviteCodeOptions {
  teamName: string;
  leadId: string;
}

export function generateInviteCode({
  teamName,
  leadId,
}: InviteCodeOptions): string {
  if (!teamName || !leadId) {
    throw new Error("teamName and leadId are required");
  }

  const seed = `${teamName}-${leadId}-${Date.now()}`;

  const hash = crypto
    .createHash("sha256")
    .update(seed + crypto.randomBytes(8).toString("hex"))
    .digest("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();

  return hash.slice(0, 8);
}
