// Parse and format kitchen quantities: "2", "1.5", "1/2", "1 1/2", "½", "1-2".

const GLYPH_TO_VALUE: Record<string, number> = {
  '⅛': 1 / 8,
  '¼': 1 / 4,
  '⅓': 1 / 3,
  '⅜': 3 / 8,
  '½': 1 / 2,
  '⅝': 5 / 8,
  '⅔': 2 / 3,
  '¾': 3 / 4,
  '⅞': 7 / 8,
};

const STEPS: Array<[number, string]> = [
  [0, ''],
  [1 / 8, '⅛'],
  [1 / 4, '¼'],
  [1 / 3, '⅓'],
  [3 / 8, '⅜'],
  [1 / 2, '½'],
  [5 / 8, '⅝'],
  [2 / 3, '⅔'],
  [3 / 4, '¾'],
  [7 / 8, '⅞'],
  [1, ''],
];

function parseSingle(raw: string): number | null {
  let s = raw.trim();
  if (!s) return null;
  // "1½" or "1 ½" -> "1 1/2"
  s = s.replace(/[⅛¼⅓⅜½⅝⅔¾⅞]/g, (g) => ` ${GLYPH_TO_VALUE[g]}`).trim();
  const parts = s.split(/\s+/);
  let total = 0;
  for (const part of parts) {
    let v: number;
    if (/^\d+\/\d+$/.test(part)) {
      const [n, d] = part.split('/').map(Number);
      if (!d) return null;
      v = n / d;
    } else if (/^\d*\.?\d+$/.test(part)) {
      v = Number(part);
    } else {
      return null;
    }
    total += v;
  }
  return parts.length ? total : null;
}

/** Returns one number, or two for a range ("1-2"), or null if not a number. */
export function parseQuantity(raw: string | undefined | null): number[] | null {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!s) return null;
  const pieces = s.split(/\s*[-–]\s*/);
  if (pieces.length > 2) return null;
  const values = pieces.map(parseSingle);
  if (values.some((v) => v === null)) return null;
  return values as number[];
}

/** Format a number as a friendly kitchen quantity, e.g. 1.5 -> "1½". */
export function formatNumber(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return '0';
  if (n >= 10) return String(Math.round(n));
  let whole = Math.floor(n);
  const frac = n - whole;
  let best = STEPS[0];
  for (const step of STEPS) {
    if (Math.abs(step[0] - frac) < Math.abs(best[0] - frac)) best = step;
  }
  if (best[0] === 1) {
    whole += 1;
    best = STEPS[0];
  }
  if (whole === 0 && best[1] === '') return '⅛';
  return `${whole || ''}${best[1]}` || '0';
}

/** Scale a raw quantity string by a factor. Non-numeric quantities come back unchanged. */
export function scaleQuantity(raw: string | undefined | null, factor: number): string {
  const parsed = parseQuantity(raw);
  if (!parsed) return raw ? String(raw) : '';
  return parsed.map((v) => formatNumber(v * factor)).join('–');
}

export function isScalable(raw: string | undefined | null): boolean {
  return parseQuantity(raw) !== null;
}
