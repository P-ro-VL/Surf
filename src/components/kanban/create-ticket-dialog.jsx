"use client";

import { Bookmark, Bug, Fingerprint, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { authService } from "@/services/auth";
import { teamService } from "@/services/team";
import { ticketService } from "@/services/ticket";
import { Button } from "../ui/button";
import { ticketStyles } from "@/utils/constants";

const bugTemplate = `
<p><strong>[DÀNH CHO QC]</strong></p><ol><li><p><strong>Các bước tái hiện</strong></p></li><li><p><strong>Data sử dụng</strong></p></li></ol><ul><li><p>Tài khoản: </p></li><li><p>Mật khẩu</p></li></ul><ol start="3"><li><p><strong>Hiện tại</strong></p></li><li><p><strong>Mong muốn</strong></p></li></ol><hr><p><strong>[DÀNH CHO DEV]</strong></p><ol><li><p>Nguyên nhân (<em>Cause</em>): Nguyên nhân trực tiếp của vấn đề</p></li><li><p>Nguyên nhân gốc rễ (<em>Rootcause</em>): Nguyên nhân sâu xa của vấn đề (do nhận code từ người khác/Do chưa đọc kỹ tài liệu/Do chưa đánh giá được impact/…)</p></li><li><p>Các màn hình/chức năng bị ảnh hưởng:</p></li><li><p>Cách giải quyết:</p></li></ol><p></p>
`;

export default function CreateTicketDialog({
  children,
  teamName,
  isSubtask = false,
  parentId = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);

  const [ticketType, setTicketType] = useState(isSubtask ? "subtask" : "epic");
  const [epics, setEpics] = useState([]);
  const [epic, setEpic] = useState(null);
  const [ticketName, setTicketName] = useState("");
  const [assignee, setAssignee] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [labels, setLabels] = useState("");

  const getTeamId = async () => {
    const allTeams = await teamService.getAllTeams();
    return allTeams.find((team) => team.teamName === teamName).id;
  };

  useEffect(() => {
    const fetchTeamMembers = async () => {
      const teamId = await getTeamId();
      const response = await authService.getAllTeamMembers(teamId);
      setTeamMembers(response);
    };

    const fetchEpics = async () => {
      const teamId = await getTeamId();
      const response = await ticketService.getAllTickets(teamId, "epic");
      setEpics(response);
    };

    fetchTeamMembers();
    fetchEpics();
  }, []);

  const handleCreateTicket = async () => {
    const teamId = await getTeamId();
    const payload = {
      name: ticketName,
      assigneeId: assignee.id,
      dueDate: new Date(dueDate).toISOString(),
      labels: labels.split(","),
      type: ticketType.toUpperCase(),
      parentId: isSubtask ? parentId : epic ? epic.uuid : null,
      teamId: teamId,
      description: ticketType === "bug" ? bugTemplate : "",
    };

    await ticketService.createTicket(payload);
    alert("Tạo ticket thành công");
    window.location.reload();
  };

  if (teamMembers.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo ticket mới</DialogTitle>
        </DialogHeader>

        {!isSubtask && (
          <>
            <Label htmlFor="ticket-type" className={"mt-4"}>
              Loại ticket
            </Label>
            <div className="flex flex-col gap-4">
              <Select
                defaultValue={ticketType}
                id="ticket-type"
                onValueChange={(value) => setTicketType(value)}
              >
                <SelectTrigger
                  className={`w-full border-2 ${ticketStyles[ticketType]?.borderColor} ${ticketStyles[ticketType]?.color} ${ticketStyles[ticketType]?.textColor}`}
                >
                  <SelectValue placeholder="Chọn loại ticket" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ticketStyles).map((ticket) => (
                    <SelectItem
                      key={ticket.name}
                      value={ticket.name.toLowerCase()}
                    >
                      <div className={`${ticket.textColor}`}>{ticket.icon}</div>
                      <p className={`${ticket.textColor} font-medium`}>
                        {ticket.name}
                      </p>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {!["epic", "bug"].includes(ticketType) && !isSubtask && (
          <>
            <Label htmlFor="select-epic" className={"mt-2"}>
              Chọn Epic
            </Label>
            <Select
              id="select-epic"
              onValueChange={(value) => {
                setEpic(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn Epic" />
              </SelectTrigger>
              <SelectContent>
                {epics.map((epic) => (
                  <SelectItem key={epic.id} value={epic}>
                    {epic.ticketId} - {epic.ticketName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}

        <Label htmlFor="ticket-name" className={"mt-2"}>
          Tên ticket
        </Label>
        <Input
          id="ticket-name"
          placeholder="Nhập tên ticket"
          required
          value={ticketName}
          onChange={(e) => setTicketName(e.target.value)}
        />

        <Label htmlFor="assignee">Assignee</Label>
        <Select
          id="assignee"
          onValueChange={(value) => {
            setAssignee(value);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn người phụ trách" />
          </SelectTrigger>
          <SelectContent>
            {teamMembers.map((member) => (
              <SelectItem key={member.id} value={member}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Label htmlFor="duedate" className={"mt-2"}>
          Due Date
        </Label>
        <Input
          id="duedate"
          placeholder="Due Date"
          type="date"
          required
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <Label htmlFor="labels" className={"mt-2"}>
          Labels
        </Label>
        <Input
          id="labels"
          placeholder="Nhập labels"
          required
          value={labels}
          onChange={(e) => setLabels(e.target.value)}
        />

        <Button className="mt-4 cursor-pointer" onClick={handleCreateTicket}>
          Tạo ticket
        </Button>
      </DialogContent>
    </Dialog>
  );
}
