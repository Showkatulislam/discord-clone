"use client";

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../action-tooltip";
import { ModalType, useModal } from "@/hooks/use-model-store";

interface ServerchannelsProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="w-4 h-4" />,
  [ChannelType.AUDIO]: <Mic className="w-4 h-4" />,
  [ChannelType.VIDEO]: <Video className="w-4 h-4" />,
};
const Serverchannels = ({ channel, server, role }: ServerchannelsProps) => {
  const params = useParams();
  const router = useRouter();
  const icon = iconMap[channel.type];
  const {onOpen}=useModal()

  const  onClick=()=>{
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`)
  }

  const onAction=(e:MouseEvent,action:ModalType)=>{
    e.stopPropagation();
    onOpen(action,{server,channel})
  }
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex p-2 items-center gap-x-2 w-full hover:bg-zinc-700/50 hover:dark:bg-zinc-700/20 text-zinc-400 dark:text-zinc-300",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      {icon}
      <span
        className={cn(
          "line-clamp-1 font-semibold text-xs text-zinc-500 dark:text-zinc-300 group:hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {" "}
        {channel.name}
      </span>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit" side="top">
            <Edit className="w-4 h-4 text-zinc-500 hover:text-zinc-300 transition" onClick={(e:any)=>onAction(e,'editChannel')} />
          </ActionTooltip>
          <ActionTooltip label="Delete" side="top">
            <Trash onClick={(e:any)=>onAction(e,'deleteChannel')} className="w-4 h-4 text-zinc-500 hover:text-zinc-300 transition" />
          </ActionTooltip>
        </div>
      )}
      {
        channel.name==='general' &&(
            <Lock className="w-4 h-4 text-zinc-500 dark:text-zinc-400 ml-auto"/>
        )
      }
    </button>
  );
};

export default Serverchannels;