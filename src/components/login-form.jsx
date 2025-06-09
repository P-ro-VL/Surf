"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/services/auth";
import { teamService } from "@/services/team";

export function LoginForm({ className, ...props }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.target);
    const employeeId = formData.get("id");
    const password = formData.get("password");

    try {
      await authService.login(employeeId, password);
      await teamService.getAllTeams();

      const teams = teamService.getTeamData();

      const teamMemberData = {};
      for (var team in teams) {
        const members = await authService.getAllTeamMembers(team.id);

        teamMemberData[team.name] = members;
      }
      localStorage.setItem("team_member_data", teamMemberData);

      navigate.push(`/board/${teams[0].teamName}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Đăng nhập tài khoản</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Nhập mã nhân sự bên dưới để tiếp tục
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="id">Mã nhân sự</Label>
          <Input
            id="id"
            name="id"
            type="text"
            placeholder="11223735"
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder=""
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Bắt đầu"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Không thể đăng nhập? Hãy liên hệ với quản lý trực tiếp.{" "}
      </div>
    </form>
  );
}
