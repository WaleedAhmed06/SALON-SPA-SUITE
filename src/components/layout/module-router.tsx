"use client";
import { type Collection, type Role } from "@/lib/data";
import dynamic from "next/dynamic";
const loading = () => (
  <div className="card" role="status" aria-live="polite">
    Loading workspace…
  </div>
);
const Records = dynamic(
  () => import("@/components/forms/record-management").then((m) => m.Records),
  { loading },
);
const Appointments = dynamic(
  () =>
    import("@/features/appointments/components/appointments-screen").then(
      (m) => m.Appointments,
    ),
  { loading },
);
const POS = dynamic(
  () => import("@/features/pos/components/pos-screen").then((m) => m.POS),
  { loading },
);
const Commissions = dynamic(
  () =>
    import("@/features/commissions/components/commissions-screen").then(
      (m) => m.Commissions,
    ),
  { loading },
);
const Schedule = dynamic(
  () =>
    import("@/features/staff/components/schedule-screen").then(
      (m) => m.Schedule,
    ),
  { loading },
);
const Notifications = dynamic(
  () =>
    import("@/features/notifications/components/notifications-screen").then(
      (m) => m.Notifications,
    ),
  { loading },
);
const Reports = dynamic(
  () =>
    import("@/features/reports/components/reports-screen").then(
      (m) => m.Reports,
    ),
  { loading },
);
const Profile = dynamic(
  () =>
    import("@/features/customers/components/profile-screen").then(
      (m) => m.Profile,
    ),
  { loading },
);
const mapping: Record<string, Collection> = {
  Branches: "branches",
  Services: "services",
  Staff: "staff",
  Customers: "customers",
  Inventory: "products",
  Suppliers: "suppliers",
  Expenses: "expenses",
  Memberships: "memberships",
};
export function Modules({
  page,
  role,
  notify,
  navigate,
}: {
  page: string;
  role: Role;
  notify: (m: string) => void;
  navigate: (page: string) => void;
}) {
  if (page === "Appointments")
    return <Appointments role={role} notify={notify} />;
  if (page === "Billing & POS") return <POS notify={notify} />;
  if (page === "Commissions")
    return <Commissions role={role} notify={notify} />;
  if (page === "Schedule") return <Schedule notify={notify} />;
  if (page === "Notifications") return <Notifications />;
  if (page === "Reports") return <Reports />;
  if (page === "My Profile") return <Profile notify={notify} />;
  if (mapping[page])
    return (
      <Records
        collection={mapping[page]}
        role={role}
        notify={notify}
        navigate={navigate}
      />
    );
  return null;
}
