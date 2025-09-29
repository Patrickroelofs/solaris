import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../ui/button";

interface SchedulerHeaderProps {
	currentWeekStart: Date;
	navigateWeek: (direction: "prev" | "next") => void;
	goToToday: () => void;
	getMonthYear: () => string;
	weekNumber: (date: Date) => number;
}

function SchedulerHeader(props: SchedulerHeaderProps) {
	return (
		<div className="border-b top-0 z-50">
			<div className="px-6 py-4">
				<div className="flex items-center justify-center">
					<div className="flex items-center gap-6">
						<div className="flex items-center gap-3">
							<Button
								variant="outline"
								size="sm"
								onClick={() => props.navigateWeek("prev")}
								className="h-9"
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<div className="text-center min-w-[200px]">
								<div className="text-sm font-medium ">
									{props.getMonthYear()}
								</div>
								<div className="text-xs">
									Week {props.weekNumber(props.currentWeekStart)} of{" "}
									{props.currentWeekStart.getFullYear()}
								</div>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => props.navigateWeek("next")}
								className="h-9"
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>

						<Button
							variant="outline"
							size="sm"
							onClick={props.goToToday}
							className="h-9"
						>
							Today
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SchedulerHeader;
