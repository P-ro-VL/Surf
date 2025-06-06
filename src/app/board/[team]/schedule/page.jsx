"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isToday,
  isEqual,
  addMonths,
  subMonths,
} from "date-fns";
import { vi } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScheduleDialog from "./dialog";

export default function SchedulePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [firstDayOfMonth, setFirstDayOfMonth] = useState(0);

  useEffect(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    setDaysInMonth(days);

    let firstDayIndex = getDay(start);
    if (firstDayIndex === 0) {
      firstDayIndex = 6;
    } else {
      firstDayIndex -= 1;
    }
    setFirstDayOfMonth(firstDayIndex);
  }, [currentMonth]);

  const today = new Date();
  const daysOfWeek = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "CN",
  ];

  const goToPreviousMonth = () => {
    setCurrentMonth((prevMonth) => subMonths(prevMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prevMonth) => addMonths(prevMonth, 1));
  };

  return (
    <div className="p-4 flex flex-col gap-3 w-full">
      <h1 className="text-2xl font-bold capitalize">Lịch</h1>
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={"outline"}
            onClick={goToPreviousMonth}
            aria-label="Tháng trước"
            className={"cursor-pointer"}
          >
            <ChevronLeft />
          </Button>
          <Button variant={"outline"}>
            {format(currentMonth, "MMMM yyyy", { locale: vi }).toUpperCase()}
          </Button>
          <Button
            variant={"outline"}
            onClick={goToNextMonth}
            aria-label="Tháng sau"
            className={"cursor-pointer"}
          >
            <ChevronRight />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-px border border-gray-200 bg-gray-200">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="py-2 text-center font-medium text-sm bg-gray-100"
            >
              {day}
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="bg-white h-24"></div>
          ))}
          {daysInMonth.map((day, index) => (
            <ScheduleDialog key={index} initDate={day}>
              <div
                key={index}
                className={`
              py-2 px-4 text-center h-24 flex flex-col items-start justify-start font-semibold cursor-pointer
               hover:bg-gray-100 transition-colors duration-150
              ${
                isToday(day)
                  ? "border-2 border-blue-500 bg-blue-50"
                  : "bg-white"
              }
              ${
                isEqual(day, today) && isToday(day)
                  ? "font-bold text-blue-600"
                  : ""
              }
            `}
              >
                <span className="text-sm">{format(day, "d")}</span>

                <div className="w-full flex mt-2 gap-2 justify-between">
                  <div className="flex gap-2">
                    <Video className="w-4 h-4" />
                    <span className="text-xs text-gray-500">
                      Backoffice Meeting
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 self-end">10:00</span>
                </div>
              </div>
            </ScheduleDialog>
          ))}
        </div>
      </div>
    </div>
  );
}
