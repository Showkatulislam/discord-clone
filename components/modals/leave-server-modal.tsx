"use client";
import { Button } from "@/components/ui/button";
import axios from 'axios'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-model-store";
import { useState } from "react";



export const LeaveServerModal = () => {
  const {isOpen, onClose, type,data}=useModal()
  const {server}=data
  const [loading,setLoading]=useState(false)
  const isModalOpen=isOpen && type==='leaveServer'
  const router=useRouter()

  const clickToLeave=async()=>{
    try {
      setLoading(true)
      await axios.patch( `/api/servers/${server?.id}/leave`)
      onClose()
      router.refresh()
    } catch (error) {
      console.log(Error);
    }
    finally{
      setLoading(false)
    }
  }
 
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
    <DialogContent className="bg-white text-black p-0 overflow-hidden">
      <DialogHeader className="pt-8 px-6">
        <DialogTitle className="text-2xl text-center font-bold">
          Leave Server
        </DialogTitle>
        <DialogDescription className="text-center text-base text-zinc-500">
         Are You Sure Leave from <span className="text-indigo-500 text-base">{server?.name} ?</span>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="bg-gray-100 py-4 px-6">
         <div className="flex justify-between items-center w-full">
         <Button disabled={loading} onClick={onClose} variant="ghost">Cancel</Button>
         <Button disabled={loading} onClick={clickToLeave} variant="primary">Leave</Button>
         </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  );
};

