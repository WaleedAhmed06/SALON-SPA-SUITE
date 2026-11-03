import { type Collection, type RecordData } from "@/types";
export function validateRecord(collection: Collection, r: RecordData) {
  if (!r.name.trim()) throw Error("Name is required.");
  for (const key of [
    "price",
    "purchase",
    "amount",
    "quantity",
    "minimum",
    "salary",
    "outstanding",
    "discount",
    "commission",
    "sessions",
    "validity",
    "consumedQuantity",
  ])
    if (
      r[key] !== undefined &&
      (!Number.isFinite(Number(r[key])) || Number(r[key]) < 0)
    )
      throw Error(`${key} must be a non-negative number.`);
  for (const key of ["commission", "discount"])
    if (
      Number(r[key]) > 100 &&
      (key === "commission" || collection !== "services")
    )
      throw Error(`${key} cannot exceed 100%.`);
  if (collection === "services" && Number(r.duration) < 15)
    throw Error("Duration must be at least 15 minutes.");
  if (
    collection === "branches" &&
    !/^\d{1,2}:\d{2}\s*[-–—]\s*\d{1,2}:\d{2}$/.test(String(r.hours))
  )
    throw Error("Opening hours must use HH:MM–HH:MM.");
  if (
    collection === "staff" &&
    (Number(r.start) < 0 ||
      Number(r.end) > 24 ||
      Number(r.end) <= Number(r.start) ||
      Number(r.breakEnd) <= Number(r.breakStart))
  )
    throw Error("Enter valid working hours and break times.");
  if (r.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(r.email)))
    throw Error("Enter a valid email address.");
}
