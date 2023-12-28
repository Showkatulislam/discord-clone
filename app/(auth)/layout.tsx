import { ReactNode } from "react";

const authLayout = ({children}:{children:ReactNode}) => {
    return (
        <div className="flex items-center justify-center h-full">
            {children}
        </div>
    );
};

export default authLayout;