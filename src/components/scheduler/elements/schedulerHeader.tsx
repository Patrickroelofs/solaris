import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../ui/button";

interface SchedulerHeaderProps {
	goToToday: () => void;
	setSelectedWeekNumber: (weekNum: number) => void;
	setSelectedYearNumber: (yearNum: number) => void;
	selectedWeekNumber: number;
	selectedYearNumber: number;
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
								onClick={() => {
									props.setSelectedWeekNumber(props.selectedWeekNumber - 1);

									if (props.selectedWeekNumber < 1) {
										props.setSelectedWeekNumber(52);
										props.setSelectedYearNumber(props.selectedYearNumber - 1);
									}
								}}
								className="h-9"
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<div className="text-center min-w-[200px]">
								<div className="text-sm font-medium ">
									{props.selectedYearNumber}
								</div>
								<div className="text-xs">
									Week {props.selectedWeekNumber} of {props.selectedYearNumber}
								</div>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									props.setSelectedWeekNumber(props.selectedWeekNumber + 1);

									if (props.selectedWeekNumber === 52) {
										props.setSelectedWeekNumber(1);
										props.setSelectedYearNumber(props.selectedYearNumber + 1);
									}
								}}
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
