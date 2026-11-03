import Home from "@/components/layout/portal-shell";
import { notFound } from "next/navigation";
export default async function PortalPage({
  params,
}: {
  params: Promise<{ portal: string; section?: string[] }>;
}) {
  const { portal, section } = await params;
  if (!["admin", "receptionist", "staff", "customer"].includes(portal))
    notFound();
  return <Home portal={portal} section={section?.[0]} />;
}
