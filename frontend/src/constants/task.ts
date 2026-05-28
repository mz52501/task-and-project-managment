export const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

export const priorityColors: Record<string, string> = {
  Low: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-red-100 text-red-800",
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// fraction: 0 = gray, 0.5 = blue, 1 = green — hue goes 0 → 210 → 140
function stageHue(f: number): number {
  if (f <= 0.5) return lerp(0, 210, f * 2);
  return lerp(210, 140, (f - 0.5) * 2);
}

export function stageStrokeColor(fraction: number): string {
  const f = Math.max(0, Math.min(1, fraction));
  const hue = stageHue(f);
  const sat = f === 0 ? 0 : 55;
  const light = 65;
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

export function stageBadgeStyle(fraction: number): { backgroundColor: string; color: string } {
  const f = Math.max(0, Math.min(1, fraction));
  const hue = stageHue(f);
  const sat = f === 0 ? 0 : 50;
  return {
    backgroundColor: `hsl(${hue}, ${sat}%, ${f === 0 ? 93 : 88}%)`,
    color: `hsl(${hue}, ${f === 0 ? 20 : 60}%, 30%)`,
  };
}
