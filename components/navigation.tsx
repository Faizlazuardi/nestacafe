"use client"

import { LogOut, User } from 'lucide-react';
import { AuthUser } from '@/types/user';
import { useSession, signOut } from 'next-auth/react';

export default function Navigation() {
    const { data: session } = useSession();
    const user = session?.user as AuthUser | undefined;
    
    return (
        <nav className="flex justify-between items-center px-6 py-4 w-full h-24 nav">
            <h1 className="text-2xl md:text-3xl lg:text-4xl">NESTACAFE</h1>
            <div className="flex items-center gap-4 w-1/2 md:w-1/3 lg:w-1/4">
                <div className="flex flex-1 items-center gap-2 p-2 rounded-lg h-16 bg-(--brand-600) text-white">
                    <User/>
                    <div className="flex flex-col">
                        <span>Role: {user?.role}</span>
                        <span className="font-bold">{user?.name}</span>
                    </div>
                </div>
                <form
                    action={async () => {
                        await signOut()
                    }}
                >
                    <button className="p-2 rounded-lg w-fit h-fit hover:cursor-pointer button-logout button-secondary" type="submit">
                        <LogOut className="w-5 h-fit"/>
                    </button>
                </form>
            </div>
        </nav>
    );
}