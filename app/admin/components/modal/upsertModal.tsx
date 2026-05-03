"use client"

import { useActionState } from "react";
import { X } from "lucide-react";

export type SaveEntityResult = {
    data?: Record<string, unknown>;
    error: Error | null;
};

export type SaveEntityFunction = (
    initialState: unknown,
    formData: FormData
) => Promise<SaveEntityResult | undefined>;

export default function UpsertModal({ children, onCloseModal, handleSaveEntity, placeholder }: {
    children: React.ReactNode,
    onCloseModal: () => void
    handleSaveEntity: SaveEntityFunction
    placeholder?: string
}) {
    const [formState, formAction, pending] = useActionState(handleSaveEntity, null);
    
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/20">
            <div className="flex flex-col justify-center bg-white rounded-lg w-lg h-fit">

                <div className="flex justify-between items-center p-6 border-b">
                    <h1 className="font-bold text-2xl">
                        {placeholder}
                    </h1>
                    <X onClick={onCloseModal} />
                </div>

                <form action={formAction} className="flex flex-col gap-6 px-20 py-10">
                    {formState?.error && (
                        <div className="bg-red-50 p-4 rounded-lg text-red-600">
                            {formState.error.message}
                        </div>
                    )}
                    
                    {children}
                    <button type="submit" className="py-2 rounded-lg w-full text-lg button-primary" disabled={pending}>
                        {pending ? "Menyimpan..." : "Simpan"}
                    </button>
                </form>

            </div>
        </div>
    );
};
