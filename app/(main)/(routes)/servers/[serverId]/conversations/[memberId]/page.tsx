import ChatHeader from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/chat-input';
import ChatMessages from '@/components/chat/chat-messages';
import { MediaRoom } from '@/components/media-room';
import { getOrCreateConversation } from '@/lib/conversation';
import currentProfile from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';
interface MemberIdPageProps{
    params:{
        serverId:string,
        memberId:string
    },
    searchParams:{
        video?:boolean
    }
}
const MemberIdPage = async({params,searchParams}:MemberIdPageProps) => {
    const profile=await currentProfile();
    if(!profile){
        return redirectToSignIn();
    }

    const CurrentMember=await db.member.findFirst({
        where:{
            serverId:params.serverId,
            profileId:profile.id
        },
        include:{
            profile:true
        }
    })
    if(!CurrentMember){
        return redirect('/')
    }
    const conversation=await getOrCreateConversation(CurrentMember.id,params.memberId);

    if(!conversation){
        redirect(`/servers/${params.serverId}`)
    }

    const {memberOne,memberTwo}=conversation

    const otherProfile=memberOne.profileId===profile.id?memberTwo:memberOne

    return (
        <div className='h-full  bg-white dark:bg-[#313338] flex flex-col'>
            <ChatHeader type='conversation' ImageUrl={otherProfile.profile.imageUrl} name={otherProfile.profile.name} serverId={params.serverId}/>
            {searchParams.video && (
                <MediaRoom chatId={conversation.id} video={true} audio={true}/>
            )}
            {!searchParams.video && (
                <>
            <ChatMessages
            name={otherProfile.profile.name}
            member={CurrentMember}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            socketUrl="/api/socket/direct-messages"
            socketQuery={
            {
                conversationId:conversation.id
            }}
            paramKey="conversationId"
            paramValue={conversation.id}
            />
            <ChatInput
            name={otherProfile.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
                conversationId:conversation.id
            }}
            />
                
                </>
            )}
            
            
        </div>
    );
};

export default  MemberIdPage;