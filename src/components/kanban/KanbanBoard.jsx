"use client";

import { useState, useEffect } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
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

export const initialColumnsData = {
  "column-1": {
    id: "column-1",
    title: "BACKLOG",
    description: "Các task chưa được lên lịch",
    backgroundColor: "bg-gray-50",
    textColor: "text-gray-700",
    borderColor: "border-gray-500",
  },
  "column-2": {
    id: "column-2",
    title: "TODO",
    description: "Các task đang chờ thực hiện",
    backgroundColor: "bg-gray-50",
    textColor: "text-gray-700",
    borderColor: "border-gray-500",
  },
  "column-3": {
    id: "column-3",
    title: "IN PROGRESS",
    description: "Các task đang được thực hiện",
    backgroundColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-500",
  },
  "column-4": {
    id: "column-4",
    title: "READY FOR TESTING",
    description: "Các task đã hoàn thành và sẵn sàng để test",
    backgroundColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-500",
  },
  "column-5": {
    id: "column-5",
    title: "IN TESTING",
    description: "Các task đang được test",
    backgroundColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-500",
  },
  "column-6": {
    id: "column-6",
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

  useEffect(() => {
    const fetchTickets = async () => {
      const teamId = teamService
        .getTeamData()
        .find((team) => team.teamName === teamName).id;
      await ticketService.getAllTickets(teamId);
      setTickets(ticketService.getTicketData());
    };
    fetchTickets();
  }, [teamName]);

  useEffect(() => {
    setColumns(initialColumnsData);
    setColumnOrder(initialColumnOrderData);
    setIsClient(true);
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

  if (!isClient) return null;

  return (
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
                column.title.toUpperCase().replaceAll(" ", "_")
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
          <KanbanCard task={activeItemData.task} isDraggable={true} />
        )}
      </DragOverlay>
    </DndContext>
  );
}
