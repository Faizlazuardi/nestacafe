import { Product } from "@/lib/types/product";
import { formatIDR } from "@/lib/utils/formatIDR";

export function ProductDeleteDetail({ base }: { base: Pick<Product, 'id' | 'name' | 'variants'> }) {
    return (
        <>
            <div className="flex flex-col gap-4 p-4 border border-(--brand-500) rounded-lg bg-(--brand-50)">
                <span className="font-bold text-lg">Detail Produk yang akan dihapus</span>
                <div className="inline-flex gap-6 w-full">
                    <div className="flex flex-col w-1/2">
                        <span>Nama Produk</span>
                        <span className="font-semibold">{base.name}</span>
                    </div>
                    <div className="flex flex-col w-1/2">
                        <span>Jumlah Varian:</span>
                        <span className="font-semibold">{base.variants.length} Varian</span>
                    </div>
                </div>
            </div>
            {
                base.variants.length !== 0 && (
                    <div className="flex flex-col gap-2 bg-(--brand-50) p-4 border border-(--brand-500) rounded-lg">
                        <span className="font-semibold text-lg">Detail Varian yang akan dihapus</span>
                        {
                            base.variants.map(variant => (
                                <div key={variant.id} className="flex flex-col gap-2 bg-gray-50 p-4 rounded-md">
                                    <span className="">
                                        <b>{variant.option}</b> {formatIDR(variant.price)}
                                    </span>
                                    <div className="flex flex-col gap-1">
                                        <span>Bahan Baku:</span>
                                        <div className="flex flex-col">
                                            {
                                                variant.materials?.map(usage => (
                                                    <ul key={usage.id}>
                                                        <li className="list-disc list-inside">{usage.name} ({usage.quantityUsed} {usage.unit.toLocaleLowerCase()})</li>
                                                    </ul>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </>
    );
}
