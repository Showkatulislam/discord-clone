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



export const DeleteServerModal = () => {
  const {isOpen, onClose, type,data}=useModal()
  const {server}=data
  const [loading,setLoading]=useState(false)
  const isModalOpen=isOpen && type==='deleteServer'
  const router=useRouter()

  const clickToDelete=async()=>{
    try {
      setLoading(true)
      await axios.delete( `/api/servers/${server?.id}`)
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
          Delete Server
        </DialogTitle>
        <DialogDescription className="text-center text-base text-zinc-500">
         Are You Sure want to do this  <span className="text-indigo-500 text-base font-semibold">{server?.name} parmanently?</span>
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

