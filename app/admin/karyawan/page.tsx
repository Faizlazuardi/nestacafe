"use client"
import { useState, useEffect } from "react";
import { User } from "@prisma/client";
import UpsertModal from "@/app/components/admin/upsertModal";
import AddButton from "@/app/components/admin/addButton";
import { PencilLine, Trash2 } from "lucide-react"

export default function karyawanPage() {
    type UserListItem = Pick<User, "id" | "name" | "role">;
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [action, setAction] = useState<string>("");
    
    useEffect(() => {
        async function fetchUsers() {
            const res = await fetch('/api/admin/karyawan');
            const data = await res.json()
            setUsers(data);
        }
        fetchUsers();
    }, []);
    
    const toggleModal = ():void => {
        setIsOpen(!isOpen);
    }
    
    return (
        <>
            <div className="flex justify-between">
                <h1 className="font-bold text-2xl">Karyawan</h1>
                <AddButton 
                    objectName="Karyawan" 
                    action={()=>{
                        setAction("post");
                        toggleModal();
                    }}
                />
            </div>
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="p-4 text-xs md:text-sm lg:text-base">ID</th>
                        <th className="p-4 text-xs md:text-sm lg:text-base">Nama</th>
                        <th className="p-4 text-xs md:text-sm lg:text-base">Posisi</th>
                        <th className="p-4 text-xs md:text-sm lg:text-base">Action</th>
                    </tr>
                </thead>
                <tbody className="overflow-scroll">
                    {
                        users?.map((user)=>{
                            return(
                                <tr key={user.id}>
                                    <td className="p-4 h-full">{user.id}</td>
                                    <td className="p-4 h-full">{user.name}</td>
                                    <td className="p-4 h-full">{user.role}</td>
                                    <td className="flex justify-center gap-4 p-4 h-full">
                                        <button>
                                            <PencilLine/>
                                        </button>
                                        <button>
                                            <Trash2/>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    
                </tbody>
            </table>
            {
                isOpen && (
                    <UpsertModal objectName={"Karyawan"} method={action} toggleModal={toggleModal}/>
                )
            }
        </>
    )
}