"use client";

import * as React from "react";
import { LayoutPanelLeft, Plus, ShieldEllipsis, Brain } from "lucide-react";

import { NavMain } from "@/components/nav-main";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "./ui/separator";
import UploadPdfFile from "./upload-pdf";
import Link from "next/link";
import { Progress } from "./ui/progress";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

const data = {
  navMain: [
    {
      title: "Workspace",
      url: "/dashboard",
      icon: LayoutPanelLeft,
    },
    {
      title: "Upgrade plan",
      url: "/dashboard/upgrade",
      icon: ShieldEllipsis,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const userPdfs = useQuery(api.fileStorage.getUserPdfs, {
    email: user?.primaryEmailAddress?.emailAddress as string,
  });

  const plan = useQuery(api.user.fetchUserPlan, {
    email: user?.primaryEmailAddress?.emailAddress as string,
  });

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Notely.ai</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator className="mb-5" />
      <UploadPdfFile
        limitReached={
          userPdfs && userPdfs?.length >= 5 && plan === "free" ? true : false
        }
      >
        <Plus />
        Upload PDF
      </UploadPdfFile>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {userPdfs && plan === "free" && (
          <div>
            <Progress value={(userPdfs.length / 5) * 100} />
            <div>{userPdfs?.length} out of 5 pdf</div>
          </div>
        )}
        {plan === "unlimited" && <h2>Unlimited</h2>}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
