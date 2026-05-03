"use client"

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { VariantLabel } from "@/lib/utils/variantlabel";
import { formatIDR } from "@/lib/utils/formatIDR";
import { calculateAvailableStock } from "@/lib/utils/calculateAvailableStock";
import { MaterialStock, ProductForSale, VariantForSale, VariantMaterialUsage, CartItem } from "../types";

export default function SelectedProductModal({
    productSelected,
    materials,
    cartItems,
    variantList,
    addToCart,
    onCloseProductModal,
}
    : {
        productSelected: ProductForSale | null,
        materials: MaterialStock[],
        cartItems: CartItem[],
        variantList: Map<string, VariantForSale>,
        addToCart: (product: CartItem, materials: VariantMaterialUsage[]) => void,
        onCloseProductModal: () => void,
    }) {
    const [selectedVariant, setSelectedVariant] = useState<VariantForSale | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const handleSelectedVariant = (variant: VariantForSale) => {
        setSelectedVariant(prev => {
            if (variant.option === prev?.option) {
                return null
            } else {
                return variant
            }
        })
    }
    
    const availableVariant = (product: ProductForSale) => {
        return product.variants.filter(variant =>
            variant.materials.every(material => 
calculateAvailableStock(material.id, materials, cartItems, variantList) >= material.quantityUsed * quantity
            )
        );
    };
    
    const isStockAvailable = productSelected?.variants
        .filter(variant => variant.option === selectedVariant?.option)
        .every(variant =>
            variant.materials.every(material =>
calculateAvailableStock(material.id, materials, cartItems, variantList) >= material.quantityUsed * (quantity + 1)
            )
        );
    
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/20">
            <div className="flex flex-col shadow-2xl rounded-3xl w-lg h-fit max-h-9/10">
                <div className="flex flex-col gap-2 bg-(--brand-500) text-white p-6">
                    <span className="text-2xl">Pilih Variant</span>
                </div>
                <div className="flex flex-col items-center gap-8 bg-white p-6">
                    <div className="flex flex-col items-center gap-5">
                        <img src={productSelected!.image} alt={productSelected!.name} className="w-fit h-20" />
                        <span className="font-bold text-xl">{productSelected?.name}</span>
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                        <span className="font-bold text-xl">Variant</span>
                        <div className="flex gap-4 w-full">
                            {
                                productSelected?.variants?.map(variant => {
                                    if (!availableVariant(productSelected!).some(v => v.option === variant.option)) return null;
                                    return (
                                    <div
                                        key={variant.option}
                                        className={`flex flex-col gap-2 p-4 w-full h-fit border border-(--brand-500) rounded-lg ${selectedVariant?.option === variant.option ? 'bg-(--brand-50)' : ''}`}
                                        onClick={() => { handleSelectedVariant(variant) }}
                                    >
                                        <span className="font-bold text-xl text-center text-(--brand-700)">{VariantLabel[variant.option]}</span>
                                        <span className="font-bold text-lg text-center text-(--brand-500)">{formatIDR(variant.price)}</span>
                                    </div>
                                )})
                            }
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                        <span className="font-bold text-xl">Jumlah</span>
                        <div className="flex justify-center items-center gap-6">
                            <Minus
                                className="font-(--brand-500) border border-(--brand-500) rounded-lg p-2 w-10 h-fit"
                                onClick={() => setQuantity(prev => (prev > 1 ? prev - 1 : prev))}
                            />
                            <span className="font-bold text-xl">{quantity}</span>
                            <Plus
                                className="font-(--brand-500) border border-(--brand-500) rounded-lg p-2 w-10 h-fit"
                                onClick={() => {
                                    if (!isStockAvailable || !selectedVariant) return;
                                    setQuantity(prev => prev + 1);
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 w-full">
                        <button
                            className="bg-gray-100 py-4 border border-black rounded-xl w-full"
                            onClick={onCloseProductModal}
                        >
                            Batal
                        </button>
                        <button
                            className="bg-(--brand-100) py-4 border border-(--brand-500) rounded-xl w-full"
                            onClick={() => {
                                if (!selectedVariant) return;
                                const newItem: CartItem = {
                                    id: selectedVariant!.id,
                                    name: productSelected!.name,
                                    image: productSelected!.image,
                                    price: selectedVariant!.price,
                                    variant: selectedVariant!.option,
                                    quantity: quantity
                                };
                                addToCart(newItem,productSelected!.variants.find(v => v.option === selectedVariant!.option)!.materials);
                                onCloseProductModal();
                            }}
                        >
                            Pilih
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}