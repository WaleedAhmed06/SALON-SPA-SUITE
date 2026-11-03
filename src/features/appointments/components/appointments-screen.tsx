"use client";
import { useState, useEffect } from "react";

import { Plus } from "lucide-react";
import { CalendarBoard } from "@/components/calendar/calendar-board";
import { Button } from "@/components/ui/button";
import { useERP } from "@/lib/store";
import { type Role, type RecordData, money, today } from "@/lib/data";
import {
  slots,
  inCalendarRange,
  minutes,
  timeString,
  completeAppointment,
  bookAppointment,
} from "@/lib/business";

import { Modal } from "@/components/ui/modal";
import { Status } from "@/components/ui/status-badge";
import { label } from "@/lib/labels";
import { CustomerPay } from "@/features/payments/components/customer-payment";
import { exportPdf } from "@/lib/export";
export function Appointments({
  role,
  notify,
}: {
  role: Role;
  notify: (m: string) => void;
}) {
  const { db, branch, save, bookingService, clearBooking } = useERP();
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [view, setView] = useState("List");
  const [editing, setEditing] = useState<RecordData | null>(null);
  const [detail, setDetail] = useState<RecordData | null>(null);
  const [error, setError] = useState("");
  const [walkin, setWalkin] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [filter, setFilter] = useState("");
  const rows = db.appointments.filter(
    (a) =>
      (branch === "all" || a.branch === branch) &&
      (role !== "staff" || a.staff === "t0") &&
      (role !== "customer" || a.customer === "c0") &&
      inCalendarRange(String(a.date), date, view) &&
      (!filter || a.status === filter) &&
      `${a.name} ${db.customers.find((c) => c.id === a.customer)?.name} ${db.services.find((s) => s.id === a.service)?.name}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const create = () => {
    setError("");
    setWalkin(false);
    setEditing({
      id: crypto.randomUUID(),
      name: "BK-" + Date.now().toString().slice(-7),
      branch: branch === "all" ? "b0" : branch,
      customer: "c0",
      service: bookingService || "s0",
      staff: "t0",
      date: today(),
      time: "",
      status: "Confirmed",
      payment: "Unpaid",
      paymentMethod: "Pay at Salon",
      notes: "",
    });
  };
  useEffect(() => {
    if (bookingService && role !== "staff") {
      create();
      clearBooking();
    }
  }, [bookingService]);
  const transition = (a: RecordData, status: string) => {
    try {
      if (status === "Completed")
        useERP
          .getState()
          .transact((current) => completeAppointment(current, a.id));
      else save("appointments", { ...a, status });
      notify(`${a.name}: ${status}`);
      setDetail({ ...a, status });
    } catch (err) {
      notify((err as Error).message);
    }
  };
  const options = editing
    ? db.staff.filter(
        (t) =>
          t.branch === editing.branch &&
          t.status === "Active" &&
          (t.services === "all" ||
            String(t.services).includes(String(editing.service))),
      )
    : [];
  return (
    <>
      <div className="toolbar">
        <input
          aria-label="Search appointments"
          placeholder="Search customer or booking…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          aria-label="Appointment date filter"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ width: 160 }}
        />
        <select
          aria-label="Calendar view"
          value={view}
          onChange={(e) => {
            setView(e.target.value);
            if (
              ["Daily", "Weekly", "Monthly"].includes(e.target.value) &&
              !date
            )
              setDate(today());
          }}
        >
          {[
            "List",
            "Daily",
            "Weekly",
            "Monthly",
            "Staff-wise",
            "Branch-wise",
            "Service-wise",
          ].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <select
          aria-label="Appointment status filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {[
            "Pending",
            "Confirmed",
            "Checked In",
            "In Progress",
            "Completed",
            "Cancelled",
            "No Show",
          ].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        {
          <Button onClick={create}>
            <Plus size={14} />
            Book appointment
          </Button>
        }
      </div>
      <div className="card">
        <div className="card-head">
          <h2>{view === "List" ? "All appointments" : view + " calendar"}</h2>
          <span className="badge">{rows.length} bookings</span>
        </div>
        {["Daily", "Weekly", "Monthly"].includes(view) ? (
          <CalendarBoard
            mode={view}
            date={date}
            appointments={rows}
            open={setDetail}
          />
        ) : view !== "List" ? (
          <div className="records">
            {Array.from(
              new Set(
                rows.map((a) =>
                  String(
                    view === "Staff-wise"
                      ? db.staff.find((s) => s.id === a.staff)?.name
                      : view === "Branch-wise"
                        ? db.branches.find((s) => s.id === a.branch)?.name
                        : view === "Service-wise"
                          ? db.services.find((s) => s.id === a.service)?.name
                          : a.date,
                  ),
                ),
              ),
            )
              .sort()
              .map((group) => (
                <section key={group} className="card">
                  <h3>{group}</h3>
                  {rows
                    .filter(
                      (a) =>
                        String(
                          view === "Staff-wise"
                            ? db.staff.find((s) => s.id === a.staff)?.name
                            : view === "Branch-wise"
                              ? db.branches.find((s) => s.id === a.branch)?.name
                              : view === "Service-wise"
                                ? db.services.find((s) => s.id === a.service)
                                    ?.name
                                : a.date,
                        ) === group,
                    )
                    .map((a) => (
                      <button
                        key={a.id}
                        className="list-row"
                        style={{
                          width: "100%",
                          background: "transparent",
                          borderLeft: 0,
                          borderRight: 0,
                          borderTop: 0,
                          color: "var(--text)",
                          textAlign: "left",
                        }}
                        onClick={() => setDetail(a)}
                      >
                        <div className="grow">
                          <strong>
                            {a.time} ·{" "}
                            {
                              db.customers.find((c) => c.id === a.customer)
                                ?.name
                            }
                          </strong>
                          <p>
                            {db.services.find((s) => s.id === a.service)?.name}
                          </p>
                        </div>
                        <Status value={a.status} />
                      </button>
                    ))}
                </section>
              ))}
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Booking / customer</th>
                  <th>Service / therapist</th>
                  <th>Branch</th>
                  <th>Date / time</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id}>
                    <td>
                      {a.name}
                      <small>
                        {db.customers.find((c) => c.id === a.customer)?.name}
                      </small>
                    </td>
                    <td>
                      {db.services.find((s) => s.id === a.service)?.name}
                      <small>
                        {db.staff.find((s) => s.id === a.staff)?.name}
                      </small>
                    </td>
                    <td>{db.branches.find((b) => b.id === a.branch)?.name}</td>
                    <td>
                      {a.date}
                      <small>{a.time}</small>
                    </td>
                    <td>
                      <Status value={a.status} />
                    </td>
                    <td>
                      <Status value={a.payment} />
                    </td>
                    <td>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDetail(a)}
                      >
                        Open
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!rows.length && (
          <div className="empty">
            No appointments in this view. Try clearing the filters.
          </div>
        )}
      </div>
      {editing && (
        <Modal
          title={
            db.appointments.some((a) => a.id === editing.id)
              ? "Reschedule appointment"
              : "Book an appointment"
          }
          close={() => setEditing(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              try {
                const a = { ...editing };
                let newCustomer: RecordData | undefined;
                if (walkin) {
                  if (!customerName.trim() || !customerPhone.trim())
                    throw Error("Customer name and phone are required.");
                  newCustomer = {
                    id: crypto.randomUUID(),
                    name: customerName,
                    phone: customerPhone,
                    branch: a.branch,
                    email: "",
                    points: 0,
                    registered: today(),
                    tag: "New Customer",
                  };
                  a.customer = newCustomer.id;
                  a.walkin = "yes";
                }
                useERP
                  .getState()
                  .transact((current) =>
                    bookAppointment(current, a, newCustomer),
                  );
                const booked = useERP
                  .getState()
                  .db.appointments.find((x) => x.id === a.id)!;
                notify(`Appointment confirmed: ${a.name}. Staff notified.`);
                setEditing(null);
                setDetail(booked);
              } catch (err) {
                setError((err as Error).message);
              }
            }}
          >
            <div className="form-grid">
              <label>
                1. Branch
                <select
                  value={editing.branch}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      branch: e.target.value,
                      staff: "",
                      time: "",
                    })
                  }
                >
                  {db.branches
                    .filter((b) => b.status === "Active")
                    .map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                </select>
              </label>
              <label>
                2. Service
                <select
                  value={editing.service}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      service: e.target.value,
                      time: "",
                    })
                  }
                >
                  {db.services
                    .filter(
                      (v) =>
                        v.status === "Active" &&
                        (v.branches === "all" ||
                          !v.branches ||
                          String(v.branches).includes(String(editing.branch))),
                    )
                    .map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} · {money(Number(v.price))} · {v.duration} min
                      </option>
                    ))}
                </select>
              </label>
              <label>
                3. Preferred therapist
                <select
                  required
                  value={editing.staff}
                  onChange={(e) => {
                    const id =
                      e.target.value === "any"
                        ? options.find(
                            (t) =>
                              slots(
                                db,
                                t.id,
                                String(editing.service),
                                String(editing.date),
                                editing.id,
                              ).length,
                          )?.id || ""
                        : e.target.value;
                    setEditing({ ...editing, staff: id, time: "" });
                  }}
                >
                  <option value="">Select therapist</option>
                  <option value="any">Any available therapist</option>
                  {options.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                4. Date
                <input
                  required
                  type="date"
                  min={today()}
                  value={editing.date}
                  onChange={(e) =>
                    setEditing({ ...editing, date: e.target.value, time: "" })
                  }
                />
              </label>
              <label className="full">
                5. Available time slot
                <select
                  required
                  value={editing.time}
                  onChange={(e) =>
                    setEditing({ ...editing, time: e.target.value })
                  }
                >
                  <option value="">Select an available slot</option>
                  {slots(
                    db,
                    String(editing.staff),
                    String(editing.service),
                    String(editing.date),
                    editing.id,
                  ).map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <span>
                  Working hours, breaks, days off, leave and existing bookings
                  are respected.
                </span>
              </label>
              {role !== "customer" && (
                <label className="full">
                  6. Customer
                  <select
                    value={walkin ? "walkin" : editing.customer}
                    onChange={(e) => {
                      setWalkin(e.target.value === "walkin");
                      setEditing({ ...editing, customer: e.target.value });
                    }}
                  >
                    <option value="walkin">
                      + Register a walk-in customer
                    </option>
                    {db.customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} · {c.phone}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {walkin && (
                <>
                  <label>
                    Walk-in name
                    <input
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </label>
                  <label>
                    Phone
                    <input
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </label>
                </>
              )}
              {role === "customer" && (
                <label className="full">
                  Payment option
                  <select
                    value={editing.paymentMethod || "Pay at Salon"}
                    onChange={(e) =>
                      setEditing({ ...editing, paymentMethod: e.target.value })
                    }
                  >
                    {[
                      "Pay at Salon",
                      "Card",
                      "JazzCash",
                      "Easypaisa",
                      "Bank Transfer",
                    ].map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                  <span>
                    All online payments are simulated. No payment credentials
                    required.
                  </span>
                </label>
              )}
              {role === "customer" &&
                db.enrollments.some(
                  (e) =>
                    e.customer === "c0" &&
                    Number(e.remaining) > 0 &&
                    String(e.expires) >= String(editing.date),
                ) && (
                  <label>
                    Use prepaid session
                    <select
                      value={editing.usePackage || "no"}
                      onChange={(e) =>
                        setEditing({ ...editing, usePackage: e.target.value })
                      }
                    >
                      <option value="no">Pay separately</option>
                      <option value="yes">Redeem one remaining session</option>
                    </select>
                  </label>
                )}
              <label className="full">
                Service notes
                <textarea
                  value={editing.notes}
                  onChange={(e) =>
                    setEditing({ ...editing, notes: e.target.value })
                  }
                />
              </label>
            </div>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <Button type="submit">Confirm booking</Button>
          </form>
        </Modal>
      )}
      {detail && (
        <Modal title={`Booking ${detail.name}`} close={() => setDetail(null)}>
          <div className="form-grid">
            {[
              "customer",
              "service",
              "staff",
              "branch",
              "date",
              "time",
              "status",
              "payment",
            ].map((k) => (
              <div key={k}>
                <p className="muted" style={{ fontSize: 11, marginBottom: 6 }}>
                  {label(k)}
                </p>
                <p>
                  {String(
                    k === "customer"
                      ? db.customers.find((c) => c.id === detail.customer)?.name
                      : k === "service"
                        ? db.services.find((c) => c.id === detail.service)?.name
                        : k === "staff"
                          ? db.staff.find((c) => c.id === detail.staff)?.name
                          : k === "branch"
                            ? db.branches.find((c) => c.id === detail.branch)
                                ?.name
                            : detail[k],
                  )}
                </p>
              </div>
            ))}
          </div>
          <p className="muted">Notes: {detail.notes || "No notes"}</p>
          {role === "staff" && (
            <p className="muted" style={{ marginTop: 12 }}>
              Preferences:{" "}
              {db.customers.find((c) => c.id === detail.customer)?.notes} ·
              Allergies:{" "}
              {db.customers.find((c) => c.id === detail.customer)?.allergies ||
                "None reported"}
            </p>
          )}
          <div className="actions" style={{ marginTop: 20 }}>
            {["admin", "receptionist"].includes(role) &&
              detail.status === "Pending" && (
                <Button onClick={() => transition(detail, "Confirmed")}>
                  Confirm appointment
                </Button>
              )}
            {role !== "customer" &&
              ["Pending", "Confirmed"].includes(String(detail.status)) && (
                <Button onClick={() => transition(detail, "Checked In")}>
                  Check in
                </Button>
              )}
            {role !== "customer" && detail.status === "Checked In" && (
              <Button onClick={() => transition(detail, "In Progress")}>
                Start service
              </Button>
            )}
            {role !== "customer" && detail.status === "In Progress" && (
              <Button onClick={() => transition(detail, "Completed")}>
                Complete service
              </Button>
            )}
            {role !== "staff" &&
              !["Cancelled", "Completed", "No Show"].includes(
                String(detail.status),
              ) && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditing({ ...detail });
                      setError("");
                      setDetail(null);
                    }}
                  >
                    Reschedule
                  </Button>
                  {
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (confirm("Cancel this appointment?"))
                          transition(detail, "Cancelled");
                      }}
                    >
                      Cancel
                    </Button>
                  }
                  {role !== "customer" && (
                    <Button
                      variant="ghost"
                      onClick={() => transition(detail, "No Show")}
                    >
                      No show
                    </Button>
                  )}
                </>
              )}
            {role === "customer" && (
              <Button
                variant="outline"
                onClick={() => {
                  const copy = {
                    ...detail,
                    id: crypto.randomUUID(),
                    name: "BK-" + Date.now().toString().slice(-7),
                    date: today(),
                    time: "",
                    status: "Confirmed",
                    payment: "Unpaid",
                  };
                  setEditing(copy);
                  setDetail(null);
                }}
              >
                Book again
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() =>
                exportPdf(`Booking ${detail.name}`, [
                  {
                    name: detail.name,
                    customer:
                      db.customers.find((c) => c.id === detail.customer)
                        ?.name || "",
                    branch:
                      db.branches.find((b) => b.id === detail.branch)?.name ||
                      "",
                    service:
                      db.services.find((s) => s.id === detail.service)?.name ||
                      "",
                    staff:
                      db.staff.find((s) => s.id === detail.staff)?.name || "",
                    date: detail.date,
                    time: detail.time,
                    duration:
                      db.services.find((s) => s.id === detail.service)
                        ?.duration || 0,
                    status: detail.status,
                    payment: detail.payment,
                  },
                ])
              }
            >
              Download confirmation PDF
            </Button>
          </div>
          {role !== "customer" && (
            <label style={{ marginTop: 20 }}>
              Service notes
              <textarea
                defaultValue={detail.notes}
                onBlur={(e) => {
                  save("appointments", { ...detail, notes: e.target.value });
                  setDetail({ ...detail, notes: e.target.value });
                }}
              />
            </label>
          )}
          {role === "customer" &&
            detail.payment !== "Paid" &&
            !["Cancelled", "No Show"].includes(String(detail.status)) && (
              <CustomerPay
                appointment={detail}
                notify={notify}
                done={(a) => setDetail(a)}
              />
            )}
          <p className="muted" style={{ marginTop: 15 }}>
            Duration:{" "}
            {db.services.find((s) => s.id === detail.service)?.duration} min ·
            End time:{" "}
            {timeString(
              minutes(String(detail.time)) +
                Number(
                  db.services.find((s) => s.id === detail.service)?.duration ||
                    0,
                ),
            )}
          </p>
          {role !== "customer" && (
            <label style={{ marginTop: 20 }}>
              Internal notes (team only)
              <textarea
                defaultValue={detail.internalNotes || ""}
                onBlur={(e) => {
                  save("appointments", {
                    ...detail,
                    internalNotes: e.target.value,
                  });
                  setDetail({ ...detail, internalNotes: e.target.value });
                }}
              />
            </label>
          )}
          <h3 style={{ marginTop: 20 }}>Customer visit history</h3>
          {db.appointments
            .filter((a) => a.customer === detail.customer && a.id !== detail.id)
            .slice(0, 5)
            .map((a) => (
              <p
                className="muted"
                key={a.id}
                style={{ marginTop: 8, fontSize: 12 }}
              >
                {a.date} · {db.services.find((s) => s.id === a.service)?.name} ·{" "}
                {a.status}
              </p>
            ))}
        </Modal>
      )}
    </>
  );
}
