import { ProductForSale, ProductVariantForSale } from "@/lib/types/product";
import { MaterialStock, CartItem } from "../types";
import { calculateAvailableStock } from "@/lib/utils/calculateAvailableStock";

export default function ProductCard({ products, materials, cartItems, variantList, setProductSelected, handleOpenProductModal }: { 
    products: ProductForSale[];
    materials: MaterialStock[];
    cartItems: CartItem[];
    variantList: Map<string, ProductVariantForSale>
    setProductSelected: (product: ProductForSale) => void;
    handleOpenProductModal: () => void;
}) {
    const availableProduct = (product: ProductForSale) => {
        return product.variants.some(variant =>
            variant.materials.every(material =>
                calculateAvailableStock(material.id, materials, cartItems, variantList)
            )
        );
    };
    return (
        <>
            {
                products.map(product => {
                    const isAvailable = availableProduct(product);
                    return (
                        <div
                            key={product.id}
                            className={`
                            flex flex-col items-center p-5 rounded-xl w-full h-full
                            ${isAvailable ? 'bg-(--brand-50)' : 'bg-gray-200 opacity-50 cursor-not-allowed'}
                            `}
                            onClick={() => {
                                if (!isAvailable) return;
                                setProductSelected(product);
                                handleOpenProductModal();
                            }}
                        >
                            <img src={product.image} alt={product.name} height={80} width={80} className="object-cover"/>
                            <span>{product.name}</span>
                            {!isAvailable && (
                                <span className="text-red-500 text-sm">Stok habis</span>
                            )}
                        </div>
                    );
                })
            }
        </>
    )
}