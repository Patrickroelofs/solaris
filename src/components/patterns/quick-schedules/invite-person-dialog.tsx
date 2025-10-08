"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useMutation } from "convex/react";
import { useId } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Form, FormField } from "../../ui/form";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Separator } from "../../ui/separator";

const FormSchema = z.object({
  email: z.email("Invalid email").min(1, "Email is required"),
});

interface InvitePersonDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  scheduleId?: Id<"schedules"> | null;
}

export default function InvitePersonDialog({
  open,
  setOpen,
  scheduleId,
}: InvitePersonDialogProps) {
  const addUserToSchedule = useMutation(api.schedules.addUserToSchedule);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    if (!scheduleId) return;

    await addUserToSchedule({
      scheduleId,
      email: values.email,
    });

    form.reset();
    setOpen(false);
  }

  const titleId = useId();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-description="Invite a person to the schedule">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Invite a Person</DialogTitle>

              <DialogDescription>
                Fill in the form below to invite a new person.
              </DialogDescription>

              <div className="grid gap-4">
                <Separator />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <div className="grid gap-3">
                      <Label htmlFor={titleId}>Email</Label>
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
              <Button type="submit">Invite user</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
