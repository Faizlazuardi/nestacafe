"use client"

import { useState } from "react";
import { User } from "@/types/user";
import UpsertModal from "@/app/admin/components/modal/upsertModal";
import AddButton from "@/app/admin/components/addButton";
import { PencilLine, Trash2 } from "lucide-react"
import { useModals } from "@/hooks/useModals";

export default function EmployeeList({ users }:{users: User[]}) {
    const {modals: employeeModal, open: onOpenEmployeeModal, close: onCloseEmployeeModal} = useModals()
    const [action, setAction] = useState<"PUT" | "POST" | "DELETE" | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined)
    
    return (
        <>
            <div className="flex justify-between">
                <h1 className="font-bold text-2xl">Karyawan</h1>
                <AddButton 
                    objectName="Karyawan" 
                    action={()=>{
                        setAction("POST");
                        onOpenEmployeeModal();
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
                <tbody className="bg-white overflow-scroll">
                    {
                        users?.map((user)=>{
                            return(
                                <tr key={user.id} className="h-fit">
                                    <td className="p-4">{user.id}</td>
                                    <td className="p-4">{user.name}</td>
                                    <td className="p-4">{user.role}</td>
                                    <td className="flex justify-center gap-4 p-4">
                                        <button onClick={() => {
                                            setSelectedUser(user)
                                            setAction("PUT");
                                            onOpenEmployeeModal();
                                        }}>
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
                employeeModal && (
                    <UpsertModal objectName={"Karyawan"} method={action} onCloseModal={onCloseEmployeeModal} user={selectedUser}/>
                )
            }
        </>
    )
}