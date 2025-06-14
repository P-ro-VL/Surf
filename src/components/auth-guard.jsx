"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/services/auth";
import { teamService } from "@/services/team";

export function AuthGuard({ children }) {
  const navigate = useRouter();
  const location = usePathname();

  useEffect(() => {
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
      navigate.push("/login");
    } else if (location.pathname === "/login") {
      const teams = teamService.getTeamData();
      navigate.push(`/board/${teams[0].teamName}`);
    }
  }, [location.pathname, navigate]);

  return children;
}
