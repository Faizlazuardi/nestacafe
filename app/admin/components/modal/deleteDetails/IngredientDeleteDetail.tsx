import { MaterialUsage } from "@/lib/types/product";

export function IngredientDeleteDetail({ usage }: { usage: MaterialUsage }) {
    return (
        <div className="flex flex-col gap-4 p-4 border border-(--brand-500) rounded-lg bg-(--brand-50)">
            <span className="font-bold text-lg">Detail Bahan baku yang akan dihapus</span>
            <div className="inline-flex gap-6 w-full">
                <div className="flex flex-col w-1/2">
                    <span>Nama Bahan Baku</span>
                    <span className="font-semibold">{usage.name}</span>
                </div>
                <div className="flex flex-col w-1/2">
                    <span>Jumlah yang digunakan</span>
                    <span className="font-semibold">{usage.quantityUsed} {usage.unit.toLocaleLowerCase()}</span>
                </div>
            </div>
        </div>
    );
}
