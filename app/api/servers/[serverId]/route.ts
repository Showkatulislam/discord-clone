import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function  PATCH(
    request:Request,
    {params}:{params:{serverId:string}}
){
    const body=await request.json()
    const {name,image}=body
    try {

        const profile=await currentProfile()

        if(!profile){
            return new NextResponse("Unothorized User",{status:404})
        }

        const server=await db.server.update({
            where:{
                id:params.serverId,
                profileId:profile.id
            },
            data:{
                name:name,
                imageUrl:image
            }
        })

        return NextResponse.json(server)
        
    } catch (error) {
        console.log('SERVER ID PATCH',error);
        return new NextResponse("Internal Error",{status:500})
        
    }
}

export async function DELETE(
    req:Request,
    {params}:{params:{serverId:string}}
) {
    try {
        const profile=await currentProfile()

        if(!profile){
            return new NextResponse("Unothorized User",{status:404})
        }
        const {serverId}=params

        if(!serverId){
            return new NextResponse("Server Id is missing",{status:401})
        }
        const server=await db.server.delete({
            where:{
                id:serverId,
                profileId:profile.id
            }
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log("Error Come From Delete Server");
        return new NextResponse("Internal Error",{status:501})
        
    }
}