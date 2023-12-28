import currentProfile from "@/lib/current-profile"
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server"

export async function DELETE(
    req:Request,
    {params}:{params:{channelId:string}}
) {
    try {
        const profile=await currentProfile();
        const {searchParams}=new URL(req.url)

        if(!profile) return new NextResponse("Unauthorized user",{status:400})

        const serverId=searchParams.get("serverId");

        if(!serverId){
            return new NextResponse("Server Id is Missing",{status:401})
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
                    }
                }
            },
            data:{
                channels:{
                    delete:{
                        id:params.channelId,
                        name:{
                            not:'general'
                        }
                    }
                }
            }
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log("ERORR COME FROM DELETE CHANNEL")
        return new NextResponse("Internal Error",{status:5000})
    }
    
}
export async function PATCH(
    req:Request,
    {params}:{params:{channelId:string}}
) {
    try {
        const profile=await currentProfile();
        const {searchParams}=new URL(req.url)
        const {name,type}=await req.json();

        if(!profile) return new NextResponse("Unauthorized user",{status:400})

        const serverId=searchParams.get("serverId");

        if(!serverId){
            return new NextResponse("Server Id is Missing",{status:401})
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
                    }
                }
            },
            data:{
                channels:{
                    update:{
                        where:{
                            id:params.channelId,
                            NOT:{
                                name:'general'
                            }
                        },
                        data:{
                            name,
                            type
                        }
                    }
                }
            }
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log("ERORR COME FROM EDIT CHANNEL")
        return new NextResponse("Internal Error",{status:5000})
    }
    
}