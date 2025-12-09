import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/actions/user/get-current-user";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function Dashboard({ children }: ProtectedLayoutProps) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  return <>{children}</>;
}
