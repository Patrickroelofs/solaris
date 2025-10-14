import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

interface SchedulerSidebarProps {
  scheduleId: Id<"schedules">;
}

function SchedulerSidebar(props: SchedulerSidebarProps) {
  const getUsers = useQuery(api.schedules.getScheduleUsers, {
    scheduleId: props.scheduleId,
  });

  if (!getUsers) {
    // TODO: Handle undefined case properly
    return <p>Loading...</p>;
  }

  return (
    <div className="w-48 border-r flex flex-col">
      <div className="flex-1 overflow-y-auto mt-24">
        {getUsers.map((person) => {
          if (typeof person === "number") {
            throw new Error("Person is a number, expected Person object");
          }

          return (
            <div
              key={person._id}
              className="p-6 h-32 border-b min-h-32 flex items-center first:border-t"
            >
              <p className="truncate">{person.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SchedulerSidebar;
