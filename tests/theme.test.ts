import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { themes } from "../src/lib/theme";
function luminance(hex: string) {
  const rgb = hex
    .slice(1)
    .match(/../g)!
    .map((x) => parseInt(x, 16) / 255)
    .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(a: string, b: string) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
test("both themes meet normal-text contrast on every surface", () => {
  for (const [name, t] of Object.entries(themes)) {
    for (const surface of ["bg", "panel", "panel2"] as const)
      for (const color of [
        "text",
        "muted",
        "accent",
        "green",
        "warning",
        "danger",
      ] as const)
        assert.ok(
          contrast(t[color], t[surface]) >= 4.5,
          `${name} ${color} on ${surface}: ${contrast(t[color], t[surface])}`,
        );
    assert.ok(contrast(t.ink, t.accent) >= 4.5);
    assert.ok(contrast(t.onDestructive, t.destructive) >= 4.5);
  }
});
test("CSS variables match shared theme tokens and charts use semantic colors", () => {
  const css = readFileSync("src/app/globals.css", "utf8");
  for (const [name, t] of Object.entries(themes)) {
    const block =
      name === "dark"
        ? css.slice(css.indexOf(":root"), css.indexOf("\n* {"))
        : css.slice(
            css.indexOf('[data-theme="light"]'),
            css.indexOf("\nbutton,"),
          );
    for (const [key, value] of Object.entries(t))
      assert.ok(block.includes(`--${key}: ${value};`), `${name}: ${key}`);
  }
  const insights = readFileSync(
    "src/features/dashboard/components/insights.tsx",
    "utf8",
  );
  assert.ok(insights.includes("chartColors"));
  assert.ok(!/#[a-f0-9]{6}/i.test(insights));
});
