import SchedulingTool from "@/src/components/scheduler/scheduler";
import { payload } from "@/src/lib/getPayloadConfig";

export default async function HomePage() {
  const tasks = await payload.find({
    collection: 'tasks',
  });

  const users = await payload.find({
    collection: 'users',
  })

  return (
    <SchedulingTool users={users.docs} tasks={tasks.docs} />
  )
}
