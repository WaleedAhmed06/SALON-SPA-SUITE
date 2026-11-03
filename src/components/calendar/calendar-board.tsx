"use client";
import { useERP } from "@/lib/store";
import { type RecordData, today } from "@/lib/data";
export function CalendarBoard({
  mode,
  date,
  appointments,
  open,
}: {
  mode: string;
  date: string;
  appointments: RecordData[];
  open: (a: RecordData) => void;
}) {
  const { db } = useERP();
  const selected = new Date((date || today()) + "T12:00:00");
  let days: Date[] = [];
  let padding = 0;
  if (mode === "Monthly") {
    const first = new Date(selected.getFullYear(), selected.getMonth(), 1, 12);
    padding = (first.getDay() + 6) % 7;
    days = Array.from(
      {
        length: new Date(
          selected.getFullYear(),
          selected.getMonth() + 1,
          0,
        ).getDate(),
      },
      (_, i) =>
        new Date(selected.getFullYear(), selected.getMonth(), i + 1, 12),
    );
  } else if (mode === "Weekly") {
    selected.setDate(selected.getDate() - ((selected.getDay() + 6) % 7));
    days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(selected);
      d.setDate(d.getDate() + i);
      return d;
    });
  } else days = [selected];
  return (
    <div className="calendar-scroll">
      <div className={"calendar-board " + (mode === "Daily" ? "daily" : "")}>
        <div className="calendar-weekdays">
          {(mode === "Daily"
            ? [selected.toLocaleDateString("en-PK", { weekday: "long" })]
            : [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ]
          ).map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="calendar-days">
          {Array.from({ length: padding }, (_, i) => (
            <div className="calendar-cell blank" key={"blank" + i} />
          ))}
          {days.map((day) => {
            const key = day.toLocaleDateString("en-CA");
            const rows = appointments
              .filter((a) => a.date === key)
              .sort((a, b) => String(a.time).localeCompare(String(b.time)));
            return (
              <section
                className={
                  "calendar-cell " + (key === today() ? "is-today" : "")
                }
                key={key}
              >
                <header>
                  {day.getDate()}{" "}
                  <small>
                    {day.toLocaleDateString("en-PK", { month: "short" })}
                  </small>
                  <span>{rows.length}</span>
                </header>
                {rows.map((a) => (
                  <button
                    className={
                      "calendar-event " +
                      String(a.status).toLowerCase().replaceAll(" ", "-")
                    }
                    key={a.id}
                    onClick={() => open(a)}
                  >
                    <strong>
                      {a.time} ·{" "}
                      {db.customers.find((c) => c.id === a.customer)?.name}
                    </strong>
                    <span>
                      {db.services.find((s) => s.id === a.service)?.name}
                    </span>
                    <span>
                      {db.staff.find((s) => s.id === a.staff)?.name} ·{" "}
                      {a.status}
                    </span>
                  </button>
                ))}
                {!rows.length && (
                  <p className="muted" style={{ fontSize: 10, marginTop: 15 }}>
                    No appointments
                  </p>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
