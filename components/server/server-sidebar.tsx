import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import Serversearch from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import { ServerSection } from "./server-section";
import Serverchannels from "./server-channels";
import Servermember from "./server-member";
interface ServerSidebarProps {
  serverId: string;
}
const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const memberIconRoleMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 text-rose-500" />,
    [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
  };

  const chennalIconRoleMap = {
    [ChannelType.AUDIO]: <Mic className="w-4 h-4 ml-2" />,
    [ChannelType.VIDEO]: <Video className="w-4 h-4 ml-2" />,
    [ChannelType.TEXT]: <Hash className="w-4 h-4 ml-2" />,
  };

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  const role = server?.members.find(
    (memeber) => memeber.profileId === profile.id
  )?.role;
  console.log(role);
  return (
    <div className="flex flex-col h-full w-full text-primary dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server!} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <Serversearch
            data={[
              {
                label: "Text chennals",
                type: "chennal",
                data: textChannels?.map((chennal) => ({
                  id: chennal.id,
                  name: chennal.name,
                  icon: chennalIconRoleMap[chennal.type],
                })),
              },
              {
                label: "Voice chennals",
                type: "chennal",
                data: audioChannels?.map((chennal) => ({
                  id: chennal.id,
                  name: chennal.name,
                  icon: chennalIconRoleMap[chennal.type],
                })),
              },
              {
                label: "Video chennals",
                type: "chennal",
                data: videoChannels?.map((chennal) => ({
                  id: chennal.id,
                  name: chennal.name,
                  icon: chennalIconRoleMap[chennal.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: memberIconRoleMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-300 my-2 dark:bg-zinc-700" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType="TEXT"
              server={server!}
              role={role}
              label="Text channels"
            />
          </div>
        )}
        <div className="mb-2">
          {textChannels?.map((channel) => (
            <Serverchannels
              key={channel.id}
              channel={channel}
              role={role}
              server={server!}
            />
          ))}
        </div>
        <Separator className="bg-zinc-300 my-2 dark:bg-zinc-700" />
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType="AUDIO"
              server={server!}
              role={role}
              label="Audio channels"
            />
          </div>
        )}
        <div className="mb-2">
          {audioChannels?.map((channel) => (
            <Serverchannels
              key={channel.id}
              channel={channel}
              role={role}
              server={server!}
            />
          ))}
        </div>
        <Separator className="bg-zinc-300 my-2 dark:bg-zinc-700" />
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType="VIDEO"
              server={server!}
              role={role}
              label="video channels"
            />
          </div>
        )}
        <div className="mb-2">
          {videoChannels?.map((channel) => (
            <Serverchannels
              key={channel.id}
              channel={channel}
              role={role}
              server={server!}
            />
          ))}
        </div>

        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={role}
              label="Members"
              server={server!}
            />

            <div className="space-y-2">
              {members.map(member=>(
                <Servermember
                key={member.id}
                 member={member}
                 server={server!}
                />
              ))}

            </div>
          </div>

        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
