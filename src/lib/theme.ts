/** Semantic colors shared by every portal, chart and native form control. */
export const themes = {
  dark: {
    bg: "#101c2b",
    panel: "#19283a",
    panel2: "#203249",
    line: "#344153",
    text: "#f1f4f8",
    muted: "#a4b0c2",
    accent: "#d5b477",
    ink: "#172132",
    green: "#77d8b9",
    warning: "#f0c779",
    danger: "#ff9caa",
    destructive: "#b63248",
    onDestructive: "#ffffff",
    overlay: "#02050bc2",
    shadow: "#00000066",
    chart1: "#d5b477",
    chart2: "#77d8b9",
    chart3: "#9cb9ec",
    chart4: "#c6a6df",
    chart5: "#f0a5b7",
    chart6: "#85ced3",
  },
  light: {
    bg: "#f6faf7",
    panel: "#ffffff",
    panel2: "#edf3f0",
    line: "#c6d3cc",
    text: "#172b23",
    muted: "#52665b",
    accent: "#24735e",
    ink: "#ffffff",
    green: "#24735e",
    warning: "#86550b",
    danger: "#b4233c",
    destructive: "#b4233c",
    onDestructive: "#ffffff",
    overlay: "#13271f66",
    shadow: "#183b2620",
    chart1: "#24735e",
    chart2: "#886518",
    chart3: "#365eaa",
    chart4: "#7954a2",
    chart5: "#b34266",
    chart6: "#137886",
  },
} as const;
export const chartColors = Array.from(
  { length: 6 },
  (_, i) => `var(--chart${i + 1})`,
);
export function themeVariables(theme: keyof typeof themes) {
  return Object.fromEntries(
    Object.entries(themes[theme]).map(([key, value]) => ["--" + key, value]),
  ) as Record<string, string>;
}
