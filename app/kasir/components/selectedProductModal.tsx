"use client"

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { MaterialUsage, Product, ProductVariant } from "@/types/product"
import { CartItem } from "@/types/cart";
import { VariantLabel } from "@/utils/variantlabel";
import { formatIDR } from "@/utils/formatIDR";
import { getMaterialRemaining } from "@/utils/getMaterialRemaining";

export default function SelectedProductModal({
    productSelected,
    materials,
    cartItems,
    variantMap,
    addToCart,
    onCloseProductModal,
}
    : {
        productSelected: Product | null,
        materials: { id: string; stock: number }[],
        cartItems: CartItem[],
        variantMap: Map<string, ProductVariant>,
        addToCart: (product: CartItem, materials: MaterialUsage[]) => void,
        onCloseProductModal: () => void,
    }) {
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const handleSelectedVariant = (variant: ProductVariant) => {
        setSelectedVariant(prev => {
            if (variant.option === prev?.option) {
                return null
            } else {
                return variant
            }
        })
    }
    
    const availableVariant = (product: Product) => {
        return product.variants.filter(variant =>
            variant.materials.every(material => 
                getMaterialRemaining(material.id, materials, cartItems, variantMap) >= material.quantityUsed * quantity
            )
        );
    };
    
    const isStockAvailable = productSelected?.variants
        .filter(variant => variant.option === selectedVariant?.option)
        .every(variant =>
            variant.materials.every(material =>
                getMaterialRemaining(material.id, materials, cartItems, variantMap) >= material.quantityUsed * (quantity + 1)
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