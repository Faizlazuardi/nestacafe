"use client"

import { useEffect, useState } from "react";
import { PaymentType, } from "@prisma/client";
import { useSession } from "next-auth/react";
import Navigation from "@/components/navigation";
import Cart from "@/components/kasir/cart";
import ConfirmModal from "@/components/kasir/confirmModal";
import PaymentModal from "@/components/kasir/paymentModal";
import SelectedProductModal from "@/components/kasir/selectedProductModal";
import { useModals } from "@/hooks/useModals";
import { Product } from "@/types/product";
import { CartItem } from "@/types/cart";
import { AuthUser } from "@/types/user";

export default function KasirPage() {
    const { modals:confirmModal, open:confirmOpen, close:confirmClose } = useModals();
    const { modals:productModal, open:productOpen, close:productClose } = useModals();
    const { modals:paymentModal, open:paymentOpen, close:paymentClose } = useModals();
    
    const [products, setProducts] = useState<Product[]>([]);
    const [productSelected, setProductSelected] = useState<Product | null>(null)
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState< PaymentType | null>(null);

    const { data: session } = useSession();
    const authUser = session?.user as AuthUser | null;
    
    const handleTransaction = async () => {
        const totalPrice = cartItems.reduce((sum, item) => {
            return sum + item.quantity * item.price;
        }, 0);
        const payload:any = {
            cashierId: authUser!.id,
            paymentType: paymentMethod,
            totalPrice: totalPrice,
            products: cartItems.map(item =>({
                productId: item.id,
                quantity: item.quantity,
                subtotal: item.quantity * item.price
            }))
        }
        try {
            const res = await fetch('/api/transaction',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                }
            )
            if (!res.ok) {
                throw new Error('Transaction failed');
            }
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
                const data = await res.json();
                
                setProducts(
                    data.map((item: Product) => ({
                        ...item,
                        products: item.products.map(product => ({ ...product }))
                    }))
                );
                
            } catch (error) {
                console.error(error);
            }
        }
        
        fetchProducts();
    }, []);
    
    return (
        <>
            <div className="flex flex-col w-screen h-screen">
                <Navigation/>
                <div className="flex flex-1 gap-6 p-6 w-full min-h-0">
                    <div className="w-106/154 overflow-y-auto">
                        <div className="gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr">
                            {products.map((product) => (
                                <div 
                                    key={product.id} 
                                    className="flex flex-col items-center bg-(--brand-50) p-5 rounded-xl w-full h-full" //
                                    onClick={() => {
                                        setProductSelected(product);
                                        productOpen();
                                    }}
                                >
                                    <img src={product.image} alt={product.name} height={80} width={80} className="object-cover"/>
                                    <div className="flex flex-col gap-2 p-4">
                                        <span className="h-full font-bold text-lg text-center">{product.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Cart
                        cartItems={cartItems}
                        removeFromCart={removeFromCart}
                        togglePaymentModal={() => paymentOpen()}
                    />
                </div>
            </div>
            {
                confirmModal && (
                    <ConfirmModal 
                        cartItems={cartItems} 
                        paymentMethod={paymentMethod}
                        onConfirm={handleTransaction}
                        onCloseConfirmModal={() => confirmClose()} 
                    />
                )
            }
            {
                paymentModal && (
                    <PaymentModal
                        cartItems={cartItems} 
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                        onClosePaymentModal={() => paymentClose()}
                        onOpenConfirmModal={() => confirmOpen()}
                    />
                )
            }
            {
                productModal && (
                    <SelectedProductModal
                        productSelected={productSelected}
                        addToCart={addToCart}
                        onCloseProductModal={() => productClose()}
                    />
                )
            }
        </>
    );
}