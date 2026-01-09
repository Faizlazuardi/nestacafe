import { User } from "@/types/user";

export default function EmployeeForm({user}: {user?: User}) {
    return (
        <>
            <label htmlFor="name" className="flex flex-col gap-2 text-xl">
                <span className="font-bold">Nama Karyawan</span>
                <input type="text" name="name" id="name" placeholder="Masukkan Nama Karyawan" defaultValue={user?.name} className="opacity-75 p-2 border rounded-md" />
            </label>
            <label htmlFor="password" className="flex flex-col gap-2 text-xl">
                <span className="font-bold">Password</span>
                <input type="password" name="password" id="password" placeholder="Masukkan Password" className="opacity-75 p-2 border rounded-md" />
            </label>
        </>
    )
}