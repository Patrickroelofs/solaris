import { AppDashboard } from "@/components/layouts/dashboard/dashboard";
import { DashboardHeader } from "@/components/patterns/dashboard/header";

export default async function DashboardPage() {
  return (
    <AppDashboard>
      <DashboardHeader />
    </AppDashboard>
  );
}
