"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authService } from "@/services/auth";
import { textToColor } from "@/utils/color_utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StackedAvatars({
  avatars,
  size = 40,
  defaultValue,
  className,
  onChange,
}) {
  const [selectedAvatar, setSelectedAvatar] = useState(
    defaultValue
      ? avatars.indexOf(avatars.find((avatar) => avatar.id === defaultValue))
      : null
  );

  const handleAvatarClick = (idx, e) => {
    e.preventDefault();
    setSelectedAvatar(selectedAvatar === idx ? null : idx);
    onChange(selectedAvatar === idx ? null : avatars[idx]);
  };

  return (
    <div className={`flex items-center relative ${className}`}>
      {avatars.map((avatar, idx) => (
        <Tooltip.Provider key={idx} delayDuration={0}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Link
                href={avatar.href || "#"}
                className={`absolute hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 rounded-full transition-all ${
                  selectedAvatar === idx
                    ? "ring-2 ring-blue-500 ring-offset-2"
                    : ""
                }`}
                style={{
                  left: idx * size * 0.75, // Adjust overlap
                  zIndex: selectedAvatar == idx ? 1000 : avatars.length - idx,
                  backgroundColor: `#${textToColor(avatar.name)}`,
                }}
                onClick={(e) => handleAvatarClick(idx, e)}
              >
                <Avatar
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: `#${textToColor(avatar.name)}`,
                  }}
                  className="rounded-full border-2 border-white overflow-hidden"
                >
                  <AvatarFallback
                    className="text-white font-bold"
                    style={{
                      backgroundColor: `#${textToColor(avatar.name)}`,
                    }}
                  >
                    {avatar.name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Content
              side="top"
              align="center"
              className="bg-black text-white px-2 py-1 rounded text-xs shadow"
            >
              {avatar.name || "Unknown"}
              <Tooltip.Arrow className="fill-black" />
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      ))}
    </div>
  );
}
