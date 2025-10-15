"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { api } from "../../../../convex/_generated/api";

export type SidebarNavItem = {
  title: string;
  url: string;
};

interface SidebarNavProps {
  items?: SidebarNavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const schedules = useQuery(api.schedules.getUserSchedule);

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items
            ? items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>{item.title}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            : null}
        </SidebarMenu>
      </SidebarGroupContent>
      <SidebarGroupContent className="mt-6">
        <SidebarGroupLabel>Schedules</SidebarGroupLabel>
        {schedules ? (
          <div className="flex flex-col gap-2">
            {schedules?.map((schedule) => (
              <SidebarMenuItem key={schedule._id}>
                <SidebarMenuButton asChild>
                  <Link href={`/scheduler/${schedule._id}`}>
                    {schedule.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-12">
            <Spinner />
          </div>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
