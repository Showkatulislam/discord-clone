import { Hash, Menu } from "lucide-react";
import Mobiletoggle from "../mobile-toggle";
import UserAvatar from "../Avatar";
import { SocketProvider } from "../provider/socket-provider";
import { SocketIndicator } from "../socket-indicator";
import { ChatVideoButton } from "../chat-video-button";

interface ChatHeaderProps{
    serverId:string,
    name:string
    type:'channel' | "conversation"
    ImageUrl?:string
}
const ChatHeader = ({
    serverId,
    name,
    type,
    ImageUrl
}:ChatHeaderProps) => {
    return (
        <div className="text-lg font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
          <Mobiletoggle serverId={serverId}/>
          {type==="channel" &&(
            <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2"/>
          )}

          {
            type==='conversation' &&(
              <UserAvatar src={ImageUrl} className="w-8 h-8 mr-2"/>
            )
          }
            <p className="font-semibold text-base text-black dark:text-white">
            {name}
           </p>
           <div className="ml-auto flex items-center">
             {
              type==="conversation" && (
                <ChatVideoButton/>
              )
             }
              <SocketIndicator/>
           </div>
        </div>
    );
};

export default ChatHeader;