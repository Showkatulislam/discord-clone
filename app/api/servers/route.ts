import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import {v4 as uuid4} from 'uuid'
export async function POST(request:Request){
    try {
        const body=await request.json();
        const profile=await currentProfile()
        const {name,image}=body
        if(!profile){
            return new NextResponse("Unothorized",{status:401})
        }
        const server=await db.server.create({
            data:{
             profileId:profile.id,
             name,
             imageUrl:image,
             inviteCode:uuid4(),
             channels:{
                create:[
                {name:"general",profileId:profile.id}
                ]
             },
             members:{
                create:[
                    {profileId:profile.id,role:MemberRole.ADMIN}
                ]
             }
            }
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log("SERVERS_POST",error)
        return new NextResponse("Internal Error",{status:501})
    }
}