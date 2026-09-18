// src/components/messenger/utils.ts

const PALETTE = [
  "#7c8ce0", "#e07c9c", "#4fb0a5", "#e0a24f",
  "#6aa6e0", "#a06ae0", "#e06a6a", "#4fa06a",
];

export function hashColor(str: string): string {
  let h = 0;
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function pad(n: number): string {
  return n < 10 ? "0" + n : "" + n;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function parseLinks(text: string): Array<{ type: "text" | "link"; value: string }> {
  const parts: Array<{ type: "text" | "link"; value: string }> = [];
  const regex = /(https?:\/\/[^\s]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text))) {
    if (m.index > last) parts.push({ type: "text", value: text.slice(last, m.index) });
    parts.push({ type: "link", value: m[0] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: "text", value: text.slice(last) });
  return parts;
}