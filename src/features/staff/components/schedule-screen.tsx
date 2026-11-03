"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useERP } from "@/lib/store";
import { today } from "@/lib/data";

import { Status } from "@/components/ui/status-badge";

export function Schedule({ notify }: { notify: (s: string) => void }) {
  const { db, save } = useERP();
  const staff = db.staff.find((s) => s.id === "t0")!;
  const [date, setDate] = useState(today());
  const [end, setEnd] = useState(today());
  const [reason, setReason] = useState("");
  return (
    <div className="grid-main">
      <section className="card">
        <h2>My weekly schedule</h2>
        {[
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].map((day, i) => (
          <div key={day} className="list-row">
            <strong className="grow">{day}</strong>
            <span>
              {i === Number(staff.off)
                ? "Weekly off"
                : `${staff.start}:00 – ${staff.end}:00`}
            </span>
            {i !== Number(staff.off) && (
              <span className="muted">
                Break {staff.breakStart}:00 – {staff.breakEnd}:00
              </span>
            )}
          </div>
        ))}
      </section>
      <section className="card">
        <h2>Request leave</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (end < date) {
              notify("End date must follow start date");
              return;
            }
            save("leaves", {
              id: crypto.randomUUID(),
              name: reason,
              staff: "t0",
              branch: staff.branch,
              date,
              endDate: end,
              status: "Pending",
            });
            notify("Leave request submitted");
            setReason("");
          }}
        >
          <div className="form-grid">
            <label>
              From
              <input
                required
                type="date"
                min={today()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label>
              To
              <input
                required
                type="date"
                min={date}
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </label>
            <label className="full">
              Reason
              <textarea
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </label>
          </div>
          <Button>Submit request</Button>
        </form>
        <h3 style={{ marginTop: 25 }}>My leave requests</h3>
        {db.leaves
          .filter((l) => l.staff === "t0")
          .map((l) => (
            <div className="list-row" key={l.id}>
              <div className="grow">
                <strong>{l.name}</strong>
                <p>
                  {l.date} – {l.endDate}
                </p>
              </div>
              <Status value={l.status} />
            </div>
          ))}
      </section>
    </div>
  );
}
