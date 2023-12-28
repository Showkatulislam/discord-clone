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

import qs from "query-string";

import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-model-store";
import { useState } from "react";



export const DeleteChannelModal = () => {
  const {isOpen, onClose, type,data}=useModal()
  const {server,channel}=data
  const [loading,setLoading]=useState(false)
  const isModalOpen=isOpen && type==='deleteChannel'
  const router=useRouter()

  const clickToDelete=async()=>{
    try {
      setLoading(true)
      const url=qs.stringifyUrl({
        url:`/api/channels/${channel?.id}`,
        query:{
          serverId:server?.id
        }
      })
      await axios.delete(url)
      onClose()
      router.refresh()
    } catch (error) {
      console.log(error);
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
          Delete Channel
        </DialogTitle>
        <DialogDescription className="text-center text-base text-zinc-500">
         Are You Sure want to do this  <span className="text-indigo-500 text-base font-semibold">#{channel?.name} parmanently?</span>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="bg-gray-100 py-4 px-6">
         <div className="flex justify-between items-center w-full">
         <Button disabled={loading} onClick={onClose} variant="ghost">Cancel</Button>
         <Button disabled={loading} onClick={clickToDelete} variant="primary">Delete</Button>
         </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  );
};

