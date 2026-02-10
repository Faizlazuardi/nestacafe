import { ShoppingCart, Trash2, } from "lucide-react";
import { CartItem } from "@/lib/types/cart";
import { VariantLabel } from "@/lib/utils/variantlabel";
import { formatIDR } from "@/lib/utils/formatIDR";

export default function Cart({
    cartItems,
    removeFromCart,
    onOpenPaymentModal,
}: {
    cartItems: CartItem[],
    removeFromCart: (product: CartItem) => void,
    onOpenPaymentModal: () => void,
}) {
    const total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <>
            { cartItems.length === 0 ? (
                <div className="flex flex-col gap-4 p-6">
                    <div className="flex justify-between items-center w-full h-fit">
                        <span className="font-bold md:text-lg lg:text-xl">Keranjang</span>
                        <ShoppingCart className="text-(--brand-500) w-fit h-4 md:h-5 lg:h-6" />
                    </div>
                    <div className="flex flex-col items-center gap-4 py-16">
                        <div className="p-6 rounded-full w-fit h-fit bg-(--brand-50)">
                            <ShoppingCart className="w-12 h-fit text-(--brand-500) " />
                        </div>
                        <h3 className="font-bold text-xl text-center">Tidak ada transaksi</h3>
                        <p className="text-center">Tambahkan produk ke keranjang Anda untuk melihatnya di sini.</p>
                    </div>
                </div>
            ) :
            (
                <div className="flex flex-col justify-between gap-4 p-6 h-full">
                    <div className="flex justify-between items-center w-full h-fit">
                        <span className="font-bold md:text-lg lg:text-xl">Keranjang</span>
                        <ShoppingCart className="text-(--brand-500) h-4 md:h-5 lg:h-6 w-fit" />
                    </div>
                    <div className="flex flex-col gap-4 h-full overflow-y-auto">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex flex-col gap-4 bg-(--brand-50) p-4 border-(--brand-500) border rounded-lg">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between w-full">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold md:text-lg lg:text-xl">{item.name}</span>
                                            <span className="font-semibold text-sm md:text-base lg:text-lg">{VariantLabel[item.variant]}</span>
                                        </div>
                                        <Trash2 onClick={() => removeFromCart(item)} className="text-(--brand-500) w-fit h-4 md:h-5 lg:h-6" />
                                    </div>
                                    <div className="flex justify-between text-xs md:text-sm lg:text-base">
                                        <span className="font-semibold">X {item.quantity}</span>
                                        <span className="font-semibold text-(--brand-500) text-base md:text-lg lg:text-xl">{formatIDR(item.price)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-4 border-t-2 border-(--brand-500)">
                        <div className="flex justify-between bg-(--brand-50) border border-(--brand-500) p-4 rounded-xl">
                            <span className="text-sm md:text-base lg:text-xl">Total</span>
                            <span className="font-bold text-(--brand-500) md:text-xl lg:text-2xl">{formatIDR(total)}</span>
                        </div>
                    </div>
                    <button
                        className="flex justify-center items-center gap-2 py-3 rounded-xl w-full text-sm md:text-base lg:text-xl hover:cursor-pointer button-primary"
                        type="button"
                        onClick={() => {
                            onOpenPaymentModal();
                        }}
                    >
                        Bayar
                    </button>
                </div>
            )}
        </>
    )
}