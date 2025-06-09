"use client";

import { authService } from "./auth";

const TICKET_API_URL = "http://localhost:8080/v1/ticket";
const TICKET_STORAGE_KEY = "ticket_data";

export const ticketService = {
  async getAllTickets(teamId) {
    try {
      const response = await fetch(TICKET_API_URL + "/" + teamId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getAccessToken()}`,
        },
      });

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

  setTicketData(data) {
    localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(data));
  },

  getTicketData() {
    const data = localStorage.getItem(TICKET_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },
};
