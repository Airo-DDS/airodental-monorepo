import { Sidebar } from "../../components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-muted/20">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1">
          <div className="container max-w-7xl py-6 px-6 md:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 