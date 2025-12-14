import { CartItem } from "@/app/types/cart";
import { PaymentType } from "@prisma/client";
import { QrCode, Banknote } from "lucide-react";
import { useState } from "react";

export default function PaymentModal({
        paymentMethod,
        setPaymentMethod,
        cartItems,
        onClosePaymentModal,
        onOpenConfirmModal,
    } : {
        paymentMethod: PaymentType | null;
        setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentType | null>>;
        cartItems: CartItem[];
        onClosePaymentModal: () => void;
        onOpenConfirmModal: () => void;
    } ) {
    
    const quickCash = [5000, 10000, 15000, 20000, 25000, 50000];
    const [cashAmount, setCashAmount] = useState<string>("");
    
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return(
        <div className="fixed inset-0 flex justify-center items-center bg-black/20">
            <div className="flex flex-col w-lg h-fit max-h-9/10">
                <div className="flex flex-col gap-2 bg-(--brand-500) text-white p-6">
                    <span className="text-2xl">Pembayaran</span>
                    <span className="text-lg">Pilih metode pembayaran anda</span>
                </div>
                <div className="flex flex-col gap-4 bg-white p-6 overflow-auto">
                    <div className="flex flex-col gap-4 bg-(--brand-50) p-6 rounded-lg w-full border border-(--brand-500)">
                        <div className="flex flex-col gap-2 py-4 border-b-2">
                            {
                                cartItems.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex justify-between">
                                                <span className="md:text-base lg:text-lg">{item.name} x{item.quantity}</span>
                                                <span className="font-bold md:text-base lg:text-lg text-(--brand-500)">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                            </div>
                                        ))}
                                    </div>
                                )
                            }
                            <div className="flex justify-between">
                                <span className="text-sm md:text-base lg:text-lg">Pajak</span>
                                <span className="font-bold text-base md:text-lg lg:text-xl text-(--brand-500)">Rp {tax.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm md:text-base lg:text-xl">Total</span>
                            <span className="font-bold text-(--brand-500) text-base md:text-lg lg:text-xl">Rp {total.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="font-bold text-xl">Metode Pembayaran</span>
                        <div className="flex gap-4">
                            <button 
                                className={`
                                    flex flex-col items-center gap-2 p-4 w-full border border-(--brand-500) text-(--brand-700) rounded-lg 
                                    ${paymentMethod === PaymentType.qris ? 'bg-(--brand-100)' : ''} 
                                `}
                                onClick={
                                    () => {
                                        if (paymentMethod === PaymentType.qris){
                                            setPaymentMethod(null)
                                        }else{
                                            setPaymentMethod(PaymentType.qris)
                                        }
                                    }
                                }
                            >
                                <QrCode className="w-12 h-fit"/>
                                <span className="font-bold">QRIS</span>
                            </button>
                            <button 
                                className={`
                                    flex flex-col items-center gap-2 p-4 w-full border border-(--brand-500) text-(--brand-700) rounded-lg 
                                    ${paymentMethod === PaymentType.cash ? 'bg-(--brand-100)' : ''} 
                                `}
                                onClick={
                                    () => {
                                        if (paymentMethod === PaymentType.cash){
                                            setPaymentMethod(null)
                                        }else{
                                            setPaymentMethod(PaymentType.cash)
                                        }
                                    }
                                }
                            >
                                <Banknote className="w-12 h-fit"/>
                                <span className="font-bold">CASH</span>
                            </button>
                        </div>
                    </div>
                    {
                        paymentMethod === PaymentType.cash ? (
                            <>
                                {/* <span className="font-bold text-xl">Pembayaran Tunai</span>
                                <input 
                                    type="number" 
                                    name="cashAmount" 
                                    id="cashAmount" 
                                    className="p-3 border rounded-lg" 
                                    placeholder="Masukkan nominal uang"
                                    value={cashAmount}
                                    onChange={(e) => setCashAmount((e.target.value))}
                                />
                                <div className="gap-3 grid grid-cols-3 grid-rows-2">
                                    {quickCash.map((amount) => (
                                        <button
                                        key={amount}
                                        className="hover:bg-gray-100 py-2 border border-(--brand-700) text-(--brand-700) rounded-lg font-medium text-sm"
                                        onClick={() => setCashAmount(amount.toString())}
                                        >
                                        Rp. {amount.toLocaleString("id-ID")}
                                        </button>
                                    ))}
                                </div> */}
                                <div className="flex gap-4">
                                    <button 
                                        className="bg-gray-100 py-4 border border-black rounded-xl w-full"
                                        onClick={() => onClosePaymentModal()} 
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        className="bg-(--brand-100) py-4 border border-(--brand-500) rounded-xl w-full"
                                        onClick={() => {
                                            onClosePaymentModal();
                                            onOpenConfirmModal();
                                        }}
                                    >
                                        Bayar
                                    </button>
                                </div>
                            </>
                        ) :
                        paymentMethod === PaymentType.qris ? (
                            <div className="flex gap-4">
                                <button 
                                    className="bg-gray-100 py-4 border border-black rounded-xl w-full"
                                    onClick={() => onClosePaymentModal()} 
                                    >
                                        Batal
                                    </button>
                                <button onClick={() => onClosePaymentModal()} className="bg-(--brand-100) py-4 border border-(--brand-500) rounded-xl w-full">Bayar</button>
                            </div>
                        ) : (
                            <>
                                <span className="bg-background text-(--brand-700) py-6 px-4 font-bold">Silahkan pilih metode pembayaran terlebih dulu</span>
                                <button 
                                    className="bg-gray-100 py-4 border-black rounded-xl"
                                    onClick={() => onClosePaymentModal()}
                                >
                                    Batal
                                </button>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
}