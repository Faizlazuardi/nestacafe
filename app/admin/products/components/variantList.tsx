import { MaterialUsageDetail, Product, ProductVariant } from "@/lib/types/product";
import { PencilLine, Trash2 } from "lucide-react";
import UsageList from "./usageList";
import AddButton from "@/app/admin/components/addButton";
import { formatIDR } from "@/lib/utils/formatIDR";

export default function VariantList({
    base,
    variants,
    onOpenUpsertModal,
    onOpenDeleteModal,
    setAction,
    setObjectName,
    setSelectedBase,
    setSelectedVariant,
    setSelectedMaterial
}: {
    base: Pick<Product, 'id' | 'name' | 'variants'>;
    variants: ProductVariant[];
    onOpenUpsertModal: () => void;
    onOpenDeleteModal: () => void;
    setAction: (action: "POST" | "PUT") => void;
    setObjectName: (name: 'Produk' | 'Varian' | 'Komposisi') => void;
    setSelectedBase: (base: Pick<Product, 'id' | 'name' | 'variants'> | undefined) => void;
    setSelectedVariant: (variant: ProductVariant | undefined) => void;
    setSelectedMaterial: (material: MaterialUsageDetail | undefined) => void
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
                        onOpenUpsertModal();
                    }}
                />
            </div>
            {
                variants.map(variant => {
                    return (
                        <div key={variant.id} className="flex flex-col border border-(--brand-500) rounded-xl w-full" >
                            <div className="flex justify-between items-center p-4 rounded-t-xl border-b border-(--brand-500) bg-(--brand-50)">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-lg py-1 px-4 bg-(--brand-500) rounded-2xl text-white">
                                        {variant.option}
                                    </span>
                                    <span className="font-bold text-lg py-1 px-4 bg-white border border-(--brand-500) rounded-2xl">
                                        {formatIDR(variant.price)}
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setSelectedBase(base);
                                            setSelectedVariant(variant);
                                            setObjectName("Varian");
                                            setAction('PUT');
                                            onOpenUpsertModal();
                                        }}
                                    >
                                        <PencilLine />
                                    </button>
                                    <button onClick={() => {
                                        setSelectedBase(base);
                                        setSelectedVariant(variant);
                                        setObjectName("Varian");
                                        onOpenDeleteModal();
                                    }}>
                                        <Trash2 />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 bg-background p-4 rounded-b-xl">
                                <UsageList
                                    base={base}
                                    variant={variant}
                                    materials={variant.materials!}
                                    onOpenUpsertModal={onOpenUpsertModal}
                                    onOpenDeleteModal={onOpenDeleteModal}
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