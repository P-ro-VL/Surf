"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TicketDialog } from "./ticket-dialog";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { CalendarIcon } from "lucide-react";
import { textToColor } from "@/utils/color_utils";
import { ticketStyles } from "@/utils/constants";
import { Card, CardContent } from "../ui/card";
import { Zap } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function KanbanCard({ task }) {
  const [isOpen, setIsOpen] = useState(false);

  const isDraggable = true;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.uuid,
    data: {
      type: "Task",
      task,
    },
  });

  const overdue = new Date(task.dueDate) < new Date();
  const remainingDueDays = Math.ceil(
    (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const cardListeners = isDraggable ? listeners : undefined;
  const cursorClass = isDraggable
    ? "cursor-grab active:cursor-grabbing"
    : "cursor-pointer";

  return (
    <TicketDialog task={task} open={isOpen}>
      <div
        ref={setNodeRef}
        style={style}
        onMouseDown={(e) => {
          if (e.detail == 2 && !isOpen) {
            setIsOpen(true);
            e.preventDefault();
          }
        }}
        {...attributes}
        {...cardListeners}
      >
        <Card
          className={`mb-2 rounded-sm ${cursorClass} ${
            isDragging ? "ring-2 ring-primary" : ""
          } ${
            overdue
              ? "ring-red-500 ring-3 bg-red-50"
              : remainingDueDays <= 2
              ? "ring-yellow-500 ring-3 bg-yellow-50"
              : ""
          }`}
          onClick={() => {
            setIsOpen(true);
          }}
          asChild
        >
          <CardContent className="gap-5 flex flex-col">
            {task.parent && (
              <div className="border-purple-500 flex items-center gap-2 text-purple-700 ">
                <Zap className="w-4 h-4" />
                <p className="text-sm font-medium">{task.parent.ticketName}</p>
              </div>
            )}

            <p className="text-md font-semibold">{task.ticketName}</p>
            <div className="flex justify-between">
              <div className="gap-2">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="text-gray-500">
                    {ticketStyles[task.type.toLowerCase()]?.icon}
                  </span>
                  <span className="text-gray-500">
                    {task.ticketId.toUpperCase()}
                  </span>
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-gray-500">
                    <CalendarIcon className="w-4 h-4" />
                  </span>
                  <span className="text-gray-500">
                    {task.dueDate.split("T")[0]}
                  </span>
                </p>
              </div>

              <Tooltip>
                <TooltipTrigger>
                  <Avatar>
                    <AvatarFallback
                      className={`font-bold text-white`}
                      style={{
                        backgroundColor: `#${textToColor(task.assignee?.name)}`,
                      }}
                    >
                      {task.assignee?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm font-medium">{task.assignee?.name}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </div>
    </TicketDialog>
  );
}
