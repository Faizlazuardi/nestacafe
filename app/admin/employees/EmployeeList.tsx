"use client"

import { useState } from "react";
import { User } from "@/lib/types/user";
import UpsertModal from "@/app/admin/components/modal/upsertModal";
import AddButton from "@/app/admin/components/addButton";
import { PencilLine, Trash2 } from "lucide-react"
import { useModals } from "@/hooks/useModals";
import DeleteModal from "../components/modal/deleteModal";
import { UserRole } from "@prisma/client";
import EmployeeForm from "../components/form/employeeForm";
import { createEmployeeAction, deleteEmployeeAction, updateEmployeeAction } from "../actions";
import { EmployeeDeleteDetail } from "../components/modal/deleteDetails/EmployeeDeleteDetail"; 
import { useRouter } from "next/navigation";

export default function EmployeeList({ users }:{users: User[]}) {
    const {modals: upsertModal, open: handleOpenUpsertModal, close: handleCloseUpsertModal} = useModals()
    const {modals: deleteModal, open: handleOpenDeleteModal, close: handleCloseDeleteModal} = useModals()
    const [action, setAction] = useState<"PUT" | "POST" | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined)
    const router = useRouter()

const handleSaveEntity = async (initialState: unknown, formData: FormData) => {
        if (!formData) return { data: undefined, error: new Error("No form data") };
        try {
            if (action === "POST") {
                await createEmployeeAction({ formData });
            } else if (action === "PUT" && selectedUser) {
                await updateEmployeeAction({ employeeId: selectedUser.id.toString(), formData });
            }
            router.refresh();
            handleCloseUpsertModal();
            return { data: { success: true }, error: null };
        } catch (error) {
            return { data: undefined, error: error instanceof Error ? error : new Error("Save failed") };
        }
    };

const handleDeleteEntity = async () => {
        if (!selectedUser) {
            return { data: undefined, error: new Error("No user selected") };
        }
        
        try {
            await deleteEmployeeAction({ employeeId: selectedUser.id.toString() });
            
            router.refresh();
            handleCloseDeleteModal();
            
            return {
                data: { id: selectedUser.id, objectName: "Karyawan" },
                error: null,
            };
        } catch (error) {
            return {
                data: undefined,
                error: error instanceof Error ? error : new Error("Delete failed"),
            };
        }
    };
    
    return (
        <>
            <div className="flex justify-between">
                <h1 className="font-bold text-2xl">Karyawan</h1>
                <AddButton 
                    objectName="Karyawan" 
                    action={()=>{
                        setAction("POST");
                        handleOpenUpsertModal();
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
                                            handleOpenUpsertModal();
                                        }}>
                                            <PencilLine/>
                                        </button>
                                        {
                                            user.role !== UserRole.Admin && (
                                                <button onClick={() => {
                                                    setSelectedUser(user)
                                                    handleOpenDeleteModal();
                                                }}>
                                                    <Trash2/>
                                                </button>
                                            )
                                        }
                                    </td>
                                </tr>
                            )
                        })
                    }
                    
                </tbody>
            </table>
            {
                upsertModal && (
                    <UpsertModal
                        onCloseModal={handleCloseUpsertModal}
                        handleSaveEntity={handleSaveEntity}
                        placeholder={action === "POST" ? "Tambah Karyawan" : `Update ${selectedUser?.name}`}
                    >
                        <EmployeeForm user={selectedUser} />
                    </UpsertModal>
                )
            }
{
                deleteModal && selectedUser && (
                    <DeleteModal 
                        objectName="Karyawan" 
                        onCloseModal={handleCloseDeleteModal}
                        handleDeleteEntity={handleDeleteEntity}
                    >
                        <EmployeeDeleteDetail user={selectedUser} />
                    </DeleteModal>
                )
            }
        </>
    )
}