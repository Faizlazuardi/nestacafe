import { MaterialUsage, Product, ProductVariant } from "@/types/product";
import { PencilLine, Trash2 } from "lucide-react";
import UsageList from "./usageList";
import AddButton from "@/app/admin/components/addButton";
import { formatIDR } from "@/utils/formatIDR";

export default function VariantList({
    base,
    variants,
    onOpenProductModal,
    setAction,
    setObjectName,
    setSelectedBase,
    setSelectedVariant,
    setSelectedMaterial
}: {
    base: Pick<Product, 'id' | 'name'>;
    variants: ProductVariant[];
    onOpenProductModal: () => void;
    setAction: (action: "POST" | "PUT" | "DELETE") => void;
    setObjectName: (name: 'Produk' | 'Varian' | 'Komposisi' | 'Bahan Baku' | 'Karyawan') => void;
    setSelectedBase: (base: Pick<Product, 'id' | 'name'> | undefined) => void;
    setSelectedVariant: (variant: Pick<ProductVariant, 'id' | 'option' | 'price'> | undefined) => void;
    setSelectedMaterial: (material: MaterialUsage | undefined) => void
}) {
    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-xl">Varian</h1>
                <AddButton
                    objectName="Variant"
                    action={() => {
                        setSelectedBase(base);
                        setSelectedVariant(undefined);
                        setObjectName("Varian");
                        setAction("POST");
                        onOpenProductModal();
                    }}
                />
            </div>
            {
                variants.map((variant: ProductVariant) => {
                    return (
                        <div className="flex flex-col bg-background border border-(--brand-500) rounded-xl w-full" key={variant.id}>
                            <div className="flex justify-between items-center p-4 border-b border-(--brand-500)">
                                <div className="flex gap-4">
                                    <span className="font-bold text-lg py-2 px-4 bg-(--brand-500) rounded-2xl text-white">
                                        {variant.option}
                                    </span>
                                    <span className="font-bold text-lg py-2 px-4 bg-white border border-(--brand-500) rounded-2xl">
                                        {formatIDR(variant.price)}
                                    </span>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            setSelectedBase(base);
                                            setSelectedVariant(variant);
                                            setObjectName("Varian");
                                            setAction('PUT');
                                            onOpenProductModal();
                                        }}
                                    >
                                        <PencilLine />
                                    </button>
                                    <button>
                                        <Trash2 />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 bg-white p-4 rounded-b-xl">
                                <UsageList
                                    base={base}
                                    variant={variant}
                                    materials={variant.materials!}
                                    onOpenProductModal={onOpenProductModal}
                                    setAction={setAction}
                                    setObjectName={setObjectName}
                                    setSelectedBase={setSelectedBase}
                                    setSelectedVariant={setSelectedVariant}
                                    setSelectedMaterial={setSelectedMaterial}
                                />
                            </div>
                        </div>
                    )
                })
            }
        </>
    )
}