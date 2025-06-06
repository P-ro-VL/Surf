"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, PackageOpen, Plus } from "lucide-react";
import ReleaseDialog from "./dialog";

import { useState } from "react";

const releases = [
  {
    name: "1.0.0",
    date: "10/06/2025",
    goal: "Đảm bảo tính sẵn sàng của hệ thống",
    status: "UNRELEASED",
    progress: 50,
  },
  {
    name: "1.0.1",
    date: "10/06/2025",
    goal: "Đảm bảo tính sẵn sàng của hệ thống",
    status: "RELEASED",
    progress: 100,
  },

  {
    name: "1.0.2",
    date: "10/06/2025",
    goal: "Đảm bảo tính sẵn sàng của hệ thống",
    status: "UNRELEASED",
    progress: 20,
  },
  {
    name: "1.0.3",
    date: "10/06/2025",
    goal: "Đảm bảo tính sẵn sàng của hệ thống",
    status: "UNRELEASED",
    progress: 10,
  },
];

export default function ReleasePage() {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <ReleaseDialog open={open} onOpenChange={setOpen}>
        <div className="p-4 flex flex-col gap-3 w-full">
          <h1 className="text-2xl font-bold capitalize">Golive</h1>

          <div className="mt-4 mb-2 w-full border-1 border-blue-500 bg-blue-50 rounded-sm px-4 py-5 flex items-center justify-between gap-2 text-blue-700">
            <div className="flex items-center gap-8">
              <PackageOpen className="w-10 h-10 " />
              <div className="flex flex-col gap-2">
                <p className="text-lg font-bold p-0">
                  Đang chuẩn bị cho đợt Golive sắp tới ngày 10/06/2025 [1.0.0]
                </p>
                <p className="font-medium">Mục tiêu:</p>
                <ul className="list-disc list-inside">
                  <li>Đảm bảo tính sẵn sàng của hệ thống</li>
                  <li>Đảm bảo tính sẵn sàng của hệ thống</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="cursor-pointer" variant={"outline"}>
                Chi tiết lịch Golive
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center mt-4">
              <Input placeholder="Tìm kiếm phiên bản" className={"w-80"} />
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="unreleased">Chưa Golive</SelectItem>
                  <SelectItem value="released">Đã Golive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="cursor-pointer">
              <Plus className="w-4 h-4" />
              Thêm phiên bản
            </Button>
          </div>

          <Table className={"border-1 rounded-md mt-2"}>
            <TableHeader>
              <TableHead className="w-1/4">Tên phiên bản</TableHead>
              <TableHead className="w-80">Ngày Golive</TableHead>
              <TableHead>Tiến độ</TableHead>
              <TableHead className="w-80">Trạng thái</TableHead>
            </TableHeader>
            <TableBody>
              {releases.map((release, index) => (
                <TableRow
                  key={index}
                  className={`cursor-pointer`}
                  onClick={() => setOpen(true)}
                >
                  <TableCell
                    className={`${
                      release.status === "UNRELEASED"
                        ? "text-blue-700"
                        : "text-green-700"
                    }`}
                  >
                    {release.name}
                  </TableCell>
                  <TableCell>{release.date}</TableCell>
                  <TableCell>
                    <Progress
                      value={release.progress}
                      color={
                        release.status === "UNRELEASED"
                          ? "bg-blue-500"
                          : "bg-green-700"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={"outline"}
                      className={`font-bold ${
                        release.status === "UNRELEASED"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {release.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ReleaseDialog>
    </div>
  );
}
