import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "./_components/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <Sidebar userName={session.user.name} />
      <div className="flex-1 overflow-y-auto bg-ink-50">
        <div className="mx-auto max-w-5xl px-8 py-10">{children}</div>
      </div>
    </div>
  );
}
