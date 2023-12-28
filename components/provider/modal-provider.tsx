"use client"
import { useEffect, useState } from "react";
import { CreateServerModal } from "../modals/create-server-modal";
import CreateInviteModal from "../modals/create-invite-modal";
import { EditServerModal } from "../modals/edit-server-modal";
import { MembersModal } from "../modals/members-modal";
import { CreateChennelModal } from "../modals/create-chennel-modal";
import { LeaveServerModal } from "../modals/leave-server-modal";
import { DeleteServerModal } from "../modals/delete-server-modal";
import { DeleteChannelModal } from "../modals/delete-server-channel";
import { EditChennelModal } from "../modals/edit-chennel-modal";
import MessageFileModal from "../modals/Message-files";
import { DeleteMessageModal } from "../modals/delete-messages";

export const ModalProvider = () => {
  const [isMounted,setIsMounted]=useState(false)

  useEffect(()=>{
    setIsMounted(true)
  },[])

  if(!isMounted){
    return null
  }
  return (
    <>
      <CreateServerModal />
      <CreateInviteModal/>
      <EditServerModal/>
      <MembersModal/>
      <CreateChennelModal/>
      <LeaveServerModal/>
      <DeleteServerModal/>
      <DeleteChannelModal/>
      <EditChennelModal/>
      <MessageFileModal/>
      <DeleteMessageModal/>
    </>
  );
};
