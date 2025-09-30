import type { User } from "@/src/payload-types.js";

interface SchedulerSidebarProps {
	users: User[] | undefined;
}

function SchedulerSidebar(props: SchedulerSidebarProps) {
	if (props.users === undefined) {
		// TODO: Handle undefined case properly
		return <p>Loading...</p>;
	}

	return (
		<div className="w-48 border-r flex flex-col">
			<div className="flex-1 overflow-y-auto mt-24">
				{props.users.map((user) => (
					<div
						key={user.id}
						className="p-6 h-32 border-b min-h-32 flex items-center first:border-t"
					>
						<p className="truncate">{user.name}</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default SchedulerSidebar;
