"use client"
export default function Login() {
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData);
        const res = await fetch('/api/auth/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            }
        )
        if (!res.ok) {
            alert('Login Gagal');
        }
        const data = await res.json();
        window.location.href = data.redirectTo;
    }
    return (
        <div className="flex flex-col justify-center items-center gap-5 w-screen h-screen">
            <form
                className="flex flex-col justify-center items-center gap-8 bg-white shadow-xl p-8 rounded-lg"
                onSubmit={handleLogin}
            >
                <div className="flex flex-col justify-center items-center gap-4">
                    <h1 className="font-bold text-4xl">NESTCAFE</h1>
                    <h1 className="font-thin text-xl">Enter your credentials to access the system</h1>
                </div>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2.5">
                        <label className="font-bold text-xl" htmlFor="name">
                            Nama
                        </label>
                        <input
                            className="opacity-50 p-2 border rounded-md w-110 h-10"
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Masukkan Nama"
                        />
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <label className="font-bold text-xl" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="opacity-50 p-2 border rounded-md w-110 h-10"
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Masukkan Password"
                        />
                    </div>
                </div>
                <button
                    className="py-3 rounded-md w-full text-xl hover:cursor-pointer button-primary"
                    type="submit"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
