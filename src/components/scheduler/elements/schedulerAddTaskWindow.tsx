import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { submitNewTask } from "@/src/app/actions/submitNewTask";
import type { Person } from "@/src/payload-types";
import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../ui/dialog";
import { Form, FormField } from "../../ui/form";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../ui/select";
import { Separator } from "../../ui/separator";

const FormSchema = z.object({
	createdBy: z.string().min(1, "Created By is required"),
	title: z.string().min(1, "Title is required"),
	duration: z.string().min(1, "Duration is required"),
	date: z.date(),
});

interface SchedulerAddTaskWindowProps {
	people: (number | Person)[] | null | undefined;
}

function SchedulerAddTaskWindow({ people }: SchedulerAddTaskWindowProps) {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			createdBy: "", // Temporary variable
			title: "New Task",
			duration: "",
			date: new Date(),
		},
	});

	const mutation = useMutation({
		mutationFn: submitNewTask,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			setOpen(false);
			form.reset();
		},
		onError: (error) => {
			console.error("Failed to create task:", error);
		},
	});

	function onSubmit(values: z.infer<typeof FormSchema>) {
		mutation.mutate({
			createdBy: Number(values.createdBy),
			title: values.title,
			duration: Number(values.duration),
			date: format(values.date, "yyyy-MM-dd"),
			scheduleId: 1, // Temporary variable
		});
	}

	const createdById = useId();
	const titleId = useId();
	const durationId = useId();
	const dateId = useId();

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					Add Task
				</Button>
			</DialogTrigger>
			<DialogContent aria-description="Add a new task to the scheduler">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<DialogHeader>
							<DialogTitle>Add Task</DialogTitle>

							<DialogDescription>
								Fill in the form below to add a new task.
							</DialogDescription>

							<div className="grid gap-4">
								<Separator />
								<FormField
									control={form.control}
									name="createdBy"
									render={({ field }) => (
										<div className="grid gap-3">
											<Label htmlFor={createdById}>
												Created By (temporary)
											</Label>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<SelectTrigger id={createdById} className="w-full">
													<SelectValue placeholder="Created By" />
												</SelectTrigger>
												<SelectContent>
													{people?.map((person) => {
														if (typeof person === "number") {
															throw new Error(
																"Person is a number, expected Person object",
															);
														}

														return (
															<SelectItem
																key={person.id}
																value={String(person.id)}
															>
																{person.name}
															</SelectItem>
														);
													})}
												</SelectContent>
											</Select>
										</div>
									)}
								/>

								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<div className="grid gap-3">
											<Label htmlFor={titleId}>Title</Label>
											<Input id={titleId} {...field} />
										</div>
									)}
								/>

								<FormField
									control={form.control}
									name="duration"
									render={({ field }) => (
										<div className="grid gap-3">
											<Label htmlFor={durationId}>Duration</Label>
											<Input id={durationId} type="number" {...field} />
										</div>
									)}
								/>

								<FormField
									control={form.control}
									name="date"
									render={({ field }) => (
										<div className="grid gap-3">
											<Label htmlFor={dateId}>Date</Label>
											<Popover>
												<PopoverTrigger asChild>
													<Button
														id={dateId}
														variant="outline"
														data-empty={!field.value}
														className="w-full text-left items-start"
													>
														<CalendarIcon />
														{field.value ? (
															format(field.value, "PPP")
														) : (
															<span>Pick a date</span>
														)}
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0">
													<Calendar
														required
														mode="single"
														selected={field.value}
														onSelect={field.onChange}
													/>
												</PopoverContent>
											</Popover>
										</div>
									)}
								/>
							</div>
						</DialogHeader>
						<DialogFooter className="mt-12">
							<DialogClose asChild>
								<Button variant="outline" disabled={mutation.isPending}>
									Cancel
								</Button>
							</DialogClose>
							<Button type="submit" disabled={mutation.isPending}>
								{mutation.isPending ? "Creating..." : "Create Task"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default SchedulerAddTaskWindow;
