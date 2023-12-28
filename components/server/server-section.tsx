"use client";
import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole, ChannelType } from "@prisma/client";
import { ActionTooltip } from "../action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-model-store";

interface ServerHeaderProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}
export const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerHeaderProps) => {
  const { onOpen } = useModal();
  console.log(sectionType,role)
  return (
    <div className="flex justify-between items-center py-2">
      <p
        className="
            text-xs 
            uppercase
            font-bold
            text-zinc-300
            dark:text-zinc-500"
      >
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip label="Create a channel" side="top">
          <button
            onClick={() => onOpen("createChennel", { channelType,server })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 hover:dark:text-zinc-200 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
 {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            onClick={() => onOpen("members", {  channelType,server })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};
