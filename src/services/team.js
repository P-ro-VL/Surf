"use client";

import { DEFAULT_URL } from "@/utils/constants";
import { authService } from "./auth";

const TEAM_API_URL = DEFAULT_URL + "v1/team";
const TEAM_STORAGE_KEY = "team_data";

export const teamService = {
  async getAllTeams() {
    try {
      const response = await fetch(TEAM_API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getAccessToken()}`,
        },
      });

      const data = await response.json();

      if (data.meta.code === 200) {
        this.setTeamData(data.data);
        return data.data;
      }

      throw new Error(data.meta.message || "Đăng nhập thất bại");
    } catch (error) {
      throw error;
    }
  },

  setTeamData(data) {
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(data));
  },

  getTeamData() {
    const data = localStorage.getItem(TEAM_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },
};
