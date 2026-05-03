import { User } from "@/lib/types/user";

export function EmployeeDeleteDetail({ user }: { user: User }) {
    return (
        <div className="flex flex-col gap-4 p-4 border border-(--brand-500) rounded-lg bg-(--brand-50)">
            <span className="font-bold text-lg">Detail Karyawan yang akan dihapus</span>
            <div className="inline-flex gap-6 w-full">
                <div className="flex flex-col w-1/2">
                    <span>Nama Karyawan</span>
                    <span className="font-semibold">{user.name}</span>
                </div>
                <div className="flex flex-col w-1/2">
                    <span>Role Karyawan</span>
                    <span className="font-semibold">{user.role}</span>
                </div>
            </div>
        </div>
    );
}
