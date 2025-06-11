"use client";

import { authService } from "@/services/auth";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { fixVersionService } from "@/services/fixVersion";
import { ticketService } from "@/services/ticket";

export default function EditTicketDialog({ children, ticket, callback }) {
  const [isOpen, setIsOpen] = useState(false);

  const [teamMembers, setTeamMembers] = useState([]);
  const [fixVersions, setFixVersions] = useState([]);

  const [ticketName, setTicketName] = useState(ticket.ticketName);
  const [assignee, setAssignee] = useState(ticket.assignee?.id);
  const [labels, setLabels] = useState(ticket.labels.join(","));
  const [storyPoints, setStoryPoints] = useState(ticket.storyPoints);
  const [fixVersion, setFixVersion] = useState(ticket.fixVersion?.id);
  const [dueDate, setDueDate] = useState(ticket.dueDate.split("T")[0]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      const response = await authService.getAllTeamMembers(ticket.team.id);
      setTeamMembers(response);
    };

    const fetchFixVersions = async () => {
      const response = await fixVersionService.getAllFixVersions(
        ticket.team.id
      );
      setFixVersions(response);
    };

    fetchTeamMembers();
    fetchFixVersions();
  }, []);

  // Functions
  async function handleSubmit() {
    const payload = {
      ticketName: ticketName,
      assigneeId: teamMembers.find((member) => member.id === assignee)?.id,
      labels: labels.split(","),
      dueDate: new Date(dueDate).toISOString(),
      storyPoints: storyPoints,
      fixVersionId: fixVersions.find((version) => version.id === fixVersion)
        ?.id,
    };

    await ticketService.updateTicket(ticket.uuid, payload);
    alert("Cập nhật thành công");
    setIsOpen(false);

    callback(
      ticketName,
      teamMembers.find((member) => member.id === assignee),
      dueDate,
      storyPoints,
      labels.split(","),
      fixVersions.find((version) => version.id === fixVersion)
    );

    console.log(assignee);
    console.log(fixVersion);
  }
  // End Functions

  if (teamMembers.length === 0) return <p>Loading...</p>;

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Ticket</DialogTitle>
          </DialogHeader>

          <Label className={"mt-4"} htmlFor="ticketName">
            Tên ticket
          </Label>
          <Input
            type="text"
            id="ticketName"
            placeholder="Tên ticket"
            value={ticketName}
            onChange={(e) => {
              setTicketName(e.target.value);
            }}
            required
          />

          <Label htmlFor="assignee">Assignee</Label>
          <Select
            id="assignee"
            defaultValue={assignee}
            onValueChange={(value) => {
              setAssignee(value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn người phụ trách" />
            </SelectTrigger>
            <SelectContent>
              {teamMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label htmlFor="labels">Labels</Label>
          <Input
            type="text"
            id="labels"
            placeholder="Labels"
            value={labels}
            onChange={(e) => {
              setLabels(e.target.value);
            }}
            required
          />

          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            type="date"
            id="dueDate"
            placeholder="Due Date"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
            }}
            required
          />

          <Label htmlFor="storyPoints">Story Points</Label>
          <Input
            type="number"
            id="storyPoints"
            placeholder="Story Points"
            value={storyPoints}
            onChange={(e) => {
              setStoryPoints(e.target.value);
            }}
            required
          />

          <Label htmlFor="fixVersions">Fix Versions</Label>
          <Select
            id="fixVersions"
            defaultValue={fixVersion}
            onValueChange={(value) => {
              setFixVersion(value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Fix Version" />
            </SelectTrigger>
            <SelectContent>
              {fixVersions.map((fixVersion) => (
                <SelectItem key={fixVersion.id} value={fixVersion.id}>
                  {fixVersion.versionName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className="w-full mt-4 cursor-pointer" onClick={handleSubmit}>
            Lưu
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
