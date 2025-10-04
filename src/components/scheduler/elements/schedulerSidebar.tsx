import type { Person } from "@/src/payload-types.js";

interface SchedulerSidebarProps {
	people: (number | Person)[] | null | undefined;
}

function SchedulerSidebar(props: SchedulerSidebarProps) {
	if (props.people === undefined || props.people === null) {
		// TODO: Handle undefined case properly
		return <p>Loading...</p>;
	}

	return (
		<div className="w-48 border-r flex flex-col">
			<div className="flex-1 overflow-y-auto mt-24">
				{props.people.map((person) => {
					if (typeof person === "number") {
						throw new Error("Person is a number, expected Person object");
					}

					return (
						<div
							key={person.id}
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
