export const label = (s: string) =>
  s.replace(/([A-Z])/g, " $1").replace(/^./, (x) => x.toUpperCase());
