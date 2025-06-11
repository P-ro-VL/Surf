"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  Globe,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  Sparkle,
  SquareTerminal,
} from "lucide-react";

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
import { teamService } from "@/services/team";

export function AppSidebar({ ...props }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const data = {
      user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
      },
      navMain: [
        ...(teamService.getTeamData() ?? []).map((team) => ({
          title: team.teamName.charAt(0).toUpperCase() + team.teamName.slice(1),
          url: "#",
          icon: Globe,
          isActive: true,
          items: [
            {
              title: "Kanban",
              url: `/board/${team.teamName}`,
            },
            // {
            //   title: "Lịch họp",
            //   url: `/board/${team.teamName}/schedule`,
            // },
            // {
            //   title: "Golive",
            //   url: `/board/${team.teamName}/release`,
            // },
          ],
        })),
      ],
      navSecondary: [
        {
          title: "Support",
          url: "#",
          icon: LifeBuoy,
        },
        {
          title: "Feedback",
          url: "#",
          icon: Send,
        },
      ],
      projects: [
        {
          name: "Design Engineering",
          url: "#",
          icon: Frame,
        },
        {
          name: "Sales & Marketing",
          url: "#",
          icon: PieChart,
        },
        {
          name: "Travel",
          url: "#",
          icon: Map,
        },
      ],
    };
    setData(data);
  }, []);

  if (data == null) return <p>Loading...</p>;

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader className="mt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Sparkle className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">The Light Studio</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
