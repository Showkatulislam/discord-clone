import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid4 } from "uuid";
export async function PATCH(
    request:Request,
    {params}:{params:{serverId:string}}
){
    try {
        const profile=await currentProfile();
        if(!profile){
            return new NextResponse("Unothorized user",{status:404})
        }
        if(!params.serverId){
            return new NextResponse("Invalid data",{status:400})
        }

        const server=await db.server.update({
            where:{
             id:params.serverId,
             profileId:profile.id 
            },
            data:{
                inviteCode:uuid4()
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log("Error come from Invited Route api");

        return new NextResponse("Internal Error",{status:500})
        
    }
}