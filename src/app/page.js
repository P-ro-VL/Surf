"use client";

import { AuthGuard } from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth";
import { teamService } from "@/services/team";
import { Sparkle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const navigate = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = authService.getAuthData();
    setUser(data);
  }, []);

  return (
    <AuthGuard>
      <div className="w-full h-screen flex items-center justify-center p-4">
        <div className="flex flex-col justify-between h-full">
          <a className="flex gap-2 items-center justify-center w-full">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Sparkle className="size-4" />
            </div>
            <div className="text-left text-sm leading-tight">
              <span className="truncate font-medium">The Light Studio</span>
            </div>
          </a>
          <div className="flex flex-col gap-4 items-center">
            <h1 className="text-5xl">
              Chào mừng trở lại, <b>{user?.name}</b>
            </h1>
            <h2 className="text-3xl">
              Sẵn sàng bắt đầu thực hiện công việc cùng đội nhóm của bạn!
            </h2>
            <Button
              className={
                "text-xl mt-20 py-4 h-12 cursor-pointer opacity-50 hover:opacity-100"
              }
              onClick={() => {
                const teams = teamService.getTeamData();
                navigate.push(`/board/${teams[0].teamName}`);
              }}
            >
              Bắt đầu công việc
            </Button>
          </div>
          <p className=" text-center">
            Copyright by The Light Studio 2025. All rights reserved.
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}
