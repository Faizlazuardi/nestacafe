"use client"

import { useActionState, useEffect, useState, useRef } from "react";
import { PaymentType, } from "@prisma/client";
import { useSession } from "next-auth/react";
import Navigation from "@/app/components/navigation";
import Cart from "@/app/kasir/components/cart";
import ConfirmModal from "@/app/kasir/components/confirmModal";
import PaymentModal from "@/app/kasir/components/paymentModal";
import SelectedProductModal from "@/app/kasir/components/selectedProductModal";
import { useModals } from "@/hooks/useModals";
import { calculateAvailableStock } from "@/lib/utils/calculateAvailableStock";
import { checkoutAction } from "./actions";
import { CheckoutInput } from "./types";
import { MaterialStock, CartItem } from "./types";
import ProductCard from "./components/productCard";
import { getCashierProducts, getMaterialStock } from "./actions";
import { MaterialUsageDetail, ProductForSale, ProductVariantForSale } from "@/lib/types/product";

export default function Page() {
    const { modals:productModal, open:handleOpenProductModal, close:handleCloseProductModal } = useModals();
    const { modals:paymentModal, open:handleOpenpaymentModal, close:handleClosePaymentModal } = useModals();
    const { modals:confirmModal, open:handleOpenConfirmModal, close:handleCloseConfirmModal } = useModals();
    
    const [products, setProducts] = useState<ProductForSale[]>([]);
    const [materials, setMaterials] = useState<MaterialStock[]>([]);
    const [productSelected, setProductSelected] = useState<ProductForSale | null>(null)
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState< PaymentType | null>(null);
    const [cashAmount, setCashAmount] = useState<string>("");
    
    // Store user id in ref for useActionState
    const userIdRef = useRef<string>("");

    const { data: session, status } = useSession();
    
    // Update userId ref when session changes
    useEffect(() => {
        if (session?.user) {
            userIdRef.current = session.user.id;
        }
    }, [session]);
    
    // Fetch data after session is available
    useEffect(() => {
        async function fetchData() {
            try {
                const products = await getCashierProducts();
                if (!products) throw new Error("Products not found");
                const variantIds = products.flatMap(product =>
                    product.variants.map(variant => BigInt(variant.id))
                );
                const materials = await getMaterialStock(variantIds)
                if (!materials) throw new Error("Materials not found");
                
                setProducts(products);
                setMaterials(materials);
            } catch (error) {
                console.error("Failed to fetch cashier data:", error);
            }
        }
        if (status === "authenticated") {
            fetchData();
        }
    }, [status]);

    const [, formAction, isPending] = useActionState(async () => {
        const totalPrice = cartItems.reduce((sum, item) => {
            return sum + item.quantity * item.price;
        }, 0);
        
        const payload: CheckoutInput = {
            cashierId: userIdRef.current,
            paymentType: paymentMethod!,
            total: totalPrice,
            products: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                subtotal: item.quantity * item.price
            }))
        }
        const result = await checkoutAction(payload)
        
        if (!result.status || result.status === "error") {
            throw new Error(result.message);
        }
        
        setCartItems([]);
        setPaymentMethod(null);
        handleCloseConfirmModal()
        return result.message;
    }, null)

    // Handle loading state
    if (status === "loading") {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="border-[--brand-500] border-b-2 rounded-full w-12 h-12 animate-spin"></div>
            </div>
        );
    }
    
    // Handle unauthenticated state
    if (!session?.user) {
        return (
            <div className="flex flex-col justify-center items-center gap-4 h-screen">
                <p className="text-gray-600 text-lg">Silakan login untuk mengakses halaman kasir</p>
            </div>
        );
    }

    const removeFromCart = (product: CartItem):void =>{
        setCartItems(prevItems =>
            prevItems.filter(item => !(item.id === product.id && item.variant === product.variant))
        )
    }
    
    const addToCart = (product: CartItem, materialsUsed: MaterialUsageDetail[]) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(
                item => item.id === product.id && item.variant === product.variant
            );
            
            const allMaterialsAvailable = materialsUsed.every(material =>
                calculateAvailableStock(material.id, materials, prevItems, variantList) >= material.quantityUsed * product.quantity
            );
            
            if (!allMaterialsAvailable) {
                return prevItems;
            }
            
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id && item.variant === product.variant
                    ? { ...item, quantity: item.quantity + product.quantity }
                    : item
                );
            }
            return [...prevItems, product];
        });
    };
    
    const variantList = new Map<string, ProductVariantForSale>();
    for (const p of products) {
        for (const v of p.variants) variantList.set(v.id, v);
    }
    
    return (
        <>
            <div className="flex flex-col w-screen h-screen">
                <Navigation/>
                <div className="flex flex-1 p-6 w-full min-h-0">
                    <div className="gap-8 grid sm:grid-cols-[3fr_2fr] md:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr] w-full">
                        <div className="overflow-y-auto">
                            <div className="gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr">
                                <ProductCard
                                    products={products}
                                    materials={materials}
                                    cartItems={cartItems}
                                    variantList={variantList}
                                    setProductSelected={setProductSelected}
                                    handleOpenProductModal={handleOpenProductModal}
                                />
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
                        materials={materials}
                        cartItems={cartItems}
                        variantList={variantList}
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
                        formAction={formAction}
                        isPending={isPending}
                        onCloseConfirmModal={handleCloseConfirmModal} 
                        onOpenpaymentModal={handleOpenpaymentModal}
                        cashAmount={cashAmount}
                    />
                )
            }
        </>
    );
}
