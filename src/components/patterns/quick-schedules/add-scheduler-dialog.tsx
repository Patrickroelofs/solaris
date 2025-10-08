"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useMutation } from "convex/react";
import { CalendarPlus } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { api } from "../../../../convex/_generated/api";
import { Button } from "../../ui/button";
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
import { Separator } from "../../ui/separator";

const FormSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export default function AddSchedulerDialog() {
  const createSchedule = useMutation(api.schedules.createSchedule);

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    await createSchedule({
      name: values.title,
      people: [],
    });
    setOpen(false);
  }

  const titleId = useId();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CalendarPlus />
        </Button>
      </DialogTrigger>
      <DialogContent aria-description="Add a new schedule to the scheduler">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create new Schedule</DialogTitle>

              <DialogDescription>
                Fill in the form below to create a new schedule.
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
              </div>
            </DialogHeader>
            <DialogFooter className="mt-12">
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Create Schedule</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
