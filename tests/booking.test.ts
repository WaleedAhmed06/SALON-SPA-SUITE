import { test } from "node:test";
import assert from "node:assert/strict";
import { seed } from "../src/lib/data";
import { slots, validateBooking } from "../src/lib/business";
test("availability respects hours, breaks, off days and overlapping durations", () => {
  const d = seed();
  const date = "2027-01-04";
  d.appointments = [];
  const st = d.staff[0];
  st.off = 0;
  const available = slots(d, "t0", "s0", date);
  assert.ok(available.includes("09:00"));
  assert.ok(!available.includes("13:00"));
  assert.ok(!available.includes("19:45"));
  d.appointments.push({
    id: "conflict",
    name: "Test",
    branch: "b0",
    customer: "c0",
    service: "s0",
    staff: "t0",
    date,
    time: "09:00",
    status: "Confirmed",
    payment: "Unpaid",
  });
  assert.ok(!slots(d, "t0", "s0", date).includes("09:15"));
  assert.ok(slots(d, "t0", "s0", date).includes("09:30"));
  assert.equal(slots(d, "t0", "s0", "2027-01-03").length, 0);
});
test("invalid booking is rejected and reschedule excludes itself", () => {
  const d = seed();
  d.appointments = [];
  const a = {
    id: "test",
    name: "Test",
    branch: "b0",
    customer: "c0",
    service: "s0",
    staff: "t0",
    date: "2027-01-04",
    time: "09:00",
    status: "Confirmed",
    payment: "Unpaid",
  };
  assert.doesNotThrow(() => validateBooking(d, a));
  d.appointments.push(a);
  assert.doesNotThrow(() => validateBooking(d, a));
  assert.throws(() => validateBooking(d, { ...a, id: "other" }));
  assert.throws(() => validateBooking(d, { ...a, branch: "b1" }));
});
import { inCalendarRange } from "../src/lib/business";
test("calendar week includes exactly Monday through Sunday", () => {
  assert.equal(inCalendarRange("2026-11-02", "2026-11-04", "Weekly"), true);
  assert.equal(inCalendarRange("2026-11-08", "2026-11-04", "Weekly"), true);
  assert.equal(inCalendarRange("2026-11-01", "2026-11-04", "Weekly"), false);
  assert.equal(inCalendarRange("2026-11-09", "2026-11-04", "Weekly"), false);
});
test("availability respects branch opening and closing hours", () => {
  const d = seed();
  d.appointments = [];
  d.branches[0].hours = "11:00–17:00";
  const times = slots(d, "t0", "s0", "2027-01-04");
  assert.equal(times[0], "11:00");
  assert.equal(times.at(-1), "16:30");
  assert.ok(!times.includes("09:00"));
  d.branches[0].status = "Inactive";
  assert.equal(slots(d, "t0", "s0", "2027-01-04").length, 0);
});
