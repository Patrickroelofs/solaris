import { use } from "react";
import { AppDashboard } from "@/components/layouts/dashboard/dashboard";
import { DashboardHeader } from "@/components/patterns/dashboard/header";
import SchedulingTool from "@/components/patterns/scheduler/scheduler";
import type { Id } from "../../../../convex/_generated/dataModel";

export default function SchedulePage({
  params,
}: {
  params: Promise<{ scheduleId: Id<"schedules"> }>;
}) {
  const { scheduleId } = use(params);

  return (
    <AppDashboard>
      <DashboardHeader />
      <div>
        <SchedulingTool scheduleId={scheduleId} />
      </div>
    </AppDashboard>
  );
}
