"use client";

import { DEFAULT_URL } from "@/utils/constants";

const AUTH_API_URL = DEFAULT_URL + "v1/user";
const AUTH_STORAGE_KEY = "auth_data";

export const authService = {
  async login(employeeId, password) {
    try {
      const response = await fetch(AUTH_API_URL + "/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          password,
        }),
      });

      const data = await response.json();

      if (data.meta.code === 200) {
        this.setAuthData(data.data);
        return data.data;
      }

      throw new Error(data.meta.message || "Đăng nhập thất bại");
    } catch (error) {
      throw error;
    }
  },

  async getAllTeamMembers(teamId) {
    try {
      const response = await fetch(AUTH_API_URL + "/" + teamId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.getAccessToken(),
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

  setAuthData(data) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  },

  getAuthData() {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  getAccessToken() {
    const data = this.getAuthData();
    return data?.accessToken;
  },

  isAuthenticated() {
    return !!this.getAccessToken();
  },

  logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem("team_data");
    localStorage.removeItem("ticket_data");
  },
};
