import { NextApiRequest } from "next";
import { NextApiResponseServerTo } from "@/types";
import currentProfilePage from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
export default async function handler(
    req:NextApiRequest,
    res:NextApiResponseServerTo
) {
    if(req.method!=='DELETE' && req.method!=='PATCH'){
        return res.status(404).json({error:"Method not allow"})
    }
    try {
        const profile=await currentProfilePage(req);
        const {directmessageId,conversationId}=req.query
        const {content,fileUrl}=req.body
        if(!profile){
            return res.status(404).json({error:"Unauthorized"})
        }

     
        if(!conversationId){
            return res.status(401).json({error:"Missing Conversation Id"})
        }
        if(!directmessageId){
            return res.status(401).json({error:"Missing Message Id"})
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



        let DirectMessage=await db.directMessage.findFirst({
            where:{
                id:directmessageId as string,
               conversationId:conversationId as string
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        })

        if(!DirectMessage){
            return res.status(404).json({error:"DireactMessage Not Found"})
        }

        const isMessageOwner=DirectMessage.memberId===member.id
        const isAdmin=member.role===MemberRole.ADMIN
        const isModerator=member.role===MemberRole.MODERATOR
        const canModify=isAdmin || isModerator || isMessageOwner

        if(!canModify){
            return res.status(401).json({error:'unauthorized'})
        }

        if(req.method==='DELETE'){
            DirectMessage=await db.directMessage.update({
                where:{
                    id:directmessageId as string
                },
                data:{
                    fileUrl:null,
                    content:"This message has been deleted",
                    deleted:true
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                }
            })
        }

        if(req.method==='PATCH'){
            if(!isMessageOwner){
                return res.status(401).json({error:"Unauthorized"})
            }
            DirectMessage=await db.directMessage.update({
                where:{
                    id:directmessageId as string
                },
                data:{
                    content,
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                }
            })
        }

        const updateKey=`chat:${conversation.id}:messages:update`
        res?.socket?.server?.emit(updateKey,DirectMessage);
        return res.status(200).json(DirectMessage)
    } catch (error) {
        console.log("[DirectMessage_ID]",error);
        return res.status(500).json({error:"Internal Error"})
        
    }
}