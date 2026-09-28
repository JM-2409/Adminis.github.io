import { SuperAdminSidebar } from "@/components/layout/SuperAdminSidebar";
import { SuperAdminHeader } from "@/components/layout/SuperAdminHeader";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-sans">
      <SuperAdminSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <SuperAdminHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-slate-900">{children}</main>
      </div>
    </div>
  );
}
