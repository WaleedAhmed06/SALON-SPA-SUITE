"use client";
import { useState, useEffect } from "react";

import { Plus, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useERP } from "@/lib/store";
import {
  type Role,
  type Collection,
  type RecordData,
  money,
  today,
} from "@/lib/data";
import { exportFile } from "@/lib/business";

import { Modal } from "@/components/ui/modal";
import { Status } from "@/components/ui/status-badge";
import { label } from "@/lib/labels";
import { fields, numeric } from "./record-fields";
import { Assignment } from "./assignment";
import { RecordDetail } from "./record-detail";
import { validateRecord } from "@/lib/validation";
export function Records({
  collection: c,
  role,
  notify,
  navigate,
}: {
  collection: Collection;
  role: Role;
  notify: (m: string) => void;
  navigate: (page: string) => void;
}) {
  const { db, branch, save, remove } = useERP();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<RecordData | null>(null);
  const [detail, setDetail] = useState<RecordData | null>(null);
  const [deleting, setDeleting] = useState<RecordData | null>(null);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [recordPage, setRecordPage] = useState(0);
  useEffect(() => {
    setSearch("");
    setCategory("");
    setRecordPage(0);
  }, [c]);
  const canEdit =
    role === "admin" || (role === "receptionist" && c === "customers");
  const records = db[c].filter(
    (r) =>
      (branch === "all" || r.branch === branch || r.branch === "all") &&
      JSON.stringify(r).toLowerCase().includes(search.toLowerCase()) &&
      (!category ||
        [r.category, r.status, r.tag, r.designation].includes(category)) &&
      (role !== "staff" ||
        c !== "services" ||
        db.staff.find((t) => t.id === "t0")?.services === "all" ||
        String(db.staff.find((t) => t.id === "t0")?.services)
          .split(",")
          .includes(r.id)) &&
      (role !== "customer" ||
        !["services", "memberships"].includes(c) ||
        r.status === "Active"),
  );
  const blank = (): RecordData => {
    const b: RecordData = {
      id: crypto.randomUUID(),
      name: "",
      branch: branch === "all" ? "b0" : branch,
    };
    for (const f of fields[c] || []) b[f] = numeric.includes(f) ? 0 : "";
    const defaults: Record<string, string | number> = {
      status: "Active",
      start: 9,
      end: 20,
      breakStart: 13,
      breakEnd: 14,
      off: 0,
      commission: 20,
      staff: "all",
      services: "all",
      branches: "all",
      price: 1500,
      duration: 30,
      quantity: 10,
      minimum: 5,
      validity: 90,
      sessions: 7,
      date: today(),
      supplier: db.suppliers[0]?.id || "",
      sku: "SKU-" + Date.now().toString().slice(-6),
      consumedQuantity: 1,
    };
    for (const f of fields[c] || [])
      if (defaults[f] !== undefined) b[f] = defaults[f];
    b.branch = branch === "all" ? "b0" : branch;
    if (c === "customers") {
      b.registered = today();
      b.points = 0;
      b.tag = "New Customer";
    }
    return b;
  };
  return (
    <>
      <div className="toolbar">
        <input
          aria-label="Search records"
          placeholder={`Search ${c}…`}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setRecordPage(0);
          }}
        />
        <select
          aria-label="Record category filter"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setRecordPage(0);
          }}
        >
          <option value="">All categories / statuses</option>
          {Array.from(
            new Set(
              db[c]
                .flatMap((r) => [r.category, r.status, r.tag, r.designation])
                .filter(Boolean),
            ),
          ).map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <span className="badge">{records.length} records</span>
        <div style={{ flex: 1 }} />
        {canEdit && (
          <Button
            onClick={() => {
              setEditing(blank());
              setError("");
            }}
          >
            <Plus size={15} />
            Add{" "}
            {c === "staff"
              ? "staff member"
              : c === "products"
                ? "product"
                : c.slice(0, -1)}
          </Button>
        )}
        <Button variant="outline" onClick={() => exportFile(c, records)}>
          <Download size={14} />
          CSV
        </Button>
      </div>
      <div className="records">
        {records.slice(recordPage * 18, recordPage * 18 + 18).map((r) => (
          <article className="card record" key={r.id}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="avatar">
                {r.image ? (
                  <img
                    src={String(r.image)}
                    alt={r.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  r.name
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")
                )}
              </div>
              <Status value={r.status || r.category || r.tag || "Active"} />
            </div>
            <h2>{r.name}</h2>
            <p>
              {r.description ||
                r.designation ||
                r.address ||
                r.benefits ||
                r.email ||
                r.category}
            </p>
            <p>
              {r.price
                ? money(Number(r.price))
                : r.amount
                  ? money(Number(r.amount))
                  : r.phone || ""}
              {r.duration ? ` · ${r.duration} min` : ""}
            </p>
            {c === "products" && (
              <p
                style={{
                  color:
                    Number(r.quantity) < Number(r.minimum)
                      ? "var(--danger)"
                      : "var(--green)",
                }}
              >
                {r.quantity} in stock · {r.sku}
              </p>
            )}
            <p>
              {db.branches.find((b) => b.id === r.branch)?.name ||
                "All branches"}
            </p>
            <div className="actions">
              <Button variant="outline" size="sm" onClick={() => setDetail(r)}>
                Details
              </Button>
              {canEdit && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditing({ ...r });
                      setError("");
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleting(r)}
                  >
                    Delete
                  </Button>
                </>
              )}
              {role === "customer" && c === "services" && (
                <Button
                  size="sm"
                  onClick={() => {
                    useERP.getState().startBooking(r.id);
                    navigate("Appointments");
                  }}
                >
                  Book this service
                </Button>
              )}
              {role === "customer" && c === "memberships" && (
                <Button size="sm" onClick={() => setDetail(r)}>
                  Purchase
                </Button>
              )}
            </div>
          </article>
        ))}
      </div>
      {records.length > 18 && (
        <div className="actions" style={{ marginTop: 20 }}>
          <Button
            variant="outline"
            disabled={recordPage === 0}
            onClick={() => setRecordPage(recordPage - 1)}
          >
            Previous
          </Button>
          <span className="muted">
            Page {recordPage + 1} of {Math.ceil(records.length / 18)}
          </span>
          <Button
            variant="outline"
            disabled={(recordPage + 1) * 18 >= records.length}
            onClick={() => setRecordPage(recordPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
      {!records.length && (
        <div className="empty">
          No matching records. Try a different search.
        </div>
      )}
      {editing && (
        <Modal
          title={`${db[c].some((r) => r.id === editing.id) ? "Edit" : "Add"} ${c}`}
          close={() => setEditing(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!editing.name.trim()) {
                setError("Name is required.");
                return;
              }
              if (
                c === "staff" &&
                (Number(editing.end) <= Number(editing.start) ||
                  Number(editing.breakEnd) <= Number(editing.breakStart))
              ) {
                setError(
                  "Working hours and break end must follow their start.",
                );
                return;
              }
              if (c === "services" && Number(editing.duration) < 15) {
                setError("Duration must be at least 15 minutes.");
                return;
              }
              try {
                validateRecord(c, editing);
                save(c, editing);
              } catch (err) {
                setError((err as Error).message);
                return;
              }
              notify(`${editing.name} saved`);
              setEditing(null);
            }}
          >
            <div className="form-grid">
              {(fields[c] || ["name"]).map((f) => (
                <label key={f}>
                  {label(f)}
                  {f === "consumedProduct" ? (
                    <select
                      value={editing[f] || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, [f]: e.target.value })
                      }
                    >
                      <option value="">No treatment stock consumption</option>
                      {db.products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  ) : f === "receipt" ? (
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 1500000) {
                          setError(
                            "Use a receipt under 1.5 MB for local demo storage.",
                          );
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = () =>
                          setEditing({
                            ...editing,
                            receipt: String(reader.result),
                          });
                        reader.readAsDataURL(file);
                      }}
                    />
                  ) : f === "staff" && c === "services" ? (
                    <Assignment
                      value={String(editing[f] || "all")}
                      records={db.staff}
                      onChange={(v) => setEditing({ ...editing, [f]: v })}
                    />
                  ) : f === "branches" ? (
                    <Assignment
                      value={String(editing[f] || "all")}
                      records={db.branches}
                      onChange={(v) => setEditing({ ...editing, [f]: v })}
                    />
                  ) : f === "services" && c === "staff" ? (
                    <Assignment
                      value={String(editing[f] || "all")}
                      records={db.services}
                      onChange={(v) => setEditing({ ...editing, [f]: v })}
                    />
                  ) : f === "branch" ? (
                    <select
                      value={editing[f]}
                      onChange={(e) =>
                        setEditing({ ...editing, [f]: e.target.value })
                      }
                    >
                      {db.branches.map((b) => (
                        <option value={b.id} key={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  ) : f === "status" ? (
                    <select
                      value={editing[f]}
                      onChange={(e) =>
                        setEditing({ ...editing, [f]: e.target.value })
                      }
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  ) : f === "supplier" ? (
                    <select
                      value={editing[f]}
                      onChange={(e) =>
                        setEditing({ ...editing, [f]: e.target.value })
                      }
                    >
                      {db.suppliers.map((b) => (
                        <option value={b.id} key={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={editing[f] ?? ""}
                      required={[
                        "name",
                        "email",
                        "phone",
                        "duration",
                        "price",
                      ].includes(f)}
                      type={
                        numeric.includes(f)
                          ? "number"
                          : f === "email"
                            ? "email"
                            : ["date", "dob", "joined"].includes(f)
                              ? "date"
                              : "text"
                      }
                      min={numeric.includes(f) ? 0 : undefined}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          [f]: numeric.includes(f)
                            ? Number(e.target.value)
                            : e.target.value,
                        })
                      }
                    />
                  )}
                </label>
              ))}
            </div>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <Button type="submit">Save changes</Button>
          </form>
        </Modal>
      )}
      {deleting && (
        <Modal title="Delete record?" close={() => setDeleting(null)}>
          <p className="muted">
            Delete {deleting.name}? Historical transactions remain for
            reporting.
          </p>
          <div className="actions" style={{ marginTop: 20 }}>
            <Button
              variant="destructive"
              onClick={() => {
                remove(c, deleting.id);
                notify("Record deleted");
                setDeleting(null);
              }}
            >
              Confirm delete
            </Button>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Keep record
            </Button>
          </div>
        </Modal>
      )}
      {detail && (
        <RecordDetail
          record={detail}
          collection={c}
          role={role}
          close={() => setDetail(null)}
          notify={notify}
        />
      )}
    </>
  );
}
