"use client"

import { TriangleAlert, X } from "lucide-react";
import { useState } from "react";

export type DeleteEntityResult = {
    data?: Record<string, unknown>;
    error: Error | null;
};

export type DeleteEntityFunction = () => Promise<DeleteEntityResult | undefined>;

type DeleteModalProps = {
    children: React.ReactNode,
    objectName: 'Produk' | 'Varian' | 'Komposisi' | 'Bahan Baku' | 'Karyawan';
    onCloseModal: () => void;
    handleDeleteEntity: DeleteEntityFunction;
};

export default function DeleteModal({
    children,
    objectName,
    onCloseModal,
    handleDeleteEntity,
}: DeleteModalProps) {
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPending(true);
        setError(null);
        
        try {
            const result = await handleDeleteEntity();
            if (result?.error) {
                setError(result.error);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Delete failed"));
        } finally {
            setPending(false);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/20">
            <div className="flex flex-col bg-white rounded-lg w-xl">
                {/* Header */}
                <div className="flex justify-between p-6 bg-(--brand-500) text-gray-100 items-center rounded-t-lg">
                    <span className="text-2xl">Hapus {objectName}</span>
                    <X className="cursor-pointer" onClick={onCloseModal} />
                </div>
                {/* Content */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
                    <div className="flex items-center gap-4 p-4 text-(--brand-500) border border-(--brand-500) bg-(--brand-50) rounded-lg">
                        <TriangleAlert />
                        <span className="text-lg">
                            Data yang akan dihapus tidak dapat dikembalikan
                        </span>
                    </div>

                    {error && (
                        <div className="bg-red-50 p-4 rounded-lg text-red-600">
                            {error.message}
                        </div>
                    )}

                    {children}

                    {/* Actions */}
                    <div className="flex gap-6">
                        <button
                            type="button"
                            className="px-6 py-3 rounded-md w-full button-secondary"
                            onClick={onCloseModal}
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={pending}
                            className="px-6 py-3 rounded-lg w-full text-lg button-primary"
                        >
                            {pending ? "Menghapus..." : "Hapus"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
