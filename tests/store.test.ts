import { test } from "node:test";
import assert from "node:assert/strict";
const memory = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: (k: string) => memory.get(k) || null,
    setItem: (k: string, v: string) => memory.set(k, v),
    removeItem: (k: string) => memory.delete(k),
  },
});
Object.defineProperty(globalThis, "window", {
  value: { localStorage: globalThis.localStorage },
});
test("role switching and persisted theme and records work", async () => {
  const { useERP } = await import("../src/lib/store");
  for (const role of ["admin", "receptionist", "staff", "customer"] as const) {
    useERP.getState().login(role);
    assert.equal(useERP.getState().role, role);
  }
  useERP.getState().toggle();
  assert.equal(useERP.getState().theme, "light");
  useERP.getState().setBranch("b1");
  assert.equal(useERP.getState().branch, "b1");
  const stored = JSON.parse(memory.get("maison-salon-erp-v1")!);
  assert.equal(stored.state.role, "customer");
  assert.equal(stored.state.theme, "light");
  useERP.getState().logout();
  assert.equal(useERP.getState().role, null);
});
