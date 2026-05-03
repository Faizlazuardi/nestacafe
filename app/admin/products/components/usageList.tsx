import { MaterialUsageDetail, Product, ProductVariant } from "@/lib/types/product";
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
    materials: MaterialUsageDetail[];
    onOpenUpsertModal: () => void;
    onOpenDeleteModal: () => void;
    setAction: (action: "POST" | "PUT") => void;
    setObjectName: (name: 'Produk' | 'Varian' | 'Komposisi') => void;
    setSelectedBase: (base: Pick<Product, 'id' | 'name' | 'variants'> | undefined) => void;
    setSelectedVariant: (variant: ProductVariant | undefined) => void;
    setSelectedMaterial: (material: MaterialUsageDetail | undefined) => void;
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
                materials.map(material => (
                    <div className="flex justify-between bg-white p-4 border border-(--brand-500) rounded-xl" key={material.id}>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-(--brand-50) rounded-md w-fit h-12">
                                <Box className="w-fit h-full text-(--brand-500)" />
                            </div>
                            <span className="font-bold text-lg"> {material.name}</span>
                            <span className="font-semibold text-sm rounded-md bg-(--brand-500)  py-1 px-2 text-white">
                                {material.quantityUsed} {material.unit}
                            </span>
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