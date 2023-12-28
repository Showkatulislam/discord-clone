"use client"
import { ServerWithMembersWithProfiles } from "@/types";
import {MemberRole } from "@prisma/client";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useModal } from "@/hooks/use-model-store";

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles;
    role?: MemberRole;
};

const ServerHeader = ({server,role}:ServerHeaderProps) => {   
    const {onOpen}=useModal() 
    const isAdmin=role===MemberRole.ADMIN
    const isModerator=isAdmin|| role===MemberRole.MODERATOR
    return (
        <DropdownMenu>
            <DropdownMenuTrigger   
             className="focus:outline-none" 
              asChild>
                <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
                    {server.name}
                    <ChevronDown className="w-5 h-5 ml-auto"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-xs text-black dark:text-neutral-400 space-y-[2px]">
                {
                    isModerator &&(
                        <DropdownMenuItem 
                        onClick={()=>onOpen('invite',{server})}
                        className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer">
                            invite people 
                            <UserPlus className="h-4 w-4 ml-auto"></UserPlus>
                        </DropdownMenuItem>
                    )
                }
                {
                    isAdmin &&(
                        <DropdownMenuItem
                        onClick={()=>onOpen('editServer',{server})}
                        className=" px-3 py-2 text-sm cursor-pointer">
                           Server Settings
                           <Settings className="w-4 h-4 ml-auto"/>
                        </DropdownMenuItem>
                    )
                }
                {
                    isAdmin &&(
                        <DropdownMenuItem 
                        onClick={()=>onOpen('members',{server})}
                        className=" px-3 py-2 text-sm cursor-pointer">
                           Manage Members
                           <Users className="w-4 h-4 ml-auto"/>
                        </DropdownMenuItem>
                    )
                }
                {
                    isModerator &&(
                        <DropdownMenuItem 
                        onClick={()=>onOpen('createChennel',{server})}
                        className=" px-3 py-2 text-sm cursor-pointer">
                           Create Channel
                           <PlusCircle className="w-4 h-4 ml-auto"/>
                        </DropdownMenuItem>
                    )
                }
                {
                    isModerator &&(
                        <DropdownMenuSeparator/>
                    )
                }
                {
                    isAdmin &&(
                        <DropdownMenuItem onClick={()=>onOpen('deleteServer',{server})} className=" px-3 py-2 text-sm cursor-pointer text-rose-500">
                           Delete Server
                           <Trash className="w-4 h-4 ml-auto"/>
                        </DropdownMenuItem>
                    )
                }
                {
                    !isAdmin &&(
                        <DropdownMenuItem 
                        onClick={()=>onOpen('leaveServer',{server})}
                        className=" px-3 py-2 text-sm cursor-pointer text-rose-500">
                           Leave
                           <LogOut className="w-4 h-4 ml-auto"/>
                        </DropdownMenuItem>
                    )
                }

            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ServerHeader;