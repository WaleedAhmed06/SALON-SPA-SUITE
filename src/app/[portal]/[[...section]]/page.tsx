import Home from "@/components/layout/portal-shell";
import { notFound } from "next/navigation";
import { access } from "@/features/auth/permissions";
import type { Role } from "@/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return (Object.keys(access) as Role[]).flatMap((portal) => [
    { portal, section: [] as string[] },
    ...access[portal].map((name) => ({
      portal,
      section: [name.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-")],
    })),
  ]);
}

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
