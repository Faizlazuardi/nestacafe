"use client"

import { signIn } from "next-auth/react";

export default function Login() {
    return (
        <div className="fixed inset-0 flex justify-center items-center">
            <div className="bg-white shadow-xl p-8 rounded-lg w-lg max-h-[90vh] overflow-auto">
                <div className="flex flex-col justify-center items-center gap-4">
                    <h1 className="font-bold text-4xl text-center">NESTCAFE</h1>
                    <h1 className="font-thin text-xl text-center">Enter your credentials to access the system</h1>
                </div>
                <form className="flex flex-col gap-5 w-full"
                    action={async (formData) => {
                        await signIn("credentials", {
                            name: formData.get("name"),
                            password: formData.get("password"),
                            callbackUrl: "/",
                        })
                    }}
                >
                    <label className="flex flex-col gap-2 font-bold text-xl">
                        <span>Nama</span>
                        <input
                            className="opacity-50 p-2 border rounded-md w-full h-10"
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Masukkan Nama"
                        />
                    </label>
                    <label className="flex flex-col gap-2 font-bold text-xl">
                        <span>Password</span>
                        <input
                            className="opacity-50 p-2 border rounded-md w-full h-10"
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Masukkan Password"
                        />
                    </label>
                    <button
                        className="py-3 rounded-md w-full text-xl hover:cursor-pointer button-primary"
                        type="submit"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
