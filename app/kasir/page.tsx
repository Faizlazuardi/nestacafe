"use client"

import { useEffect, useState } from "react";
import { PaymentType, } from "@prisma/client";
import { useSession } from "next-auth/react";
import Navigation from "@/app/components/navigation";
import Cart from "@/app/kasir/components/cart";
import ConfirmModal from "@/app/kasir/components/confirmModal";
import PaymentModal from "@/app/kasir/components/paymentModal";
import SelectedProductModal from "@/app/kasir/components/selectedProductModal";
import { useModals } from "@/hooks/useModals";
import { Product } from "@/types/product";
import { CartItem } from "@/types/cart";
import { User } from "@/types/user";

export default function KasirPage() {
    const { modals:productModal, open:handleOpenProductModal, close:handleCloseProductModal } = useModals();
    const { modals:paymentModal, open:handleOpenpaymentModal, close:handleClosePaymentModal } = useModals();
    const { modals:confirmModal, open:handleOpenConfirmModal, close:handleCloseConfirmModal } = useModals();
    
    const [products, setProducts] = useState<Product[]>([]);
    const [materials, setMaterials] = useState<{id: string; stock: number}[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [productSelected, setProductSelected] = useState<Product | null>(null)
    const [paymentMethod, setPaymentMethod] = useState< PaymentType | null>(null);
    const [cashAmount, setCashAmount] = useState<string>("");

    const { data: session } = useSession();
    const user = session?.user as User | null;
    
    const handleTransaction = async () => {
        const totalPrice = cartItems.reduce((sum, item) => {
            return sum + item.quantity * item.price;
        }, 0);
        const payload:any = {
            cashierId: user!.id,
            paymentType: paymentMethod,
            total: totalPrice,
            products: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                subtotal: item.quantity * item.price
            }))
        }
        try {
            const res = await fetch('/api/checkout',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                }
            )
            setCartItems([]);
            setPaymentMethod(null);
        } catch(error: any){
            console.error(error);
        }
    }

    const removeFromCart = (product: CartItem):void =>{
        setCartItems(prevItems =>
            prevItems.filter(item => !(item.id === product.id && item.variant === product.variant))
        )
    }
    
    const addToCart = (product: CartItem) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(
                item => item.id === product.id && item.variant === product.variant
            );
            
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id && item.variant === product.variant
                    ? { ...item, quantity: item.quantity + product.quantity }
                    : item
                );
            }
            else{
                return [...prevItems, product];
            }
        });
    };
    
    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('/api/product');
                const { products, materials } = await res.json();
                setProducts(products);
                setMaterials(materials);
            } catch (error) {
                console.error(error);
            }
        }
        fetchProducts();
    }, []);
    
    
    const availableStock = (product: Product) => {
        const countMaterialRemaining = (materialId: string) => {
            const materialStock = materials.find(m => m.id === materialId)?.stock ?? 0;
            
            const totalUsage = cartItems.reduce((total, item) => {
                if (item.id !== product.id) return total;
                
                const variant = product.variants.find(v => v.option === item.variant);
                if (!variant) return total;
                
                const material = variant.materials.find(m => m.id === materialId);
                if (!material) return total;
                
                return total + material.quantityUsed * item.quantity;
            }, 0);
            
            return materialStock - totalUsage;
        };
        
        return product.variants.some(variant =>
            variant.materials.every(material =>
                countMaterialRemaining(material.id) >= material.quantityUsed
            )
        );
    };
    
    return (
        <>
            <div className="flex flex-col w-screen h-screen">
                <Navigation/>
                <div className="flex flex-1 p-6 w-full min-h-0">
                    <div className="gap-8 grid sm:grid-cols-[3fr_2fr] md:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr] w-full">
                        <div className="overflow-y-auto">
                            <div className="gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr">
                                {products.map(product => {
                                    const isAvailable = availableStock(product);
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
                                })}

                            </div>
                        </div>
                        <div className="rounded-lg bg-white h-fit border-(--brand-500) border shadow-md">
                            <Cart
                                cartItems={cartItems}
                                removeFromCart={removeFromCart}
                                onOpenPaymentModal={handleOpenpaymentModal}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {
                productModal && (
                    <SelectedProductModal
                        productSelected={productSelected}
                        addToCart={addToCart}
                        onCloseProductModal={handleCloseProductModal}
                    />
                )
            }
            {
                paymentModal && (
                    <PaymentModal
                        cartItems={cartItems} 
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                        onClosePaymentModal={handleClosePaymentModal}
                        onOpenConfirmModal={handleOpenConfirmModal}
                        cashAmount={cashAmount}
                        setCashAmount={setCashAmount}
                    />
                )
            }
            {
                confirmModal && (
                    <ConfirmModal 
                        cartItems={cartItems} 
                        paymentMethod={paymentMethod}
                        onConfirm={handleTransaction}
                        onCloseConfirmModal={handleCloseConfirmModal} 
                        onOpenpaymentModal={handleOpenpaymentModal}
                        cashAmount={cashAmount}
                    />
                )
            }
        </>
    );
}