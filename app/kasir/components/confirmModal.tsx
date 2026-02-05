import { CartItem } from "@/types/cart";
import { formatIDR } from "@/lib/utils/formatIDR";
import { PaymentType } from "@prisma/client";
import { QrCode, WalletMinimal, X } from "lucide-react";

export default function ConfirmModal({
    cartItems,
    paymentMethod,
    cashAmount,
    onConfirm,
    onCloseConfirmModal,
    onOpenpaymentModal,
}:
    {
        cartItems: CartItem[];
        paymentMethod: PaymentType | null;
        cashAmount: string;
        onConfirm: () => void;
        onCloseConfirmModal: () => void;
        onOpenpaymentModal: () => void;
    }) {

    const total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const change = Number(cashAmount)-total;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/20">
            <div className="flex flex-col items-center bg-white rounded-2xl w-md max-h-9/10 overflow-auto">
                <div className="flex bg-(--brand-500) text-white p-6 rounded-t-2xl justify-between items-center w-full">
                    <span className="font-bold text-2xl">Konfirmasi Pembayaran</span>
                    <X onClick={onCloseConfirmModal}/>
                </div>
                <div className="flex flex-col gap-6 p-6 w-full">
                    <div className="flex flex-col gap-4 bg-background p-6 rounded-2xl w-full">
                        <span className="font-semibold">Detail Pesanan</span>
                        {
                            cartItems.length > 0 && (
                                <div className="flex flex-col gap-2 pb-2 border-b-2">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex justify-between">
                                            <span className="text-sm">{item.name} x{item.quantity}</span>
                                            <span className="font-bold text-(--brand-500)">{formatIDR(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                        <div className="flex justify-between">
                            <span className="text-sm md:text-base lg:text-xl">Total</span>
                            <span className="font-bold text-(--brand-500) text-sm md:text-base lg:text-xl">{formatIDR(total)}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 bg-background p-6 rounded-2xl w-full">
                        <span className="font-semibold">Informasi Pembayaran</span>
                        {
                            paymentMethod === PaymentType.CASH ? (
                                <>
                                    <div className="flex flex-col gap-2 pb-2 border-b-2">
                                        <div className="flex justify-between items-center">
                                            <span>Metode Pembayaran</span>
                                            <span className="flex gap-2">
                                                <span>Cash</span>
                                                <WalletMinimal/>
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Uang Diterima</span>
                                            <span>{formatIDR(Number(cashAmount))}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Kembalian</span>
                                        <span>{formatIDR(change)}</span>
                                    </div>
                                </>
                            ) :
                            paymentMethod === PaymentType.QRIS ? (
                                <div className="flex justify-between items-center">
                                    <span>Metode Pembayaran</span>
                                    <span className="flex gap-2">
                                        <span>QRIS</span>
                                        <QrCode/>
                                    </span>
                                </div>
                            ) : null
                        } 
                    </div>
                    <div className="flex gap-6">
                        <button
                            className="px-6 py-3 rounded-md w-full hover:cursor-pointer button-secondary"
                            onClick={() => {
                                onCloseConfirmModal();
                                onOpenpaymentModal()
                            }}
                        >
                            Batal
                        </button>
                        <button
                            className="px-6 py-3 rounded-md w-full hover:cursor-pointer button-primary"
                            onClick={() => {
                                onConfirm();
                                onCloseConfirmModal();
                            }}
                        >
                            Konfirmasi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};