import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { add, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

const FormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  duration: z.string().min(1, "Duration is required"),
  date: z.date(),
});

interface SchedulerAddTaskWindowProps {
  scheduleId: Id<"schedules">;
}

function SchedulerAddTaskWindow({ scheduleId }: SchedulerAddTaskWindowProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "New Task",
      duration: "",
      date: new Date(),
    },
  });

  const addTask = useMutation(api.tasks.addTask);

  function onSubmit(values: z.infer<typeof FormSchema>) {
    addTask({
      title: values.title,
      duration: parseInt(values.duration, 10),
      date: values.date.toISOString(),
      scheduleId: scheduleId,
    });
    setOpen(false);
    form.reset();
  }

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
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Add Task</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default SchedulerAddTaskWindow;
