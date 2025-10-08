import { AppDashboard } from "@/components/layouts/dashboard/dashboard";
import { DashboardHeader } from "@/components/patterns/dashboard/header";
import { SchedulesTable } from "@/components/patterns/quick-schedules/schedules-table";

export default async function DashboardPage() {
  return (
    <AppDashboard>
      <DashboardHeader />
      <div className="grid grid-cols-3 gap-6 p-4">
        <SchedulesTable />
      </div>
    </AppDashboard>
  );
}
