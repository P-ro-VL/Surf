"use client";

import {
  Calendar,
  Figma,
  FileCode2,
  FilePlus2,
  FileText,
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
  Copy,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
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
import { ticketService } from "@/services/ticket";
import { ticketRelations, ticketStyles } from "@/utils/constants";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";

export function TicketDialog({ children, task, open }) {
  const [isOpen, setIsOpen] = useState(open);
  const [status, setStatus] = useState(task.status);
  const [assignee, setAssignee] = useState(task.assignee);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [storyPoints, setStoryPoints] = useState(task.storyPoints);
  const [labels, setLabels] = useState(task.labels);
  const [fixVersions, setFixVersions] = useState(task.fixVersion);
  const [ticketName, setTicketName] = useState(task.ticketName);
  const [description, setDescription] = useState(task.description);
  const [links, setLinks] = useState(task.links);
  const [comments, setComments] = useState(task.comments);
  const [parent, setParent] = useState(task.parent);
  const [relations, setRelations] = useState(task.relations);

  const [selectedRelation, setSelectedRelation] = useState("BLOCK");
  const [selectedRelationTicket, setSelectedRelationTicket] = useState(null);
  const [relationTicketKeyword, setRelationTicketKeyword] = useState("");
  const [relationTicketOpen, setRelationTicketOpen] = useState(false);

  const [link, setLink] = useState("");

  const hasReleased = task.fixVersions?.status == "RELEASED";
  const overdue = new Date(task.dueDate) < new Date();
  const remainingDueDays = Math.ceil(
    (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  useEffect(() => {
    console.log("open: ", open);
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    updateTicketStatus();
  }, [status]);

  const updateTicketDescription = async () => {
    await ticketService.updateTicket(task.uuid, { description: description });
    alert("Cập nhật mô tả ticket thành công");
  };

  const updateTicketStatus = async () => {
    await ticketService.updateTicket(task.uuid, {
      status: status.replaceAll(" ", "_"),
    });
  };

  const updateTicketLinks = async () => {
    await ticketService.updateTicket(task.uuid, { links: [...links, link] });
    setLinks([...links, link]);
  };

  const updateTicketRelations = async () => {
    if (!task.relations[selectedRelation]) {
      task.relations[selectedRelation] = [];
    }

    task.relations[selectedRelation].push(selectedRelationTicket.uuid);
    console.log(task.relations);
    await ticketService.updateTicket(task.uuid, { relations: task.relations });
    setRelations(task.relations);

    setSelectedRelation("BLOCK");
    setSelectedRelationTicket(null);
    setRelationTicketKeyword("");
  };

  return (
    <Dialog open={isOpen}>
      {children}
      <DialogContent className="min-w-10/12 max-h-10/12 overflow-y-scroll bg-white p-8 [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  {ticketStyles[task.type.toLowerCase()]?.icon ? (
                    ticketStyles[task.type.toLowerCase()]?.icon
                  ) : (
                    <Copy className="w-4 h-4 text-blue-500" />
                  )}
                  <p className="text-sm font-medium">
                    {task.ticketId.toUpperCase()}
                  </p>
                </div>
                <X
                  className="w-5 h-5 text-gray-500 cursor-pointer"
                  onClick={() => {
                    setIsOpen(false);

                    window.location.reload();
                  }}
                />
              </div>
              <p className="text-2xl font-bold mt-4">{ticketName}</p>
              <div className="flex items-center gap-2">
                <EditTicketDialog
                  ticket={task}
                  callback={(
                    ticketName,
                    assignee,
                    dueDate,
                    storyPoints,
                    labels,
                    fixVersions,
                    parent
                  ) => {
                    setTicketName(ticketName);
                    setAssignee(assignee);
                    setDueDate(dueDate);
                    setStoryPoints(storyPoints);
                    setLabels(labels);
                    setFixVersions(fixVersions);
                    setParent(parent);
                  }}
                >
                  <Button
                    variant="outline"
                    className={"cursor-pointer"}
                    disabled={hasReleased}
                  >
                    <Pencil className="w-4 h-4" />
                    <p className="text-sm font-medium">Chỉnh sửa</p>
                  </Button>
                </EditTicketDialog>

                <Popover>
                  <PopoverTrigger>
                    <Button
                      variant="outline"
                      className={"cursor-pointer"}
                      disabled={hasReleased}
                    >
                      <CopyPlus className="w-4 h-4" />
                      <p className="text-sm font-medium">Thêm quan hệ</p>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className={"flex flex-col gap-2 p-2"}>
                    <Select
                      defaultValue={selectedRelation}
                      onValueChange={(value) => {
                        setSelectedRelation(value);
                      }}
                    >
                      <SelectTrigger className={"w-full"}>
                        <SelectValue placeholder={"Chọn quan hệ"} />
                      </SelectTrigger>
                      <SelectContent>
                        {...ticketRelations.map((entry) => (
                          <SelectItem value={entry.type}>
                            {entry.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Popover
                      open={relationTicketOpen}
                      onOpenChange={setRelationTicketOpen}
                    >
                      <PopoverTrigger asChild>
                        {selectedRelationTicket ? (
                          <Button
                            variant={"outline"}
                            className="shadow-none text-gray-900 w-full justify-start truncate"
                          >
                            {selectedRelationTicket.ticketId} -{" "}
                            {selectedRelationTicket.ticketName}
                          </Button>
                        ) : (
                          <Button
                            variant={"outline"}
                            className="shadow-none text-gray-900 w-full justify-start"
                          >
                            Chọn ticket
                          </Button>
                        )}
                      </PopoverTrigger>
                      <PopoverContent className="flex flex-col gap-2 w-full">
                        <Input
                          placeholder="Tìm ticket theo tên"
                          value={relationTicketKeyword}
                          onChange={(e) =>
                            setRelationTicketKeyword(e.target.value)
                          }
                        />
                        <div className="flex flex-col gap-2 h-52 overflow-y-auto">
                          {ticketService
                            .getTicketData()
                            .filter((ticket) =>
                              ticket.ticketName
                                .toLowerCase()
                                .includes(relationTicketKeyword.toLowerCase())
                            )
                            .map((ticket) => (
                              <Button
                                variant={"outline"}
                                className="border-none shadow-none text-gray-900 w-full justify-start"
                                onClick={() => {
                                  setSelectedRelationTicket(ticket);

                                  setRelationTicketOpen(false);
                                }}
                              >
                                {ticket.ticketId} - {ticket.ticketName}
                              </Button>
                            ))}
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Button
                      className={"w-full cursor-pointer"}
                      onClick={updateTicketRelations}
                    >
                      Thêm
                    </Button>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger>
                    <Button variant="outline" className={"cursor-pointer"}>
                      <Paperclip className="w-4 h-4" />
                      <p className="text-sm font-medium">Thêm đường dẫn</p>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="flex gap-2 justify-center items-center">
                    <Input
                      placeholder="Nhập đường dẫn"
                      value={link}
                      onChange={(e) => {
                        setLink(e.target.value);
                      }}
                    />
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => {
                        updateTicketLinks();
                      }}
                    >
                      Thêm
                    </Button>
                  </PopoverContent>
                </Popover>

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
            <div className="flex justify-between mb-2 items-center">
              <p className="font-bold text-md ">Mô tả</p>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => {
                  updateTicketDescription();
                }}
              >
                Lưu
              </Button>
            </div>
            <div className="w-full h-[350px] border-1 rounded-md mb-4">
              <SimpleEditor
                disabled={hasReleased}
                content={description}
                onChange={(content) => {
                  setDescription(content);
                }}
              />
            </div>

            {links && links.length > 0 && (
              <div className="w-full">
                <p className="font-bold text-md mb-2">Đường dẫn</p>
                <div className="w-full">
                  {links.map((entry) => (
                    <div
                      key={entry}
                      className="flex items-center gap-2 px-4 py-2 border-1 rounded-sm mt-2 cursor-pointer hover:bg-blue-100 hover:border-blue-500"
                      onClick={() => {
                        window.open(entry, "_blank");
                      }}
                    >
                      {entry.includes("figma.com") && (
                        <Figma className="w-4 h-4" />
                      )}
                      {(entry.includes("docs") ||
                        entry.includes("confluence")) && (
                        <FileText className="w-4 h-4" />
                      )}
                      {(entry.includes("api") ||
                        entry.includes("swagger") ||
                        entry.includes("github") ||
                        entry.includes("postman")) && (
                        <FileCode2 className="w-4 h-4" />
                      )}
                      <p className="text-sm font-medium">{entry}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {[].fla}

            {relations && Object.entries(relations).length > 0 && (
              <div className="w-full mt-4">
                <p className="font-bold text-md mb-2">Ticket liên kết</p>
                <div className="w-full">
                  {...Object.entries(relations).map(([key, value]) => {
                    return (
                      <div className="mt-2" key={key}>
                        <p className="font-bold text-sm">
                          {ticketRelations.find((rel) => rel.type == key).name}
                        </p>
                        <div className="flex flex-col">
                          {...value.map((id) => {
                            const ticket = ticketService
                              .getTicketData()
                              .find((t) => t.uuid === id);

                            return (
                              ticket && (
                                <div
                                  key={id}
                                  className="flex items-center gap-2 px-4 py-2 border-1 rounded-sm mt-2 cursor-pointer hover:bg-blue-100 hover:border-blue-500"
                                  onClick={() => {
                                    window.open(entry, "_blank");
                                  }}
                                >
                                  <div className="flex justify-between w-full">
                                    <div className="flex items-center gap-2">
                                      {
                                        ticketStyles[ticket.type.toLowerCase()]
                                          .icon
                                      }
                                      <p className="text-sm font-medium">
                                        {ticket.ticketName}
                                      </p>
                                    </div>

                                    <div className="flex gap-2 items-center">
                                      <Badge variant={"outline"}>
                                        {ticket.status.replaceAll("_", " ")}
                                      </Badge>
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <Avatar>
                                            <AvatarFallback
                                              className={`font-bold text-white`}
                                              style={{
                                                backgroundColor: `#${textToColor(
                                                  assignee?.name
                                                )}`,
                                              }}
                                            >
                                              {assignee?.name
                                                ?.charAt(0)
                                                ?.toUpperCase() ?? "--"}
                                            </AvatarFallback>
                                          </Avatar>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          {ticket.assignee?.name}
                                        </TooltipContent>
                                      </Tooltip>

                                      <Trash
                                        className="ml-4 w-4 h-4 text-red-700"
                                        onClick={async () => {
                                          if (
                                            window.confirm(
                                              "Bạn có chắc chắn muốn xóa không?"
                                            )
                                          ) {
                                            task.relations[key] = value.filter(
                                              (v) => v !== id
                                            );
                                            setRelations(task.relations);

                                            console.log(task.relations);

                                            await ticketService.updateTicket(
                                              task.uuid,
                                              { relations: task.relations }
                                            );
                                          }
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
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

              {comments?.map((comment) => (
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
            <Select
              defaultValue={status.replaceAll(" ", "_")}
              onValueChange={(value) => {
                console.log(value);
                setStatus(value);
              }}
            >
              <SelectTrigger
                className={`font-bold ${
                  ["BACKLOG", "TODO"].includes(status)
                    ? "bg-gray-50 text-gray-700 border-gray-700"
                    : ["IN_PROGRESS", "TESTING", "IN_TESTING"].includes(status)
                    ? "bg-blue-50 text-blue-700 border-blue-700"
                    : "bg-green-50 text-green-700 border-green-700"
                } border-1 rounded-sm`}
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
            {fixVersions?.status == "RELEASED" && (
              <div className="mt-4 w-full border-1 border-green-500 bg-green-50 rounded-sm px-4 py-2 flex items-center gap-2 text-green-700">
                <PackageCheck className="w-4 h-4 " />
                <p className="text-md font-bold">
                  Ticket này đã Golive ngày {fixVersions?.releaseDate}
                </p>
              </div>
            )}

            {/* Epic */}
            {parent != null && parent.type == "EPIC" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="mt-2 w-full border-1 border-purple-500 bg-purple-50 rounded-sm px-4 py-2 flex items-center gap-2 text-purple-700">
                    <Zap className="w-4 h-4 " />
                    <p className="text-md font-bold">
                      {task.parent.ticketName}
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm font-medium">
                    Đây là Epic của ticket này. Không thể thay đổi.
                  </p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Other Parents */}
            {parent != null && parent.type != "EPIC" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`mt-2 w-full border-1 ${
                      parent.type == "TASK"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-green-500 bg-green-50 text-green-700"
                    } rounded-sm px-4 py-2 flex items-center gap-2 text-gray-700`}
                  >
                    {ticketStyles[parent.type.toLowerCase()]?.icon ?? (
                      <Copy className="w-4 h-4 text-blue-500" />
                    )}
                    <p className="text-md font-bold">
                      {task.parent.ticketName}
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm font-medium">
                    Đây là ticket cha của ticket này. Không thể thay đổi.
                  </p>
                </TooltipContent>
              </Tooltip>
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
                        backgroundColor: `#${textToColor(assignee?.name)}`,
                      }}
                    >
                      {assignee?.name?.charAt(0)?.toUpperCase() ?? "--"}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-md">{assignee?.name}</p>
                </div>
              </div>
              {/* Labels */}
              <div className="flex justify-between mb-2 items-center">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <p className="text-sm font-semibold">Labels</p>
                </div>
                <div className="flex items-center gap-1 flex-wrap justify-end">
                  {labels?.map((label) => (
                    <Badge key={label} className="text-sm font-medium">
                      {label}
                    </Badge>
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
                      <p
                        className={`text-sm ${
                          overdue ? "text-red-500 font-bold" : "font-medium"
                        }`}
                      >
                        {dueDate.split("T")[0]}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm font-medium">
                        {overdue
                          ? "Ticket đã quá hạn " +
                            Math.abs(remainingDueDays) +
                            " ngày"
                          : `Còn ${remainingDueDays} ngày để hoàn thành`}
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
                      <p className="text-sm font-medium">{storyPoints}</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm font-medium">
                      Tương đương {storyPoints * 4}h
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
                      {fixVersions?.versionName ?? "--"}
                    </p>
                  </TooltipTrigger>
                  {fixVersions?.versionName && (
                    <TooltipContent>
                      <p className="text-sm font-medium">
                        Dự kiến Golive ngày{" "}
                        {fixVersions?.releaseDate.split("T")[0]}
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-4 px-4">
              <span>
                Ticket được tạo ngày {task.createdAt.split("T")[0]} bởi{" "}
                {task.createdBy?.name}
              </span>
              <br />
              <span>Cập nhật lần cuối lúc {task.updatedAt.split("T")[0]}</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
