import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { CartItem } from "@/app/types/cart";
import { VariantLabel } from "@/app/utils/variantlabel";

export default function Cart({
    cartItems,
    removeFromCart,
    togglePaymentModal,
}: {
    cartItems: CartItem[],
    removeFromCart: (product: CartItem)=>void,
    togglePaymentModal: ()=> void,
}){
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    return(
        <div className="w-45/154">
            {cartItems.length === 0 ? (
                <div className="bg-white h-fit border-(--brand-50) border rounded-lg flex flex-col gap-4 p-6 ">
                    <div className="flex justify-between w-full">
                        <span className="font-bold text-xl">Keranjang</span>
                        <ShoppingCart className="text-(--brand-500) "/>
                    </div>
                    <div className="flex flex-col items-center gap-4 py-16">
                        <div className="p-6 rounded-full w-fit h-fit bg-(--brand-50)">
                            <ShoppingCart className="w-12 h-fit  text-(--brand-500) "/>
                        </div>
                        <h3 className="font-bold text-xl text-center">Tidak ada transaksi</h3>
                        <p className="text-center">Tambahkan produk ke keranjang Anda untuk melihatnya di sini.</p>
                    </div>
                </div>
            ) : 
            (
                <div className="flex flex-col justify-between bg-white h-full border-(--brand-500) border rounded-lg gap-4 p-6 ">
                    <div className="flex justify-between w-full">
                        <span className="font-bold text-xl">Keranjang</span>
                        <ShoppingCart className="text-(--brand-500)"/>
                    </div>
                    <div className="flex flex-col gap-4 h-full overflow-y-auto">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex flex-col gap-4 bg-(--brand-50) p-4 border-(--brand-500) border rounded-lg">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between w-full">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold md:text-lg lg:text-xl">{item.name}</span>
                                            <span className="font-semibold text-lg">{VariantLabel[item.variant]}</span>
                                        </div>
                                        <Trash2 onClick={() => removeFromCart(item)} className="text-(--brand-500) hover:cursor-pointer"/>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold">X {item.quantity}</span>
                                        <span className="font-semibold text-(--brand-500) lg:text-lg">Rp {item.price.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-2 py-4 border-t-2 border-(--brand-500)">
                        <div className="flex justify-between">
                            <span className="text-sm lg:text-lg">Subtotal</span>
                            <span className="font-bold text-sm md:text-base lg:text-lg">Rp {subtotal.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm lg:text-lg">Pajak</span>
                            <span className="font-bold text-sm md:text-base lg:text-lg">Rp {tax.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between  bg-(--brand-50) border border-(--brand-500) p-4 rounded-xl">
                            <span className="text-sm md:text-base lg:text-xl">Total</span>
                            <span className="font-bold text-(--brand-500) md:text-xl lg:text-2xl">Rp {total.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                    <button 
                        className="flex justify-center items-center gap-2 py-3 rounded-xl w-full text-sm md:text-base lg:text-xl hover:cursor-pointer button-primary"
                        type="button"
                        onClick={()=>{
                            togglePaymentModal();
                        }}
                    > 
                        Bayar
                    </button>
                </div>
            )}
        </div>
    )
}