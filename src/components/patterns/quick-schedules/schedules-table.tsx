"use client";

import { useMutation, useQuery } from "convex/react";
import { Calendar, CalendarPlus, ChevronRightIcon, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import AddSchedulerDialog from "./add-scheduler-dialog";
import InvitePersonDialog from "./invite-person-dialog";

export function SchedulesTable() {
  const [openAddScheduleDialog, setOpenAddScheduleDialog] = useState(false);
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [currentScheduleId, setCurrentScheduleId] =
    useState<Id<"schedules"> | null>(null);

  const deleteSchedule = useMutation(api.schedules.deleteSchedule);
  const data = useQuery(api.schedules.getUserSchedule);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedules</CardTitle>
        <CardDescription>Manage your schedules</CardDescription>
        <CardAction>
          <Button
            variant="outline"
            onClick={() => setOpenAddScheduleDialog(true)}
          >
            <CalendarPlus />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {data && data.length === 0 && (
          <p className="flex justify-center items-center min-h-12">
            No schedules found. Create one!
          </p>
        )}

        {data ? (
          <div className="flex flex-col gap-2">
            {data?.map((schedule) => (
              <ContextMenu key={schedule._id}>
                <ContextMenuTrigger asChild>
                  <Item key={schedule._id} variant="outline" size="sm" asChild>
                    <Link href="#">
                      <ItemMedia>
                        <Calendar className="size-5" />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{schedule.name}</ItemTitle>
                      </ItemContent>
                      <ItemActions>
                        <ChevronRightIcon className="size-4" />
                      </ItemActions>
                    </Link>
                  </Item>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem
                    onClick={() => {
                      setOpenInviteDialog(true);
                      setCurrentScheduleId(schedule._id);
                    }}
                  >
                    <CalendarPlus className="size-4" />
                    Add Person to Schedule
                  </ContextMenuItem>
                  <ContextMenuItem
                    variant="destructive"
                    onClick={() => {
                      deleteSchedule({
                        scheduleId: schedule._id,
                      });
                    }}
                  >
                    <Trash className="size-4" />
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-12">
            <Spinner />
          </div>
        )}
      </CardContent>

      <AddSchedulerDialog
        open={openAddScheduleDialog}
        setOpen={setOpenAddScheduleDialog}
      />
      <InvitePersonDialog
        open={openInviteDialog}
        setOpen={setOpenInviteDialog}
        scheduleId={currentScheduleId}
      />
    </Card>
  );
}
