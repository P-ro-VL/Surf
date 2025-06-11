"use client";

import { DEFAULT_URL } from "@/utils/constants";
import { authService } from "./auth";

const FIX_VERSION_API_URL = DEFAULT_URL + "v1/fix-version";

export const fixVersionService = {
  async createFixVersion(teamId, payload) {
    try {
      const response = await fetch(FIX_VERSION_API_URL + "/" + teamId, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authService.getAccessToken(),
        },
        body: JSON.stringify({
          payload,
        }),
      });

      const data = await response.json();

      if (data.meta.code === 200) {
        return data.data;
      }

      throw new Error(data.meta.message || "Đăng nhập thất bại");
    } catch (error) {
      throw error;
    }
  },

  async getAllFixVersions(teamId) {
    try {
      const response = await fetch(FIX_VERSION_API_URL + "/" + teamId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authService.getAccessToken(),
        },
      });

      const data = await response.json();

      if (data.meta.code === 200) {
        return data.data;
      }

      throw new Error(data.meta.message);
    } catch (error) {
      throw error;
    }
  },
};
