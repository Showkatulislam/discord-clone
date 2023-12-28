import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NavigationAction } from "./navigation-action";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";

const Navigationsidebar = async () => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  console.log(servers);

  return (
    <div className="flex flex-col space-y-4 items-center h-full text-primary  w-full dark:bg-[#1f1f22] py-8 bg-[#e3e5e8]">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem 
            name={server.name} 
            id={server.id}
            imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="mb-3 mt-auto flex items-center justify-center flex-col gap-y-4">
        <ModeToggle/>
        <UserButton
        afterSignOutUrl="/"
        appearance={{
            elements:{
                avatarBox:'h-12 w-12'
            }
        }}
        />
      </div>
    </div>
  );
};

export default Navigationsidebar;
