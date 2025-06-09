"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/services/auth";

export function AuthGuard({ children }) {
  const navigate = useRouter();
  const location = usePathname();

  useEffect(() => {
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
      navigate.push("/login");
    } else if (location.pathname === "/login") {
      navigate.push("/board");
    }
  }, [location.pathname, navigate]);

  return children;
}
