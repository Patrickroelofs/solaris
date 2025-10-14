"use client";

import { useQuery } from "convex/react";
import { AppSidebar } from "@/components/patterns/sidebar/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { api } from "../../../../convex/_generated/api";

interface AppDashboardProps {
  children?: React.ReactNode;
}

export function AppDashboard({ children }: AppDashboardProps) {
  const user = useQuery(api.user.getCurrentUser);

  return (
    <SidebarProvider>
      <AppSidebar
        navItems={[{ title: "Dashboard", url: "/dashboard" }]}
        user={{
          name: user?.name || "",
          email: user?.email || "",
          avatar: user?.image || "",
        }}
        variant="inset"
      />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
