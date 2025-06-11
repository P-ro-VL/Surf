"use client";

import { useState, useEffect } from "react";
import { KanbanColumn } from "./KanbanColumn";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { teamService } from "@/services/team";
import { ticketService } from "@/services/ticket";
import { KanbanCard } from "./KanbanCard";
import StackedAvatars from "../ui/stacked_avatar";
import { authService } from "@/services/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, Tag, Zap } from "lucide-react";
import { ticketStyles } from "@/utils/constants";

export const initialColumnsData = {
  "column-1": {
    id: "column-1",
    title: "BACKLOG",
    description: "Các task đang chờ thực hiện",
    backgroundColor: "bg-gray-50",
    textColor: "text-gray-700",
    borderColor: "border-gray-500",
  },
  "column-2": {
    id: "column-2",
    title: "IN PROGRESS",
    description: "Các task đang được thực hiện",
    backgroundColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-500",
  },
  "column-3": {
    id: "column-3",
    title: "TESTING",
    description: "Các task đang chờ test/đang test",
    backgroundColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-500",
  },
  "column-4": {
    id: "column-4",
    title: "DONE",
    description: "Các task đã hoàn thành",
    backgroundColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-500",
  },
};

const initialColumnOrderData = [
  "column-1",
  "column-2",
  "column-3",
  "column-4",
  "column-5",
  "column-6",
];

export function KanbanBoard({ teamName }) {
  const [columns, setColumns] = useState({});
  const [columnOrder, setColumnOrder] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [activeItemData, setActiveItemData] = useState(null);
  const [tickets, setTickets] = useState([]);

  const [members, setMembers] = useState([]);
  const [epics, setEpics] = useState([]);

  const [selectedMember, setSelectedMember] = useState(
    authService.getAuthData().id
  );

  const [selectedType, setSelectedType] = useState("all");

  const [epicKeyword, setEpicKeyword] = useState("");
  const [selectedEpic, setSelectedEpic] = useState(null);

  const [labels, setLabels] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [labelKeyword, setLabelKeyword] = useState("");

  console.log(selectedMember);

  useEffect(() => {
    const fetchTickets = async () => {
      const teamId = teamService
        .getTeamData()
        .find((team) => team.teamName === teamName).id;
      await ticketService.getAllTickets(teamId);

      let data = ticketService.getTicketData();

      if (selectedMember) {
        data = data.filter((ticket) => ticket.assignee?.id === selectedMember);
      }

      if (selectedType && selectedType !== "all") {
        data = data.filter(
          (ticket) => ticket.type.toLowerCase() === selectedType
        );
      }

      if (selectedEpic) {
        data = data.filter(
          (ticket) => ticket.parent && ticket.parent.uuid === selectedEpic
        );
      }

      if (selectedLabel && selectedLabel !== "all") {
        data = data.filter((ticket) => ticket.labels?.includes(selectedLabel));
      }

      setTickets(data);
    };
    fetchTickets();
  }, [selectedType, selectedEpic, selectedMember, selectedLabel]);

  useEffect(() => {
    setColumns(initialColumnsData);
    setColumnOrder(initialColumnOrderData);
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      const teamId = teamService
        .getTeamData()
        .find((team) => team.teamName === teamName).id;
      const data = await authService.getAllTeamMembers(teamId);
      setMembers(data);
    };

    const fetchEpics = async () => {
      const teamId = teamService
        .getTeamData()
        .find((team) => team.teamName === teamName).id;
      const response = await ticketService.getAllTickets(teamId, "epic");

      setEpics(response);
    };

    const fetchLabels = async () => {
      const teamId = teamService
        .getTeamData()
        .find((team) => team.teamName === teamName).id;
      const response = await ticketService.getAllTickets(teamId);

      const allLabels = response.map((t) => t.labels).flat();
      console.log();
      setLabels(new Set(allLabels));
    };

    fetchTeamMembers();
    fetchEpics();
    fetchLabels();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const findColumnContainingTask = (taskId) => {
    const task = tickets.find((ticket) => ticket.uuid === taskId);
    if (!task) return null;
    return Object.values(columns).find(
      (col) => task.status === col.title.toUpperCase().replaceAll(" ", "_")
    );
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    if (active.data.current?.type === "Task") {
      setActiveItemData({ type: "Task", task: active.data.current.task });
    } else {
      setActiveItemData(null);
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (
      !over ||
      !activeId ||
      active.id === over.id ||
      !activeItemData ||
      activeItemData.type !== "Task"
    )
      return;

    const activeTaskId = active.id;
    const sourceColumn = findColumnContainingTask(activeTaskId);
    const overId = over.id;
    const overData = over.data.current;
    const overIsColumn = overData?.type === "Column";
    const overIsTask = overData?.type === "Task";
    if (!sourceColumn) return;

    const activeTask = tickets.find((ticket) => ticket.uuid === activeTaskId);
    if (!activeTask) return;

    if (overIsColumn) {
      const destinationColumn = columns[overId];
      if (destinationColumn && sourceColumn.id !== destinationColumn.id) {
        activeTask.status = destinationColumn.title
          .toUpperCase()
          .replaceAll(" ", "_");
        setTickets([...tickets]);
      }
    } else if (overIsTask) {
      const destinationColumn = findColumnContainingTask(overId);
      if (destinationColumn && sourceColumn.id !== destinationColumn.id) {
        activeTask.status = destinationColumn.title
          .toUpperCase()
          .replaceAll(" ", "_");
        setTickets([...tickets]);
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveItemData(null);
    if (!over || !activeItemData || activeItemData.type !== "Task") return;
    const activeTaskId = active.id;
    const overId = over.id;
    const overData = over.data.current;
    const overIsColumn = overData?.type === "Column";
    const overIsTask = overData?.type === "Task";

    if (overIsTask) {
      const sourceColumn = findColumnContainingTask(activeTaskId);
      const destinationColumn = findColumnContainingTask(overId);
      if (!sourceColumn || !destinationColumn) return;
      const sourceTasks = tickets.filter(
        (t) =>
          t.status === sourceColumn.title.toUpperCase().replaceAll(" ", "_")
      );
      const destinationTasks = tickets.filter(
        (t) =>
          t.status ===
          destinationColumn.title.toUpperCase().replaceAll(" ", "_")
      );
      const activeIndex = sourceTasks.findIndex((t) => t.uuid === activeTaskId);
      const overIndex = destinationTasks.findIndex((t) => t.uuid === overId);

      if (sourceColumn.id === destinationColumn.id) {
        const updated = arrayMove(sourceTasks, activeIndex, overIndex);
        updated.forEach((t) => {
          const idx = tickets.findIndex((ticket) => ticket.uuid === t.uuid);
          if (idx !== -1) tickets[idx] = t;
        });
        setTickets([...tickets]);

        ticketService
          .updateTicket(activeTaskId, {
            status: destinationColumn.title.toUpperCase().replaceAll(" ", "_"),
          })
          .then((data) => {
            if (data) {
            }
          });
      } else {
        const activeTask = tickets.find((t) => t.uuid === activeTaskId);
        if (activeTask) {
          activeTask.status = destinationColumn.title
            .toUpperCase()
            .replaceAll(" ", "_");
          setTickets([...tickets]);

          ticketService
            .updateTicket(activeTask.uuid, {
              status: destinationColumn.title
                .toUpperCase()
                .replaceAll(" ", "_"),
            })
            .then((data) => {
              if (data) {
              }
            });
        }
      }
    } else if (overIsColumn) {
      const destinationColumn = columns[overId];
      const activeTask = tickets.find((t) => t.uuid === activeTaskId);
      if (destinationColumn && activeTask) {
        activeTask.status = destinationColumn.title
          .toUpperCase()
          .replaceAll(" ", "_");
        setTickets([...tickets]);

        ticketService
          .updateTicket(activeTask.uuid, {
            status: destinationColumn.title.toUpperCase().replaceAll(" ", "_"),
          })
          .then((data) => {
            if (data) {
            }
          });
      }
    }
  };

  if (!isClient || members.length === 0) return null;

  return (
    <>
      <div className="w-full flex justify-between gap-20">
        <StackedAvatars
          avatars={members.map((member) => ({
            id: member.id,
            name: member.name,
          }))}
          defaultValue={selectedMember}
          className={"my-4"}
          onChange={(value) => {
            setSelectedMember(value?.id);
          }}
        />

        <div className="flex gap-2">
          <Select
            defaultValue={selectedType}
            onValueChange={(value) => {
              setSelectedType(value);
            }}
          >
            <SelectTrigger
              className={`cursor-pointer ${
                selectedType !== "all"
                  ? "" +
                    ticketStyles[selectedType].borderColor +
                    " " +
                    ticketStyles[selectedType].textColor +
                    " " +
                    ticketStyles[selectedType].color
                  : ""
              }`}
            >
              <SelectValue placeholder="Loại ticket" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả ticket</SelectItem>
              <SelectItem value="story">
                {ticketStyles.story.icon} User Story
              </SelectItem>
              <SelectItem value="task">
                {ticketStyles.task.icon} Task
              </SelectItem>
              <SelectItem value="bug">{ticketStyles.bug.icon} Bug</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger>
              {selectedEpic ? (
                <Button
                  variant={"outline"}
                  className={
                    "cursor-pointer text-purple-500 bg-purple-50 border-purple-500"
                  }
                >
                  <Zap className={"w-4 h-4 text-purple-500"} />
                  {epics.find((epic) => epic.uuid == selectedEpic).ticketName}
                </Button>
              ) : (
                <Button variant={"outline"} className={"cursor-pointer"}>
                  {"Epic"}
                </Button>
              )}
            </PopoverTrigger>
            <PopoverContent className={"p-2"}>
              <Input
                placeholder={"Tìm kiếm epic"}
                className={"mb-2"}
                value={epicKeyword}
                onChange={(e) => {
                  setEpicKeyword(e.target.value);
                }}
              />
              {[
                <Button
                  className="p-1 cursor-pointer hover:bg-gray-100 hover:rounded-sm border-none bg-white shadow-none text-gray-900 w-full justify-start"
                  onClick={() => {
                    setSelectedEpic(null);
                  }}
                >
                  Tất cả
                </Button>,
                ...epics
                  .filter((epic) =>
                    epic.ticketName
                      .toLowerCase()
                      .includes(epicKeyword.toLowerCase())
                  )
                  .map((epic) => (
                    <Button
                      value={epic.uuid}
                      className="p-1 cursor-pointer hover:bg-gray-100 hover:rounded-sm border-none bg-white shadow-none text-gray-900 w-full justify-start"
                      onClick={() => {
                        setSelectedEpic(epic.uuid);
                      }}
                    >
                      {epic.ticketId} - {epic.ticketName}
                      {selectedEpic == epic.uuid && (
                        <Check className="w-4 h-4" />
                      )}
                    </Button>
                  )),
              ]}
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger>
              {selectedLabel ? (
                <Button
                  variant={"outline"}
                  className={
                    "cursor-pointer text-blue-500 bg-blue-50 border-blue-500"
                  }
                >
                  <Tag className={"w-4 h-4 text-blue-500"} />
                  {selectedLabel}
                </Button>
              ) : (
                <Button variant={"outline"} className={"cursor-pointer"}>
                  {"Label"}
                </Button>
              )}
            </PopoverTrigger>
            <PopoverContent className={"p-2"}>
              <Input
                placeholder={"Tìm kiếm label"}
                className={"mb-2"}
                value={labelKeyword}
                onChange={(e) => {
                  setLabelKeyword(e.target.value);
                }}
              />
              {[
                <Button
                  className="p-1 cursor-pointer hover:bg-gray-100 hover:rounded-sm border-none bg-white shadow-none text-gray-900 w-full justify-start"
                  onClick={() => {
                    setSelectedLabel(null);
                  }}
                >
                  Tất cả
                </Button>,
                ...[...labels]
                  .filter((label) =>
                    label.toLowerCase().includes(labelKeyword.toLowerCase())
                  )
                  .map((label) => (
                    <Button
                      value={label}
                      className="p-1 cursor-pointer hover:bg-gray-100 hover:rounded-sm border-none bg-white shadow-none text-gray-900 w-full justify-start"
                      onClick={() => {
                        setSelectedLabel(label);
                      }}
                    >
                      {label}
                      {selectedLabel == label && <Check className="w-4 h-4" />}
                    </Button>
                  )),
              ]}
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex space-x-4 overflow-x-auto h-[calc(100vh-150px)] items-start">
          <SortableContext
            items={columnOrder}
            strategy={horizontalListSortingStrategy}
          >
            {columnOrder.map((columnId) => {
              const column = columns[columnId];
              if (!column) return null;
              const columnTasks = tickets.filter(
                (ticket) =>
                  ticket.status ===
                    column.title.toUpperCase().replaceAll(" ", "_") &&
                  !["SUBTASK", "EPIC"].includes(ticket.type)
              );
              return (
                <KanbanColumn
                  key={column.id}
                  columnId={column.id}
                  title={column.title}
                  tasks={columnTasks}
                  description={column.description}
                />
              );
            })}
          </SortableContext>
        </div>
        <DragOverlay dropAnimation={null}>
          {activeId && activeItemData && activeItemData.type === "Task" && (
            <KanbanCard task={activeItemData.task} />
          )}
        </DragOverlay>
      </DndContext>
    </>
  );
}
