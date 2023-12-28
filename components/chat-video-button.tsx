"use client"
import qs from "query-string"
import { usePathname,useSearchParams,useRouter } from "next/navigation"

import {Video,VideoOff} from 'lucide-react'

import { ActionTooltip } from "./action-tooltip"

export const ChatVideoButton=()=>{
    const pathName=usePathname()
    const router=useRouter()
    const searchparams=useSearchParams();
    const isVideo=searchparams?.get("video")

    const Icon=isVideo?VideoOff:Video
    const tooltiplabel=isVideo?"End Video Call":"Start Video Call"


    const onClick=()=>{
        const url=qs.stringifyUrl({
            url:pathName || "",
            query:{
                video:isVideo?undefined:true
            }
        },{skipNull:true})
        router.push(url)
    }
    return (
        <ActionTooltip side="bottom" label={tooltiplabel}>
            <button onClick={onClick} className="hover:opacity-75 transition mr-4">
                <Icon className="h-6 w-6 text-zinc-500"/>
            </button>
        </ActionTooltip>
    )
}