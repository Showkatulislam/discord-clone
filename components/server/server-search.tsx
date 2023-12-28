"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "../ui/command";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

interface ServersearchProps {
  data: {
    label: string;
    type: "chennal" | "member";
    data:
      | {
          name: string;
          icon: React.ReactNode;
          id: string;
        }[]
      | undefined;
  }[];
}
const Serversearch = ({ data }: ServersearchProps) => {
  const [open, setOpen] = useState(false);
  const router=useRouter();
  const params=useParams()

  useEffect(()=>{
    const down=(e:KeyboardEvent)=>{
      if(e.key==='k' && (e.metaKey || e.ctrlKey)){
        e.preventDefault();
        setOpen((open)=>!open)
      }
    }
    document.addEventListener('keydown',down)
    return ()=>{
      document.removeEventListener('keydown',down)
    }
  },[])

  const onClick=({id,type}:{id:string,type:"chennal"|"member"})=>{
      setOpen(false)
      if(type==='member'){
       return router.push(`/servers/${params?.serverId}/conversations/${id}`)
      }else{
        return router.push(`/servers/${params?.serverId}/chennals/${id}`)
      }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
      >
        <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
          Search
        </p>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList>
          <CommandEmpty>No Results found</CommandEmpty>
          {data.map(({ label, type, data }) => {
            if (!data?.length) return null;

            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ id, icon, name }) => {
                  return (
                    <CommandItem key={id} onSelect={()=>onClick({id,type})}>
                      {icon}
                      <span className="ml-4"> {name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default Serversearch;
