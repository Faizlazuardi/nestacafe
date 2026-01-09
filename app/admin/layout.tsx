"use client"

import { ReactNode } from "react";
import Navigation from "@/app/components/navigation";
import Sidebar from "@/app/admin/components/sidebar";

export default function TransaksiPage({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col w-screen h-screen">
            <Navigation />
            <div className="flex flex-1 w-full min-h-0">
                <Sidebar />
                <div className="flex flex-col gap-8 p-8 w-5/7 md:w-3/4 lg:w-7/9 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}