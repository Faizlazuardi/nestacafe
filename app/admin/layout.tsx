import Navigation from "@/app/components/navigation";
import Sidebar from "@/app/components/admin/sidebar";
import { ReactNode } from "react";

export default function TransaksiPage({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col w-screen h-screen">
            <Navigation />
            <div className="flex w-full h-full">
                <Sidebar />
                <div className="flex flex-col gap-4 bg-white m-10 p-6 rounded-2xl w-7/9">
                    { children }
                </div>
            </div>
        </div>
    );
}