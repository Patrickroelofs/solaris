"use client";

import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export type SidebarNavItem = {
  title: string;
  url: string;
};

interface SidebarNavProps {
  items?: SidebarNavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
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
    </SidebarGroup>
  );
}
