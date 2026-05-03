import { ProductVariant } from "@/lib/types/product";
import { formatIDR } from "@/lib/utils/formatIDR";

export function VariantDeleteDetail({ variant }: { variant: ProductVariant }) {
    return (
        <>
            <div className="flex flex-col gap-4 p-4 border border-(--brand-500) rounded-lg bg-(--brand-50)">
                <span className="font-bold text-lg">Detail Varian yang akan dihapus</span>
                <div className="inline-flex gap-6 w-full">
                    <div className="flex flex-col w-1/2">
                        <span>Opsi Varian</span>
                        <span className="font-semibold">{variant.option}</span>
                    </div>
                    <div className="flex flex-col w-1/2">
                        <span>Harga Varian</span>
                        <span className="font-semibold">{formatIDR(variant.price)}</span>
                    </div>
                </div>
            </div>
            {
                variant.materials?.length !== 0 && (
                    <div className="flex flex-col gap-2 bg-(--brand-50) p-4 border border-(--brand-500) rounded-lg">
                        <span className="font-semibold text-lg">Bahan Baku yang digunakan pada varian ini:</span>
                        <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-md">
                            {
                                variant.materials?.map(usage => (
                                    <ul key={usage.id}>
                                        <li className="list-disc list-inside">{usage.name} - {usage.quantityUsed} {usage.unit.toLocaleLowerCase()}</li>
                                    </ul>
                                ))
                            }
                        </div>
                    </div>
                )
            }
        </>
    );
}
