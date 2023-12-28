import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(
    request:Request
) {
    try {
        const profile=await currentProfile()
        const {name,type}=await request.json();
        const {searchParams}=new URL(request.url)
        const serverId=searchParams.get("serverId")
        if(!profile){
            return new NextResponse("UnAuthorized User",{status:401})
        }
       if(!serverId){
        return new NextResponse("Missing serverID User",{status:401})
       }
       if(name==='general'){
        return new NextResponse("Name can not be General",{status:401})
       }
       const server=await db.server.update({
        where:{
            id:serverId,
            members:{
                some:{
                    profileId:profile.id,
                    role:{
                        in:[MemberRole.ADMIN,MemberRole.MODERATOR]
                    }
                },
                
            }
        },
        data:{
            channels:{
                create:{
                    profileId:profile.id,
                    name,
                    type
                }
            }
        }
       })

        return NextResponse.json(server)
        

    } catch (error) {
        console.log("Error from channels");
        return new NextResponse("Internal Error",{status:500})
    }
}