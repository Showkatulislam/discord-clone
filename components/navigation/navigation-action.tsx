'use client'
import { Plus } from "lucide-react"
import { ActionTooltip } from "../action-tooltip"
import { useModal } from "@/hooks/use-model-store"
export const NavigationAction=()=>{
    const {onOpen}=useModal()
    return (
        <div>
            <ActionTooltip 
            label="Add a server"
            side="right"
            align="center">
            <button onClick={()=>onOpen('createServer')} className="group flex items-center">
            <div className="flex mx-3 h-12 w-12 rounded-full group-hover:rounded-2xl transition-all overflow-hidden items-center justify-center bg-transparent dark:bg-neutral-700 group-hover:bg-emerald-500">
                <Plus className="group-hover:text-white transition-all text-emerald-500">

                </Plus>
            </div>
           </button>
            </ActionTooltip>
        </div>
    )
}