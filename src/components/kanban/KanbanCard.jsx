"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Calendar,
  CalendarIcon,
  Edit,
  Figma,
  FileCode2,
  FilePlus2,
  FileText,
  Fingerprint,
  Link,
  Trash,
  Package,
  PackageCheck,
  Paperclip,
  Pencil,
  Plus,
  Tag,
  TruckElectric,
  UserRound,
  Wrench,
  Zap,
  CopyPlus,
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
import Tiptap from "../tiptap";
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import DatePicker from "../ui/datepicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { initialColumnsData } from "./KanbanBoard";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Separator } from "../ui/separator";

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
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: !isDraggable, // Vô hiệu hóa kéo thả nếu isDraggable là false
  });

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            <div className="border-purple-500 flex items-center gap-2 text-purple-700 ">
              <Zap className="w-4 h-4" />
              <p className="text-sm font-medium">High Priority</p>
            </div>
            <p className="text-md font-semibold">{task.content}</p>
            <div className="flex justify-between">
              <div className="gap-2">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="text-gray-500">
                    <Fingerprint className="w-4 h-4" />
                  </span>
                  <span className="text-gray-500">{task.id.toUpperCase()}</span>
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-gray-500">
                    <CalendarIcon className="w-4 h-4" />
                  </span>
                  <span className="text-gray-500">10/06/2025</span>
                </p>
              </div>

              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </CardContent>
        </Card>
      </div>
      <DialogContent className="sm:max-w-[50vw] p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-blue-500" />
                <p className="text-sm font-medium">{task.id.toUpperCase()}</p>
              </div>
              <p className="text-2xl font-bold mt-4">{task.content}</p>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="outline"
                      className={"cursor-pointer"}
                      disabled={hasReleased}
                    >
                      <Pencil className="w-4 h-4" />
                      <p className="text-sm font-medium">Chỉnh sửa</p>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {hasReleased && (
                      <p className="text-sm font-medium">
                        Ticket đã Golive không thể chỉnh sửa
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant="outline"
                          className={"cursor-pointer"}
                          disabled={hasReleased}
                        >
                          <Plus className="w-4 h-4" />
                          <p className="text-sm font-medium">Thêm</p>
                        </Button>
                      </TooltipTrigger>
                      {hasReleased && (
                        <TooltipContent>
                          <p className="text-sm font-medium">
                            Ticket đã Golive không thể chỉnh sửa
                          </p>
                        </TooltipContent>
                      )}
                    </Tooltip>
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
              <SimpleEditor disabled={hasReleased} />
            </div>

            {task.links && (
              <div className="w-full">
                <p className="font-bold text-md mb-2">Đường dẫn</p>
                <div className="w-full">
                  {Object.entries(task.links).map((entry) => (
                    <div
                      key={entry[0]}
                      className="flex items-center gap-2 px-4 py-2 border-1 rounded-sm mt-2 cursor-pointer hover:bg-blue-100 hover:border-blue-500"
                    >
                      {entry[0] == "design" && <Figma className="w-4 h-4" />}
                      {entry[0] == "prd" && <FileText className="w-4 h-4" />}
                      {entry[0] == "apiDoc" && (
                        <FileCode2 className="w-4 h-4" />
                      )}
                      <p className="text-sm font-medium">{entry[1]}</p>
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
            <Select>
              <SelectTrigger
                className={`font-bold ${task.backgroundColor} ${task.textColor} ${task.borderColor} border-1 rounded-sm`}
              >
                <SelectValue
                  placeholder="Select a status"
                  value={task.status}
                />
              </SelectTrigger>
              <SelectContent>
                {Object.values(initialColumnsData).map((column) => (
                  <SelectItem key={column.title} value={column.title}>
                    {column.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Release Status */}
            {task.fixVersions?.status == "RELEASED" && (
              <div className="mt-4 mb-2 w-full border-1 border-green-500 bg-green-50 rounded-sm px-4 py-2 flex items-center gap-2 text-green-700">
                <PackageCheck className="w-4 h-4 " />
                <p className="text-md font-bold">
                  Ticket này đã Golive ngày {task.fixVersions?.releaseDate}
                </p>
              </div>
            )}

            {/* Epic */}
            <div className="mb-4 w-full border-1 border-purple-500 bg-purple-50 rounded-sm px-4 py-2 flex items-center gap-2 text-purple-700">
              <Zap className="w-4 h-4 " />
              <p className="text-md font-bold">High Priority</p>
            </div>

            {/* Fields */}
            <div className="w-full border-1 rounded-sm p-4 flex flex-col gap-2">
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
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>
                      {task.assignee?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-md">{task.assignee}</p>
                </div>
              </div>
              {/* Labels */}
              <div className="flex justify-between mb-2 items-center">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <p className="text-sm font-semibold">Labels</p>
                </div>
                <div className="flex items-center gap-1">
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
                      <p className="text-sm font-medium">{task.duedate}</p>
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
                      {task.fixVersions?.name}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm font-medium">
                      Dự kiến Golive ngày {task.fixVersions?.releaseDate}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-4 px-4">
              <span>
                Ticket được tạo ngày {task.createdAt} bởi {task.createdBy}
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
