import { Product } from "@/types/product";

export default function ProductForm({
    base
}: {
    base?: Pick<Product, 'id' | 'name'>
}) {
    return (
        <>
            <label htmlFor="name" className="flex flex-col gap-2 text-xl">
                <span className="font-bold">Nama Produk</span>
                <input type="text" name="name" id="name" defaultValue={base?.name} placeholder="Masukkan Nama Produk" className="opacity-75 p-2 border rounded-md" />
            </label>
            <label htmlFor="image" className="flex flex-col gap-2 text-xl">
                <span className="font-bold">Foto Produk</span>
                <input type="file" name="image" id="image" className="opacity-75 p-2 border rounded-md" />
            </label>
        </>
    );
}