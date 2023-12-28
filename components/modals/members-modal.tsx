"use client";

import { useModal } from "@/hooks/use-model-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "../ui/dialog";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../Avatar";
import { Check, Gavel, Loader, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useState } from "react";
import { 
  DropdownMenuTrigger
  ,DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuItem,
  DropdownMenuSeparator
 } from "@/components/ui/dropdown-menu";
import { DropdownMenuSubTrigger } from "@radix-ui/react-dropdown-menu";
import { MemberRole } from "@prisma/client";
import qs from 'query-string'
import axios from "axios";
import { useRouter } from "next/navigation";
const roleIconMap={
  'GUEST':null,
  'MODERATOR':<ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
  'ADMIN':<ShieldAlert className="h-4 w-4 ml-2 text-rose-500"/>
}

export const MembersModal = () => {
    const [loadingId,setLoadingId]=useState("")
    const {isOpen,onClose,type,data,onOpen}=useModal()
    const OpenInvitedModal=isOpen && type==='members'
    const {server}=data as {server:ServerWithMembersWithProfiles}
    const router=useRouter()

    const OnRoleChange=async(memberId:string,role:MemberRole)=>{
      try {
        setLoadingId(memberId)
        const url=qs.stringifyUrl({
          url:`/api/members/${memberId}`,
          query:{
            serverId:server?.id,
            memberId
          }
        })
        const response=await axios.patch(url,{role})
        router.refresh()
        onOpen("members",{server:response.data})
      } catch (error) {
        console.log(error)
      }
      finally{
        setLoadingId("")
      }
    }
  return (
    <Dialog open={OpenInvitedModal} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
           Manage Members
          </DialogTitle>
        <DialogDescription className="tex-center text-zinc-500">
            {server?.members?.length} Members
        </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <ScrollArea className="mt-8 max-h-[410px] pr-8">
            {
              server?.members?.map((member)=>(
                <div key={member.id} className="flex items-center gap-x-2 mb-6">
                <UserAvatar src={member?.profile?.imageUrl}/>

                <div className="flex flex-col gap-y-3">
                  <div className="text-base font-semibold flex items-center gap-x-2">
                    {member?.profile?.name}
                    {roleIconMap[member.role]}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {member.profile?.email}
                  </p>
                </div>
                {
                  server.profileId!==member.profileId && loadingId!==member.id && (
                    <div className="ml-auto">
                     <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="w-4 h-4 text-zinc-500"/>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger
                            className="flex items-center">
                                <ShieldQuestion className="w-4 h-4"/>
                                <span>Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem onClick={()=>OnRoleChange(member.id,"GUEST")}>
                                <Shield className="w-4 h-4"/>
                                Guest
                                {member.role==="GUEST" &&(
                                  <Check className="h-4 w-4 ml-auto"/>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={()=>OnRoleChange(member.id,"MODERATOR")}>
                                <Shield className="w-4 h-4"/>
                                Moderator
                                {member.role==="MODERATOR" &&(
                                  <Check className="h-4 w-4 ml-auto"/>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator/>
                          <DropdownMenuItem>
                            <Gavel/>
                            kick
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                     </DropdownMenu>
                    </div>
                  )
                }
                {loadingId===member.id && (
                  <Loader className="animate-spin text-zinc-500 ml-auto w-4 h-4"/>
                )}
                </div>
              ))
            }
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};



