'use client'
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ReactNode } from "react"
interface toolTipProps{
    label:string
    children:ReactNode,
    side?:"top" | "right" | "bottom" |"left"
    align?:"start" | "center" | "end"
}
export const ActionTooltip=({
    label,
    children,
    side,
    align
}:toolTipProps)=>{
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    <p className="font-semibold text-sm capitalize">
                        {label.toLowerCase() }
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}