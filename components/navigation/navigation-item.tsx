"use client"
import Image from "next/image"
import { useParams,useRouter } from "next/navigation"
import { ActionTooltip } from "../action-tooltip"
import { cn } from "@/lib/utils"
interface NavigationItemProps{
    id:string,
    imageUrl:string,
    name:string
}
export const NavigationItem=({
name,
imageUrl,
id
}:NavigationItemProps)=>{
    const params=useParams()
    const router=useRouter()
    const onClick=()=>{
        router.push(`/servers/${id}`)
    }
    return(
        <div>
           <ActionTooltip label={name} side="right" align="center">
            <div>
                <button 
                onClick={onClick}
                className="group relative flex items-center justify-center">
                    <div 
                    className={cn("absolute left-0 bg-primary rounded-full transition-all w-[4px]",
                    params?.serverId!==id && 'group-hover:h-[20px]',
                    params?.serverId===id ?'h-[36px]':"h-[8px]"
                    )}/>
                    <div className={cn("relative flex mx-3 h-12 w-12 rounded-3xl group-hover:rounded-2xl transition-all overflow-hidden",params.serverId===id&& 'bg-primary/10 text-primary rounded-2xl')}>
                        <Image fill alt="image" src={imageUrl}/>
                    </div>
                    
                </button>
            </div>
            </ActionTooltip>
        </div>
    )
}