import { CartItem } from "@/types/cart";
import { PaymentType } from "@prisma/client";
import { WalletMinimal } from "lucide-react";

export default function ConfirmModal({ 
        cartItems, 
        paymentMethod,
        onCloseConfirmModal,
        onConfirm
    } : 
    { 
        cartItems: CartItem[]; 
        paymentMethod: PaymentType | null; 
        onCloseConfirmModal: () => void;
        onConfirm: () => void;
    }) {
    
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/20">
            <div className="flex flex-col justify-center items-center gap-6 bg-white p-8 rounded-lg w-lg">
                <WalletMinimal className="p-4 rounded-full w-16 h-16 icon"/>
                <h2 className="font-bold text-2xl">Konfirmasi Pembayaran</h2>
                <p className="font-bold">Metode Pembayaran: {paymentMethod?.toLocaleUpperCase()}</p>
                <div className="flex flex-col gap-4 bg-background p-6 rounded-2xl w-full">
                    {
                        cartItems.length > 0 && (
                            <div className="flex flex-col gap-2 pb-2 border-b-2">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between gap-20">
                                        <span className="text-sm">{item.name} x{item.quantity}</span>
                                        <span className="font-bold text-(--brand-500)">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                    </div>
                                ))}
                            </div>
                        )
                    }
                    <div className="flex justify-between">
                        <span className="text-sm md:text-base lg:text-xl">Total</span>
                        <span className="font-bold text-(--brand-500) text-sm md:text-base lg:text-xl">Rp {total.toLocaleString('id-ID')}</span>
                    </div>
                </div>
                <button 
                    className="px-6 py-3 rounded-md w-full hover:cursor-pointer button-primary"
                    onClick={ () => {
                        onConfirm();
                        onCloseConfirmModal();
                    }}
                >
                    Konfirmasi Pembayaran
                </button>
                <button 
                    className="px-6 py-3 rounded-md w-full hover:cursor-pointer button-secondary"
                    onClick={() => onCloseConfirmModal()}
                >
                    Batal
                </button>
            </div>
        </div>
    );
};