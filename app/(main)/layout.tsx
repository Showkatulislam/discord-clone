import Navigationsidebar from "@/components/navigation/navigation-sidebar";
import { ReactNode } from "react"

const MainLayout=({
    children
}:{children:ReactNode})=>{
    return (
    <div className="h-full">
        <div className="hidden md:flex flex-col fixed inset-y-0 z-30 w-20">
            <Navigationsidebar/>
        </div>
        <main className="md:pl-20 h-full">
            {children}
        </main>
    </div>
    );
}

export default MainLayout