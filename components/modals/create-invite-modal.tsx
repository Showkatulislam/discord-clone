"use client";

import { useModal } from "@/hooks/use-model-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Check, Copy, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";

const CreateInviteModal = () => {
    const [copied,setCopied]=useState(false)
    const [loading,setLoading]=useState(false)
    const {isOpen,onClose,type,data,onOpen}=useModal()
    const OpenInvitedModal=isOpen && type==='invite'

    const {server}=data
    const origin=useOrigin()
    const inviteUrl=`${origin}/invite/${server?.inviteCode}`

    const onCopy=()=>{
      setCopied(true)
      navigator.clipboard.writeText(inviteUrl);
      setTimeout(()=>{
        setCopied(false)
      },1000)
    }

    const onNew=async()=>{
      try {
        setLoading(true);
        const res =await axios.patch(`/api/servers/${server?.id}/invite`)
        onOpen("invite",{server:res.data})
      } catch (error) {
        console.log(error);
      }
      finally{
        setLoading(false)
      }
    }
  return (
    <Dialog open={OpenInvitedModal} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
           Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
            <Label className="uppercase text-sm font-bold text-zinc-500 dark:text-secondary/70">Server invite Link</Label>
            <div className="flex items-center mt-2 space-x-2">
                <Input
                disabled={loading}
                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                value={inviteUrl}
                />
               <Button 
                disabled={loading}
                onClick={onCopy} 
                size="icon">
                {copied?<Check className="w-4 h-4"/>: <Copy className="w-4 h-4"/>}
              
               </Button>
            </div>
        </div>
        <DialogFooter>
            <Button
            disabled={loading}
            onClick={onNew}
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-4">
                Generate Link
                <RefreshCcw className="w-4 h-4 ml-2"/>
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInviteModal;

