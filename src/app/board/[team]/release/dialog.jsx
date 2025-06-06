import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Fingerprint, Pencil, Plus } from "lucide-react";
import { Pie, PieChart } from "recharts";

const release = {
  name: "1.0.0",
  date: "10/06/2025",
  goal: "Đảm bảo tính sẵn sàng của hệ thống",
  status: "UNRELEASED",
  progress: 50,
  tickets: [
    {
      id: "task-1",
      content: "Lên kế hoạch cho buổi họp team sắp tới",
      overdue: false,
      duedate: "10/06/2025",
      labels: ["Vốn Hoá", "Test"],
      description: "Lên kế hoạch cho buổi họp team sắp tới",
      assignee: "Alice",
      storyPoints: 3,
      status: "IN_PROGRESS",
      createdAt: "2025-06-01",
      updatedAt: "2025-06-01",
      createdBy: "Alice",
      fixVersions: {
        name: "1.0.0",
        releaseDate: "2025-06-01",
        status: "RELEASED",
      },
      links: {
        design: "https://www.figma.com/design/1234567890/Design-Name",
        prd: "https://www.figma.com/design/1234567890/Design-Name",
        apiDoc: "https://www.figma.com/design/1234567890/Design-Name",
      },
      comments: [
        {
          id: "comment-1",
          content: "Comment 1",
          createdAt: "23:52:19 2025-06-01",
          createdBy: "Alice",
        },
      ],
    },
  ],
};

const chartData = [
  {
    status: "In Progress / Ready for Testing / In Testing",
    count: 8,
    fill: "blue",
  },
  { status: "Done / Obsolete", count: 5, fill: "green" },
  { status: "Backlog / Todo", count: 2, fill: "gray" },
];

const chartConfig = {
  inProgress: {
    label: "In Progress / Ready for Testing / In Testing",
    color: "blue",
  },
  done: {
    label: "Done / Obsolete",
    color: "green",
  },
  backlog: {
    label: "Backlog / Todo",
    color: "gray",
  },
};

export default function ReleaseDialog({ children, open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
      <DialogContent className="sm:max-w-[50vw] p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {release.name}
          </DialogTitle>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="outline"
                  className={"cursor-pointer"}
                  disabled={release.status === "RELEASED"}
                >
                  <Pencil className="w-4 h-4" />
                  <p className="text-sm font-medium">Chỉnh sửa</p>
                </Button>
              </TooltipTrigger>
              {release.status === "RELEASED" && (
                <TooltipContent>
                  <p className="text-sm font-medium">
                    Phiên bản này đã Golive. Không thể chỉnh sửa.
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </DialogHeader>
        <div className="w-full flex items-start gap-4">
          <div className="w-2/3">
            <p className="text-lg font-semibold mt-4">Mục tiêu</p>
            <p className="text-sm mt-2">{release.goal}</p>
            <p className="text-lg font-semibold mt-6 mb-2">
              Vấn đề/Chức năng Golive
            </p>
            {release.tickets.map((ticket) => (
              <div className="flex items-center gap-2 justify-between border-1 rounded-md px-4 py-3 cursor-pointer hover:bg-gray-50">
                <div
                  key={ticket.id}
                  className="w-full flex gap-2 items-center "
                >
                  <Fingerprint className="w-4 h-4 text-blue-500" />
                  <p className="text-sm font-medium">
                    {ticket.id.toUpperCase()}
                  </p>
                  <p className="text-sm w-96 truncate">{ticket.content}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={"outline"}
                    className={`${
                      ticket.status === "DONE" || ticket.status === "OBSOLETE"
                        ? "bg-green-50 text-green-700"
                        : [
                            "IN_PROGRESS",
                            "READY_FOR_TESTING",
                            "IN_TESTING",
                          ].includes(ticket.status)
                        ? "bg-blue-50 text-blue-700"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {ticket.status.toUpperCase().replace(/_/g, " ")}
                  </Badge>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        LV
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{ticket.assignee}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>

          <div className="w-1/3 flex flex-col gap-4">
            <div className="w-full border-1 rounded-md px-4 py-3">
              <p className="text-lg font-semibold mb-4">Thông tin</p>

              <Select defaultValue="unreleased">
                <SelectTrigger className="w-full rounded-sm">
                  <SelectValue value="unreleased" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unreleased">ĐANG CHỜ GOLIVE</SelectItem>
                  <SelectItem value="released">ĐÃ GOLIVE</SelectItem>
                </SelectContent>
              </Select>

              <div className={"grid grid-cols-2 gap-4 mt-2"}>
                <div className="w-full rounded-md py-3">
                  <p className="text-sm font-semibold mb-2">Ngày bắt đầu</p>
                  <p className="text-sm">10/06/2025</p>
                </div>
                <div className="w-full rounded-md py-3">
                  <p className="text-sm font-semibold mb-2">Ngày Golive</p>
                  <p className="text-sm">10/06/2025</p>
                </div>
              </div>
            </div>

            <div className="w-full border-1 rounded-md px-4 py-3">
              <div className={"flex items-center justify-between mb-4"}>
                <p className="text-lg font-semibold">Người duyệt</p>
                <Button
                  variant={"outline"}
                  className={"border-none cursor-pointer"}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    LV
                  </div>
                  <p className="text-sm font-semibold">Phạm Văn Linh</p>
                </div>
                <Select defaultValue="not_approved">
                  <SelectTrigger>
                    <SelectValue
                      value="not_approved"
                      placeholder="Trạng thái"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_approved">Chưa duyệt</SelectItem>
                    <SelectItem value="approved">Đã duyệt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="w-full border-1 rounded-md px-4 py-3">
              <p className="text-lg font-semibold mb-4">Tiến độ thực hiện</p>
              <Progress value={release.progress} color={"bg-blue-500"} />

              <div className="flex items-center gap-2 mt-4">
                <div className="w-2 h-2 bg-gray-500 rounded-full" />
                <p className="text-sm font-semibold">
                  Backlog/Todo:{" "}
                  <span className="text-gray-500 font-normal">
                    {
                      release.tickets.filter(
                        (ticket) =>
                          ticket.status === "BACKLOG" ||
                          ticket.status === "TODO"
                      ).length
                    }
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <p className="text-sm font-semibold">
                  In Progress/Ready for Testing/In Testing:{" "}
                  <span className="text-gray-500 font-normal">
                    {
                      release.tickets.filter(
                        (ticket) =>
                          ticket.status === "IN_PROGRESS" ||
                          ticket.status === "READY_FOR_TESTING" ||
                          ticket.status === "IN_TESTING"
                      ).length
                    }
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <p className="text-sm font-semibold">
                  Done/Obsolete:{" "}
                  <span className="text-gray-500 font-normal">
                    {
                      release.tickets.filter(
                        (ticket) =>
                          ticket.status === "DONE" ||
                          ticket.status === "OBSOLETE"
                      ).length
                    }
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
