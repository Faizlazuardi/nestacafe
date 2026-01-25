import { Product, ProductVariant } from "@/types/product";
import { VariantOption } from "@prisma/client";
import { ChevronDown } from "lucide-react";

export default function VariantForm({
    base,
    variant
}: {
    base: Pick<Product, 'id' | 'name'>;
    variant?: Pick<ProductVariant,'id' | 'option' | 'price'>;
}) {
    return (
        <>
            <label className="flex flex-col gap-2 text-xl">
                <span className="font-bold">Nama Produk</span>
                <input type="text" name="base" value={base.name} className="opacity-75 p-2 border rounded-md" disabled />
                <input type="hidden" name="baseId" value={base.id} />
            </label>
            <label className="flex flex-col gap-2 text-xl" >
                <span className="font-bold">Variant Produk</span>
                <div className="inline-block relative border rounded-md">
                    <select
                        className="px-4 py-2 pr-10 w-full max-h-33 overflow-auto text-xl appearance-none cursor-pointer"
                        name="option"
                        defaultValue={variant?.option ?? ""}
                    >
                        <option disabled hidden value="">Pilih Tipe Bahan Baku</option>
                        {
                            Object.values(VariantOption).map((type) => (
                                <option
                                    key={type}
                                    value={type}
                                >
                                    {type}
                                </option>
                            ))
                        }
                    </select>

                    <ChevronDown
                        size={20}
                        className="top-1/2 right-2 absolute text-gray-500 -translate-y-1/2 pointer-events-none"
                    />
                </div>
            </label>
            <label htmlFor="price" className="flex flex-col gap-2 text-xl">
                <span className="font-bold">Harga Produk</span>
                <input type="number" name="price" id="price" defaultValue={variant?.price} placeholder="Masukkan Harga Produk" className="opacity-75 p-2 border rounded-md" />
            </label>
        </>
    );
}