import { NextApiRequest } from "next";
import { NextApiResponseServerTo } from "@/types";
import currentProfilePage from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
export default async function handler(
    req:NextApiRequest,
    res:NextApiResponseServerTo
) {
    if(req.method!=='POST'){
        return res.status(405).json({error:"method not allow"})
   }
    try {
        const profile=await currentProfilePage(req);
        const {conversationId}=req.query
        const {content,fileUrl}=req.body
        if(!profile){
            return res.status(404).json({error:"Unauthorized"})
        }

        if(!conversationId){
            return res.status(401).json({error:"Missing Conversation Id"})
        }
 
        const conversation=await db.conversation.findFirst({
            where:{
                id:conversationId as string,
                OR:[
                    {
                        memberOne:{
                            profileId:profile.id
                        }
                    },{
                        memberTwo:{
                           profileId:profile.id 
                        }
                    }
                ]
            },
            include:{
                memberOne:{
                    include:{
                        profile:true
                    }
                },
                memberTwo:{
                    include:{
                        profile:true
                    }
                }
            }
        })
        if(!conversation){
            return res.status(404).json({error:"Conversation Not Found"})
        }


        const member=conversation.memberOne.profileId===profile.id?conversation.memberOne:conversation.memberTwo
        if(!member){
            return res.status(404).json({error:"Member Not Found"})
        }

        const directMessage=await db.directMessage.create({
            data:{
                content,
                fileUrl,
                conversationId:conversationId as string,
                memberId:member.id
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        })
        const channelKey=`chat:${conversationId}:messages`

        res?.socket?.server?.io?.emit(channelKey,directMessage)
        return res.status(200).json(directMessage)
    } catch (error) {
        console.log("DirectMessages post error",error);
        return res.status(500).json({message:"internal error"})
    }
}