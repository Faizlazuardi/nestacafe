import { CartItem } from "@/lib/types/cart";
import { formatIDR } from "@/lib/utils/formatIDR";
import { PaymentType } from "@prisma/client";
import { QrCode, Banknote } from "lucide-react";

export default function PaymentModal({
    paymentMethod,
    setPaymentMethod,
    cartItems,
    onClosePaymentModal,
    onOpenConfirmModal,
    cashAmount,
    setCashAmount,
}: {
    paymentMethod: PaymentType | null;
    setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentType | null>>;
    cartItems: CartItem[];
    onClosePaymentModal: () => void;
    onOpenConfirmModal: () => void;
    cashAmount: string;
    setCashAmount:React.Dispatch<React.SetStateAction<string>>
}) {
    const quickCash = [5000, 10000, 15000, 20000, 25000, 50000];
    const total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const change = Number(cashAmount) - total;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/20">
            <div className="flex flex-col shadow-2xl w-lg h-fit max-h-9/10">
                <div className="flex flex-col gap-2 bg-(--brand-500) text-white p-6 rounded-t-2xl">
                    <span className="text-2xl">Pembayaran</span>
                    <span className="text-lg">Pilih metode pembayaran anda</span>
                </div>
                <div className="flex flex-col gap-8 bg-white p-6 rounded-b-2xl overflow-auto">
                    <div className="flex flex-col gap-4 bg-(--brand-50) p-6 rounded-lg w-full border border-(--brand-500)">
                        <div className="flex flex-col gap-2 py-4 border-b-2">
                            {
                                cartItems.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex justify-between">
                                                <span className="md:text-base lg:text-lg">{item.name} x{item.quantity}</span>
                                                <span className="font-bold md:text-base lg:text-lg text-(--brand-500)">{formatIDR(item.price * item.quantity)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )
                            }
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm md:text-base lg:text-xl">Total</span>
                            <span className="font-bold text-(--brand-500) text-base md:text-lg lg:text-xl">{formatIDR(total)}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="font-bold text-xl">Metode Pembayaran</span>
                        <div className="flex gap-4">
                            <button
                                className={`
                                    flex flex-col items-center gap-2 p-4 w-full border border-(--brand-500) text-(--brand-700) rounded-lg 
                                    ${paymentMethod === PaymentType.QRIS ? 'bg-(--brand-100)' : ''} 
                                `}
                                onClick={ () => {
                                    if (paymentMethod === PaymentType.QRIS) {
                                        setPaymentMethod(null)
                                    } else {
                                        setPaymentMethod(PaymentType.QRIS)
                                    }
                                }}
                            >
                                <QrCode className="w-12 h-fit" />
                                <span className="font-bold">QRIS</span>
                            </button>
                            <button
                                className={`
                                    flex flex-col items-center gap-2 p-4 w-full border border-(--brand-500) text-(--brand-700) rounded-lg 
                                    ${paymentMethod === PaymentType.CASH ? 'bg-(--brand-100)' : ''} 
                                `}
                                onClick={
                                    () => {
                                        if (paymentMethod === PaymentType.CASH) {
                                            setPaymentMethod(null)
                                        } else {
                                            setPaymentMethod(PaymentType.CASH)
                                        }
                                    }
                                }
                            >
                                <Banknote className="w-12 h-fit" />
                                <span className="font-bold">CASH</span>
                            </button>
                        </div>
                    </div>
                    {
                        paymentMethod === PaymentType.CASH ? (
                            <>
                                <div className="flex flex-col gap-4">
                                    <span className="font-bold text-xl">Pembayaran Tunai</span>
                                    <input 
                                        type="text" 
                                        inputMode="numeric"
                                        name="cashAmount" 
                                        id="cashAmount" 
                                        className="p-2 border rounded-lg font-bold text-xl" 
                                        placeholder="Masukkan nominal uang"
                                        value={cashAmount}
                                        onChange={(e) => setCashAmount(e.target.value.replace(/\D/g, ""))}
                                    />
                                    <div className="gap-3 grid grid-cols-3 grid-rows-2">
                                        {quickCash.map((amount) => (
                                            <button
                                            key={amount}
                                            className="hover:bg-gray-100 py-2 border border-(--brand-700) text-(--brand-700) rounded-lg font-semibold"
                                            onClick={() => setCashAmount(amount.toString())}
                                            >
                                            {formatIDR(amount)}
                                            </button>
                                        ))}
                                    </div>
                                    {
                                        total < Number(cashAmount) && (
                                            <div className="flex justify-between items-center bg-green-50 p-4 border border-green-500 rounded-lg">
                                                <span>Kembalian :</span>
                                                <span className="font-semibold text-green-500 text-lg">{formatIDR(change)}</span>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        className="bg-gray-100 py-4 border border-black rounded-xl w-full"
                                        onClick={onClosePaymentModal}
                                    >
                                        Batal
                                    </button>
                                    {
                                        change >= 0 && (
                                            <button
                                                className="bg-(--brand-100) py-4 border border-(--brand-500) rounded-xl w-full"
                                                onClick={() => {
                                                    onClosePaymentModal();
                                                    onOpenConfirmModal();
                                                }}
                                            >
                                                Bayar
                                            </button>
                                        )
                                    }
                                </div>
                            </>
                        ) : paymentMethod === PaymentType.QRIS ? (
                            <div className="flex gap-4">
                                <button
                                    className="bg-gray-100 py-4 border border-black rounded-xl w-full"
                                    onClick={onClosePaymentModal}
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => {
                                        setCashAmount("")
                                        onClosePaymentModal();
                                        onOpenConfirmModal();
                                    }}
                                    className="bg-(--brand-100) py-4 border border-(--brand-500) rounded-xl w-full"
                                >
                                    Bayar
                                </button>
                            </div>
                        ) : (
                            <>
                                <span className="bg-background text-(--brand-700) py-6 px-4 font-bold">Silahkan pilih metode pembayaran terlebih dulu</span>
                                <button
                                    className="bg-gray-100 py-4 border-black rounded-xl"
                                    onClick={onClosePaymentModal}
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