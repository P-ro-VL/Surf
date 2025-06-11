"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowUpRight, Terminal, Video } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

// const meeting = {
//   name: "Backoffice Planning Sprint 7",
//   time: "10:00",
//   date: "2025-06-04",
//   link: "https://meet.google.com/abc-def-ghi",
// };
const meeting = undefined;

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-50 w-full items-center border-b flex">
      {meeting ? (
        <>
          <Alert className={"border-none"}>
            <Video />
            <AlertTitle className={"text-md font-bold"}>
              Chú ý! Cuộc họp {meeting.name} sắp bắt đầu!
            </AlertTitle>
            <AlertDescription>
              Buổi họp sẽ bắt đầu lúc {meeting.time} trên Google Meet. Bấm vào
              nút bên cạnh để tham gia.
            </AlertDescription>
          </Alert>
          <Button className={"mx-4 px-4 flex gap-2 cursor-pointer"}>
            <Link href={meeting.link} target="_blank">
              Tham gia họp
            </Link>
            <ArrowUpRight />
          </Button>
        </>
      ) : (
        <div className="w-full h-14 flex items-center justify-start px-4">
          <p className="text-2xl font-bold">NEU Reader Innovators</p>
        </div>
      )}
    </header>
  );
}
