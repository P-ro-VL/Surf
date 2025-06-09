"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Calendar,
  CalendarIcon,
  Figma,
  FileCode2,
  FilePlus2,
  FileText,
  Fingerprint,
  Trash,
  Package,
  PackageCheck,
  Paperclip,
  Pencil,
  Plus,
  Tag,
  UserRound,
  Wrench,
  Zap,
  CopyPlus,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { initialColumnsData } from "./KanbanBoard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Separator } from "../ui/separator";
import { textToColor } from "@/utils/color_utils";
import EditTicketDialog from "./edit-ticket-dialog";

export function KanbanCard({ task, isDraggable = false }) {
  const [isOpen, setIsOpen] = useState(false);
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
    disabled: !isDraggable, // Vô hiệu hóa kéo thả nếu isDraggable là false
  });

  const changedInformation = {
    status: task.status,
    assignee: task.assignee?.id,
    dueDate: task.dueDate,
    storyPoints: task.storyPoints,
    labels: task.labels,
    fixVersions: task.fixVersions?.id,
    ticketName: task.ticketName,
    description: task.description,
    links: task.links,
    comments: task.comments,
    parent: task.parent?.id,
  };

  const hasReleased = task.fixVersions?.status == "RELEASED";

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // Làm mờ card khi đang được kéo
  };

  const cardListeners = isDraggable ? listeners : undefined;
  const cursorClass = isDraggable
    ? "cursor-grab active:cursor-grabbing"
    : "cursor-pointer";

  const handleClick = (e) => {
    setIsOpen(true);
  };

  return (
    <Dialog open={isOpen}>
      <div
        ref={setNodeRef}
        style={style}
        onMouseDown={(e) => {
          if (e.detail == 2) {
            setIsOpen(true);
          }
        }}
        {...attributes}
        {...cardListeners}
      >
        <Card
          className={`mb-2 rounded-sm ${cursorClass} ${
            isDragging ? "ring-2 ring-primary" : ""
          } ${task.overdue ? "ring-red-500 ring-3 bg-red-50" : ""}`}
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
                    <Fingerprint className="w-4 h-4" />
                  </span>
                  <span className="text-gray-500">
                    {task.ticketId.toUpperCase()}
                  </span>
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-gray-500">
                    <CalendarIcon className="w-4 h-4" />
                  </span>
                  <span className="text-gray-500">{task.dueDate}</span>
                </p>
              </div>

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
            </div>
          </CardContent>
        </Card>
      </div>
      <DialogContent className="sm:max-w-[50vw] p-8 [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-blue-500" />
                  <p className="text-sm font-medium">
                    {task.ticketId.toUpperCase()}
                  </p>
                </div>
                <X
                  className="w-5 h-5 text-gray-500 cursor-pointer"
                  onClick={() => setIsOpen(false)}
                />
              </div>
              <p className="text-2xl font-bold mt-4">{task.ticketName}</p>
              <div className="flex items-center gap-2">
                <EditTicketDialog ticket={task}>
                  <Button
                    variant="outline"
                    className={"cursor-pointer"}
                    disabled={hasReleased}
                  >
                    <Pencil className="w-4 h-4" />
                    <p className="text-sm font-medium">Chỉnh sửa</p>
                  </Button>
                </EditTicketDialog>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={"cursor-pointer"}
                      disabled={hasReleased}
                    >
                      <Plus className="w-4 h-4" />
                      <p className="text-sm font-medium">Thêm</p>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <CopyPlus className="w-4 h-4" />
                      <p className="text-sm font-medium">Thêm subtask</p>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Paperclip className="w-4 h-4" />
                      <p className="text-sm font-medium">Thêm đường dẫn</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FilePlus2 className="w-4 h-4" />
                      <p className="text-sm font-medium">Tạo PRD</p>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash className="w-4 h-4 text-red-700" />
                      <p className="text-sm font-medium text-red-700">
                        Xóa ticket
                      </p>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="w-full flex items-start gap-4 ">
          <div className="w-2/3">
            <p className="font-bold text-md mb-2">Mô tả</p>
            <div className="w-full h-[350px] border-1 rounded-md mb-4">
              <SimpleEditor disabled={hasReleased} content={task.description} />
            </div>

            {task.links && task.links.length > 0 && (
              <div className="w-full">
                <p className="font-bold text-md mb-2">Đường dẫn</p>
                <div className="w-full">
                  {task.links.map((entry) => (
                    <div
                      key={entry}
                      className="flex items-center gap-2 px-4 py-2 border-1 rounded-sm mt-2 cursor-pointer hover:bg-blue-100 hover:border-blue-500"
                    >
                      {entry.contains("figma.com") && (
                        <Figma className="w-4 h-4" />
                      )}
                      {(entry.contains("docs") ||
                        entry.contains("confluence")) && (
                        <FileText className="w-4 h-4" />
                      )}
                      {(entry.contains("api") ||
                        entry.contains("swagger") ||
                        entry.contains("github") ||
                        entry.contains("postman")) && (
                        <FileCode2 className="w-4 h-4" />
                      )}
                      <p className="text-sm font-medium">{entry}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="font-bold text-md mb-2 mt-4">Hoạt động</p>
            <div className="w-full">
              <div className="flex items-start space-x-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  LV
                </div>

                <div className="flex-1 border border-gray-300 rounded-md p-3 bg-white shadow-sm">
                  <textarea
                    placeholder="Thêm bình luận..."
                    className="w-full resize-none focus:outline-none text-gray-800 placeholder-gray-500 text-sm"
                    rows={1}
                  ></textarea>

                  <div className="mt-3 text-xs text-gray-500">
                    Pro tip: press{" "}
                    <kbd className="px-1.5 py-0.5 text-xs font-sans border bg-gray-100 rounded shadow-sm text-gray-700">
                      M
                    </kbd>{" "}
                    to comment
                  </div>
                </div>
              </div>

              {task.comments?.map((comment) => (
                <div className="flex items-start space-x-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    LV
                  </div>
                  <div>
                    <p className="text-sm font-bold">{comment.createdBy}</p>
                    <p className="text-xs text-gray-500">{comment.createdAt}</p>
                    <p className="text-sm mt-3">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/3">
            {/* Status */}
            <Select defaultValue={task.status.replaceAll(" ", "_")}>
              <SelectTrigger
                className={`font-bold ${task.backgroundColor} ${
                  ["BACKLOG", "TODO"].includes(task.status)
                    ? "bg-gray-50 text-gray-700 border-gray-700"
                    : [
                        "IN_PROGRESS",
                        "READY_FOR_TESTING",
                        "IN_TESTING",
                      ].includes(task.status)
                    ? "bg-blue-50 text-blue-700 border-blue-700"
                    : "bg-green-50 text-green-700 border-green-700"
                } ${task.borderColor} border-1 rounded-sm`}
              >
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(initialColumnsData).map((column) => (
                  <SelectItem
                    key={column.title.replaceAll(" ", "_")}
                    value={column.title.replaceAll(" ", "_")}
                  >
                    {column.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Release Status */}
            {task.fixVersions?.status == "RELEASED" && (
              <div className="mt-4 w-full border-1 border-green-500 bg-green-50 rounded-sm px-4 py-2 flex items-center gap-2 text-green-700">
                <PackageCheck className="w-4 h-4 " />
                <p className="text-md font-bold">
                  Ticket này đã Golive ngày {task.fixVersions?.releaseDate}
                </p>
              </div>
            )}

            {/* Epic */}
            {task.parent != null && (
              <div className="mt-2 w-full border-1 border-purple-500 bg-purple-50 rounded-sm px-4 py-2 flex items-center gap-2 text-purple-700">
                <Zap className="w-4 h-4 " />
                <p className="text-md font-bold">High Priority</p>
              </div>
            )}

            {/* Fields */}
            <div className="w-full border-1 rounded-sm p-4 flex flex-col gap-2 mt-4">
              <p className="text-md font-bold ">Thông tin</p>
              <Separator className={"mb-4"} />
              {/* Assignee */}
              <div className="flex justify-between mb-2 items-center">
                <div className="flex items-center gap-2">
                  <UserRound className="w-4 h-4" />
                  <p className="text-sm font-semibold">Assignee</p>
                </div>
                <div className="flex items-center gap-2">
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
                  <p className="text-md">{task.assignee?.name}</p>
                </div>
              </div>
              {/* Labels */}
              <div className="flex justify-between mb-2 items-center">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <p className="text-sm font-semibold">Labels</p>
                </div>
                <div className="flex items-center gap-1 flex-wrap justify-end">
                  {task.labels?.map((label) => (
                    <Badge className="text-sm font-medium">{label}</Badge>
                  ))}
                </div>
              </div>
              {/* Due Date */}
              <div className="flex justify-between mb-2 items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <p className="text-sm font-semibold">Due Date</p>
                </div>
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger>
                      <p className="text-sm font-medium">{task.dueDate}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm font-medium">
                        Còn xx ngày để hoàn thành
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              {/* Story Points */}
              <div className="flex justify-between mb-2 items-center">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  <p className="text-sm font-semibold">Story Points</p>
                </div>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium">{task.storyPoints}</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm font-medium">
                      Tương đương {task.storyPoints * 4}h
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              {/* Fix Versions */}
              <div className="flex justify-between mb-2 items-center">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <p className="text-sm font-semibold">Fix Versions</p>
                </div>
                <Tooltip>
                  <TooltipTrigger>
                    <p className="text-sm font-medium">
                      {task.fixVersions?.versionName ?? "--"}
                    </p>
                  </TooltipTrigger>
                  {task.fixVersions?.versionName && (
                    <TooltipContent>
                      <p className="text-sm font-medium">
                        Dự kiến Golive ngày {task.fixVersions?.releaseDate}
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-4 px-4">
              <span>
                Ticket được tạo ngày {task.createdAt} bởi {task.createdBy.name}
              </span>
              <br />
              <span>Cập nhật lần cuối lúc {task.updatedAt}</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
