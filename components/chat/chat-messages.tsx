"use client"
import { Member, Message, Profile } from '@prisma/client';
import React, { ElementRef, Fragment, useRef } from 'react';
import {format} from 'date-fns'
import ChatWelcome from './chat-welcome';
import { useChatQuery } from '@/hooks/use-chat-query';
import { Loader2, ServerCrash } from 'lucide-react';
import ChatItems from './Chat-items';
import { useChatSocket } from '@/hooks/use-chat-socket';
import { useChatScroll } from '@/hooks/use-chat-scroll';
interface ChatMessagesProps{
    name:string,
    member:Member,
    chatId:string,
    apiUrl:string,
    socketUrl:string,
    socketQuery:Record<string,string>,
    paramKey:'channelId' | "conversationId",
    paramValue:string,
    type:"channel" | "conversation"

}

const DATE_FORMAT='d MMM yyyy,HH:mm'

type MessageWithMember=Message &{
    member:Member & {
        profile:Profile
    }
}

const ChatMessages = (
{
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type
}:ChatMessagesProps) => {
    const queryKey = `chat:${chatId}`;
    const addKey=`chat:${chatId}:messages`
    const updateKey=`chat:${chatId}:messages:update`

    const bottomRef=useRef<ElementRef<"div">>(null);
    const chatRef=useRef<ElementRef<"div">>(null);
    useChatSocket({queryKey,addKey,updateKey})
    const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    status
    }=useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
    })

    useChatScroll({
        chatRef,bottomRef,
        loadMore:fetchNextPage,shouldLoadMore:!isFetchingNextPage && !!hasNextPage,count:data?.pages?.[0]?.items?.length??0
    })
    
    if(status==="pending"){
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin"/>
                <p className='text-xs text-zinc-500 dark:text-zinc-400'>
                    loading ....
                </p>
            </div>
        )
    }

    if(status==='error'){
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <ServerCrash className="h-7 w-7 text-zinc-500 "/>
                <p className='text-xs text-zinc-500 dark:text-zinc-400'>
                    Internal Error
                </p>
            </div>
        )
    }
    return (
        <div ref={chatRef} className='flex-1 flex flex-col py-4 overflow-y-auto'>
            {!hasNextPage &&<div className='flex-1'/>}
            {!hasNextPage && (<ChatWelcome name={name} type={type}/>)}
            {
                hasNextPage && (
                    <div className='flex justify-center'>
                        {isFetchingNextPage?(
                            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4"/>
                        ):(
                            <button 
                            onClick={()=>fetchNextPage}
                            className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-200 transition'>
                                load previous message
                            </button>
                        )}
                    </div>
                )
            }
            <div className='flex flex-col-reverse mt-auto'>
                {
                  data?.pages?.map((group,i)=>(
                    <Fragment key={i}>
                        {group?.items?.map((message:MessageWithMember)=>(
                            <ChatItems 
                            key={message.id}
                            id={message.id}
                            currentMember={member}
                            member={message.member}
                            content={message.content}
                            fileUrl={message.fileUrl}
                            deleted={message.deleted}
                            timestamp={format(new Date(message.createdAt),DATE_FORMAT)}
                            isUpdated={message.updatedAt!==message.createdAt}
                            socketUrl={socketUrl}
                            socketQuery={socketQuery}
                            />
                        ))}
                    </Fragment>
                  ))  
                }
            </div>  
            <div ref={bottomRef}/>
        </div>
    );
};

export default ChatMessages;