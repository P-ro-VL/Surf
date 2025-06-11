import { Zap, Bookmark, Fingerprint, Bug } from "lucide-react";

export const DEFAULT_URL = "https://api-jira.neureader.net/";

export const ticketStyles = {
  epic: {
    name: "Epic",
    textColor: "text-purple-500",
    borderColor: "border-purple-500",
    color: "bg-purple-50",
    icon: <Zap className="w-4 h-4 text-purple-500" />,
  },
  story: {
    name: "Story",
    textColor: "text-green-500",
    borderColor: "border-green-500",
    color: "bg-green-50",
    icon: <Bookmark className="w-4 h-4 text-green-500" />,
  },
  task: {
    name: "Task",
    textColor: "text-blue-500",
    borderColor: "border-blue-500",
    color: "bg-blue-50",
    icon: <Fingerprint className="w-4 h-4 text-blue-500" />,
  },
  bug: {
    name: "Bug",
    textColor: "text-red-500",
    borderColor: "border-red-500",
    color: "bg-red-50",
    icon: <Bug className="w-4 h-4 text-red-500" />,
  },
};

export const ticketRelations = [
  {
    type: "BLOCK",
    name: "Đang cản trở",
  },
  {
    type: "IS_BLOCKED_BY",
    name: "Bị cản trở bởi",
  },
  {
    type: "CLONE",
    name: "Sao chép ra từ",
  },
  {
    type: "DUPLICATE",
    name: "Trùng lặp với",
  },
];
