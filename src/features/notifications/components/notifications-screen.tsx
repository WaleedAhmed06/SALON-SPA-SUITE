"use client";

import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useERP } from "@/lib/store";

export function Notifications() {
  const { db, save } = useERP();
  return (
    <section className="card">
      <div className="card-head">
        <h2>Notification center</h2>
        <Button
          variant="outline"
          onClick={() =>
            db.notifications.forEach((n) =>
              save("notifications", { ...n, read: "yes" }),
            )
          }
        >
          Mark all read
        </Button>
      </div>
      {db.notifications.map((n) => (
        <div className="list-row" key={n.id}>
          <div className="avatar">
            <Check size={15} />
          </div>
          <div className="grow">
            <strong>{n.name}</strong>
            <p>
              {n.date} · {n.description || "Workspace update"}
            </p>
          </div>
          {n.read !== "yes" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => save("notifications", { ...n, read: "yes" })}
            >
              Mark read
            </Button>
          )}
        </div>
      ))}
    </section>
  );
}
