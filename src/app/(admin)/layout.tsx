import { redirect } from "next/navigation";
import { getSession, removeAuthCookie } from "@/lib/auth/jwt";
import { AdminShell } from "@/components/admin/admin-shell";

export const runtime = "nodejs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  const logoutAction = async () => {
    "use server";
    await removeAuthCookie();
    redirect("/login");
  };

  if (!session) {
    return <div className="min-h-screen bg-background grid-bg">{children}</div>;
  }

  return (
    <AdminShell username={session.username} logoutAction={logoutAction}>
      {children}
    </AdminShell>
  );
}
