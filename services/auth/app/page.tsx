import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { LoggedInView } from "./_components/logged-in-view.client";

export default async function AuthRoot() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return <LoggedInView email={session.user.email ?? ""} />;
}
