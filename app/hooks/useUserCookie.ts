"use client"
import { useEffect, useState } from "react";
import { AuthUser } from "../types/user";

export default function useUserCookie(){
    const [user, setUser] = useState<AuthUser | null>(null);
    
    useEffect(() => {
        const cookies = document.cookie
            .split("; ")
            .find(row => row.startsWith("user="));
        
        if (cookies) {
            const value = cookies.split("=")[1];
            setUser(JSON.parse(decodeURIComponent(value)));
        }
    }, []);
    return user;
}