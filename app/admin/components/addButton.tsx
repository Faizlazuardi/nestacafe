"use client";
import { Plus } from "lucide-react";

export default function AddButton({ objectName, action }: {
    objectName: string;
    action: () => void;
}) {
    return (
        <button
            className="flex gap-2 px-4 py-2 rounded-lg font-semibold button-primary"
            onClick={action}
        >
            <Plus /> Tambah {objectName}
        </button>
    );
}
