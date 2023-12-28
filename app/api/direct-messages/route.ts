import currentProfile from "@/lib/current-profile"
import { db } from "@/lib/db";
import { DirectMessage} from "@prisma/client";
import { NextResponse } from "next/server"

const MESSAGES_BATCH=10
export async function GET(
    req:Request
){
    try {

        const profile=await currentProfile();

        const {searchParams}=new URL(req.url)

        
        const cursor=searchParams.get("cursor");
        const conversationId=searchParams.get("conversationId")
        
        if(!profile){
            return new NextResponse("Unothorized User,",{status:404})
        }
        if(!conversationId){
            return new NextResponse("conversationId Missing",{status:400})
        }
        let DirectMessages:DirectMessage[]=[]

        if(cursor){
            DirectMessages=await db.directMessage.findMany({
                take:MESSAGES_BATCH,
                skip:1,
                cursor:{
                    id:cursor
                },
                where:{
                   conversationId
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                },
                orderBy:{
                    createdAt:'desc'
                }
            })
        }
        else{
            DirectMessages=await db.directMessage.findMany({
                take:MESSAGES_BATCH,
                where:{
                conversationId
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                },
                orderBy:{
                    createdAt:"desc"
                }
            })
        }

        let nextCursor=null;

        if(DirectMessages.length===MESSAGES_BATCH){
            nextCursor=DirectMessages[MESSAGES_BATCH-1].id
        }
        
        return NextResponse.json({
            items:DirectMessages,
            nextCursor
        })
    } catch (error) {
        console.log("DireactMESSAGES_GET ERROR")
        return new NextResponse("Internal Error",{status:500})
    }
}