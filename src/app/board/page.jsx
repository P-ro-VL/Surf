"use client";

import { AuthGuard } from "@/components/auth-guard";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
      navigate.push("/login");
    } else {
      const teams = teamService.getTeamData();
      navigate.push(`/board/${teams[0].teamName}`);
    }
  }, [location.pathname, navigate]);

  return <AuthGuard></AuthGuard>;
}
