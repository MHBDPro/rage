import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/jwt";
import { LoginForm } from "@/components/admin/login-form";

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/admin");
  }

  return <LoginForm />;
}
