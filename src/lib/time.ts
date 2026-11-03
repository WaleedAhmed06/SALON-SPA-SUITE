export const minutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};
export const timeString = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
export function inCalendarRange(value: string, selected: string, view: string) {
  if (!selected) return true;
  if (view === "Monthly") return value.slice(0, 7) === selected.slice(0, 7);
  if (view === "Weekly") {
    const start = new Date(selected + "T12:00:00");
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return (
      value >= start.toLocaleDateString("en-CA") &&
      value <= end.toLocaleDateString("en-CA")
    );
  }
  return value === selected;
}
