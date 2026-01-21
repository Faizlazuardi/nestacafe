"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login() {
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    return (
        <div className="fixed inset-0 flex justify-center items-center">
            <div className="bg-white shadow-xl p-8 rounded-lg w-lg max-h-[90vh] overflow-auto">
                <div className="flex flex-col justify-center items-center gap-4 mb-6">
                    <h1 className="font-bold text-4xl text-center">NESTCAFE</h1>
                    <h1 className="font-thin text-xl text-center">
                        Enter your credentials to access the system
                    </h1>
                </div>

                <form
                    className="flex flex-col gap-5 w-full"
                    action={async (formData) => {
                        setError(null)

                        const res = await signIn("credentials", {
                            name: formData.get("name"),
                            password: formData.get("password"),
                            redirect: false,
                        })

                        if (res?.error) {
                            setError("Nama atau password salah")
                            return
                        }

                        router.push("/")
                    }}
                >
                    {error && (
                        <div className="bg-red-100 p-3 rounded-md text-red-700 text-center">
                            {error}
                        </div>
                    )}

                    <label className="flex flex-col gap-2 font-bold text-xl">
                        <span>Nama</span>
                        <input
                            className="p-2 border rounded-md w-full h-10"
                            type="text"
                            name="name"
                            placeholder="Masukkan Nama"
                            required
                        />
                    </label>

                    <label className="flex flex-col gap-2 font-bold text-xl">
                        <span>Password</span>
                        <input
                            className="p-2 border rounded-md w-full h-10"
                            type="password"
                            name="password"
                            placeholder="Masukkan Password"
                            required
                        />
                    </label>

                    <button
                        className="py-3 rounded-md w-full text-xl button-primary"
                        type="submit"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}