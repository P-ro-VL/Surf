"use client";

import { TimePickerInput } from "@/components/time-picker/time-picker-input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  AlarmClockCheck,
  Check,
  Clock,
  FilePlus,
  Link,
  Plus,
  Ticket,
  Trash,
  UserRoundPlus,
  Users,
  Video,
} from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const meeting = {
  name: "Backoffice Planning Sprint 7",
  date: "2025-06-04 10:00",
  link: "https://meet.google.com/abc-def-ghi",
  participants: [
    {
      name: "Nguyễn Văn A",
    },
  ],
  attachments: [
    {
      id: "ATTACHMENT-1",
      name: "Tài liệu 1",
      link: "https://www.google.com",
    },
    {
      id: "ATTACHMENT-2",
      name: "Tài liệu 2",
      link: "https://www.google.com",
    },
  ],
};

const users = [
  {
    name: "Nguyễn Văn A",
  },
  {
    name: "Nguyễn Văn B",
  },
  {
    name: "Nguyễn Văn C",
  },
];

export default function ScheduleDialog({ children, initDate }) {
  const [date, setDate] = useState(new Date(initDate));
  const [attendees, setAttendees] = useState(meeting.participants);
  const [platform, setPlatform] = useState("google-meet");
  const [link, setLink] = useState(meeting.link);

  const [attachments, setAttachments] = useState(meeting.attachments);
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentLink, setAttachmentLink] = useState("");

  const minuteRef = useRef(null);
  const hourRef = useRef(null);
  const secondRef = useRef(null);

  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-[40rem]">
        <div className="flex flex-col gap-2 px-4 py-6">
          {/* Tiêu đề */}
          <input
            type="text"
            placeholder="Thêm tiêu đề"
            className="text-xl font-medium outline-none border-b border-blue-500 pb-2"
          />

          {/* Thông tin ngày giờ */}
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-gray-700 mt-2">
                  <AlarmClockCheck className="w-5 h-5" />
                  <span>
                    {format(date, "EEEE, HH:mm dd/MMMM/yyyy", { locale: vi })}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">Cuộp họp sẽ diễn ra vào lúc:</p>
                <div className="flex items-end gap-2">
                  <div className="grid gap-1 text-center">
                    <Label htmlFor="hours" className="text-xs">
                      Giờ
                    </Label>
                    <TimePickerInput
                      picker="hours"
                      date={date}
                      setDate={setDate}
                      ref={hourRef}
                      onRightFocus={() => minuteRef.current?.focus()}
                    />
                  </div>
                  <div className="grid gap-1 text-center">
                    <Label htmlFor="minutes" className="text-xs">
                      Phút
                    </Label>
                    <TimePickerInput
                      picker="minutes"
                      date={date}
                      setDate={setDate}
                      ref={minuteRef}
                      onLeftFocus={() => hourRef.current?.focus()}
                      onRightFocus={() => secondRef.current?.focus()}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-gray-700 mt-2">
                  <Users className="w-5 h-5" />
                  <span>Người tham dự ({attendees.length})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {attendees.map((attendee) => (
                  <div
                    className="flex items-center justify-between"
                    key={attendee.name}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        LV
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{attendee.name}</p>
                      </div>
                    </div>
                    <Trash
                      className="w-4 h-4 text-red-500 cursor-pointer"
                      onClick={() => {
                        setAttendees(
                          attendees.filter((a) => a.name !== attendee.name)
                        );
                      }}
                    />
                  </div>
                ))}
                <Popover>
                  <PopoverTrigger>
                    <Button
                      variant="outline"
                      className="w-full mt-2 cursor-pointer"
                    >
                      <UserRoundPlus className="w-4 h-4" />
                      Thêm người tham dự
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Command>
                      <CommandInput
                        placeholder="Tìm kiếm người tham dự"
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>Không tìm thấy</CommandEmpty>
                        <CommandGroup>
                          {users
                            .filter(
                              (user) =>
                                !attendees.some((a) => a.name === user.name)
                            )
                            .map((user) => (
                              <CommandItem
                                key={user.name}
                                value={user.name}
                                onSelect={(currentValue) => {
                                  setAttendees([
                                    ...attendees,
                                    { name: currentValue },
                                  ]);
                                }}
                              >
                                {user.name}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-gray-700 mt-2">
                  <Video className="w-5 h-5" />
                  <span>
                    Nền tảng họp (
                    {platform.replace("-", " ").charAt(0).toUpperCase() +
                      platform.replace("-", " ").slice(1)}
                    )
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Select
                  value={platform}
                  onValueChange={(value) => setPlatform(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nền tảng họp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google-meet">Google Meet</SelectItem>
                    <SelectItem value="discord">Discord</SelectItem>
                  </SelectContent>
                </Select>
                {platform === "google-meet" && (
                  <Input
                    placeholder="Link cuộc họp (tạo cuộc họp dùng sau ở meet.google.com)"
                    className="mt-2"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-gray-700 mt-2">
                  <Link className="w-5 h-5" />
                  <span>Tài liệu đính kèm ({attachments.length})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="py-2 flex items-center justify-between cursor-pointer border-1 border-gray-200 rounded-sm px-4 mb-2 hover:bg-gray-100"
                    onClick={() => {
                      window.open(attachment.link, "_blank");
                    }}
                  >
                    {attachment.name}
                    <Trash
                      className="w-4 h-4 text-red-500 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAttachments(
                          attachments.filter((a) => a.id !== attachment.id)
                        );
                      }}
                    />
                  </div>
                ))}
                <Popover
                  onOpenChange={(_) => {
                    setAttachmentName("");
                    setAttachmentLink("");
                  }}
                >
                  <PopoverTrigger>
                    <Button
                      variant="outline"
                      className="w-full mt-2 cursor-pointer"
                    >
                      <FilePlus className="w-4 h-4" />
                      Thêm tài liệu đính kèm
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="flex flex-col gap-2">
                    <Input
                      placeholder="Tên tài liệu"
                      value={attachmentName}
                      onChange={(e) => setAttachmentName(e.target.value)}
                    />
                    <Input
                      placeholder="Link tài liệu"
                      value={attachmentLink}
                      onChange={(e) => setAttachmentLink(e.target.value)}
                    />
                    <Button
                      className="w-fit"
                      onClick={() => {
                        setAttachments([
                          ...attachments,
                          {
                            id: attachments.length + 1,
                            name: attachmentName,
                            link: attachmentLink,
                          },
                        ]);
                      }}
                    >
                      Thêm
                    </Button>
                  </PopoverContent>
                </Popover>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-end mt-4 ">
            <Button className={"cursor-pointer"}>
              <Plus className="w-4 h-4" />
              Thêm lịch họp
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
