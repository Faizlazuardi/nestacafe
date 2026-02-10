import { MaterialUsage, Product, ProductVariant } from "@/lib/types/product";
import AddButton from "@/app/admin/components/addButton";
import { Box, PencilLine, Trash2 } from "lucide-react";

export default function UsageList({
    base,
    variant,
    materials,
    onOpenUpsertModal,
    onOpenDeleteModal,
    setAction,
    setObjectName,
    setSelectedBase,
    setSelectedVariant,
    setSelectedMaterial
}: {
    base: Pick<Product, 'id' | 'name' | 'variants'>;
    variant: ProductVariant;
    materials: MaterialUsage[];
    onOpenUpsertModal: () => void;
    onOpenDeleteModal: () => void;
    setAction: (action: "POST" | "PUT") => void;
    setObjectName: (name: 'Produk' | 'Varian' | 'Komposisi' | 'Bahan Baku' | 'Karyawan') => void;
    setSelectedBase: (base: Pick<Product, 'id' | 'name' | 'variants'> | undefined) => void;
    setSelectedVariant: (variant: ProductVariant | undefined) => void;
    setSelectedMaterial: (material: MaterialUsage | undefined) => void;
}) {
    return (
        <>
            <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Bahan Baku</span>
                <div className="flex gap-4">
                    <AddButton
                        objectName="Bahan Baku"
                        action={() => {
                            setSelectedBase(base);
                            setSelectedVariant(variant);
                            setSelectedMaterial(undefined);
                            setObjectName("Komposisi");
                            setAction("POST");
                            onOpenUpsertModal();
                        }}
                    />
                </div>
            </div>
            {
                materials.map((material: MaterialUsage) => (
                    <div className="flex justify-between bg-background p-4 border border-(--brand-500) rounded-md" key={material.id}>
                        <div className="flex gap-2 text-(--brand-500) items-center">
                            <div className="p-3 bg-(--brand-100) rounded-md w-fit h-full">
                                <Box className="w-fit h-full" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-foreground text-lg"> {material.name}</span>
                                <span className="font-semibold"> {material.quantityUsed} {material.unit}</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setSelectedBase(base);
                                    setSelectedVariant(variant);
                                    setSelectedMaterial(material);
                                    setObjectName("Komposisi");
                                    setAction('PUT');
                                    onOpenUpsertModal();
                                }}
                            >
                                <PencilLine />
                            </button>
                            <button>
                                <Trash2 onClick={() => {
                                    setSelectedBase(base);
                                    setSelectedVariant(variant);
                                    setSelectedMaterial(material);
                                    setObjectName("Komposisi");
                                    onOpenDeleteModal();
                                }}/>
                            </button>
                        </div>
                    </div>
                ))
            }
        </>
    )
}