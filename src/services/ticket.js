"use client";

import { DEFAULT_URL } from "@/utils/constants";
import { authService } from "./auth";

const TICKET_API_URL = DEFAULT_URL + "v1/ticket";
const TICKET_STORAGE_KEY = "ticket_data";

export const ticketService = {
  async getAllTickets(teamId, type = null) {
    try {
      const response = await fetch(
        TICKET_API_URL + "/" + teamId + (type ? `?type=${type}` : ""),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authService.getAccessToken()}`,
          },
        }
      );

      const data = await response.json();
      if (data.meta.code === 200) {
        this.setTicketData(data.data);
        return data.data;
      }

      throw new Error(data.meta.message || "Đăng nhập thất bại");
    } catch (error) {
      throw error;
    }
  },

  async updateTicket(ticketId, ticket) {
    try {
      const response = await fetch(TICKET_API_URL + "/" + ticketId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getAccessToken()}`,
        },
        body: JSON.stringify(ticket),
      });

      const data = await response.json();
      if (data.meta.code === 200) {
        await this.getAllTickets(data.data.team.id);
        return data.data;
      }

      throw new Error(data.meta.message || "Đăng nhập thất bại");
    } catch (error) {
      throw error;
    }
  },

  async createTicket(ticket) {
    try {
      const response = await fetch(TICKET_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getAccessToken()}`,
        },
        body: JSON.stringify(ticket),
      });

      const data = await response.json();
      if (data.meta.code === 200) {
        await this.getAllTickets(ticket.teamId);
        return data.data;
      }

      throw new Error(data.meta.message || "Đăng nhập thất bại");
    } catch (error) {
      throw error;
    }
  },

  setTicketData(data) {
    localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(data));
  },

  getTicketData() {
    const data = localStorage.getItem(TICKET_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },
};
