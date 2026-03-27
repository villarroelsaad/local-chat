"use client";
import { useState } from "react";
import { register } from '@/app/services/register'

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(email, username, password);
        } catch (error) {
            console.error("Error en el registro:", error);
            alert("Error al registrarse. Por favor, inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 via-slate-900 to-black text-white">
            <form onSubmit={handleRegister} className="p-10 w-full max-w-md bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50">
                <h1 className="text-3xl mb-6 font-bold text-center bg-linear-to-r from-cyan-500 to-sky-400 bg-clip-text text-transparent">
                    Registrarse
                </h1>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email-input" className="block text-sm font-medium text-gray-300 mb-1">Correo Electrónico</label>
                        <input
                            id="email-input"
                            type="email"
                            required
                            placeholder="Ingresa tu correo electrónico"
                            className="block w-full p-2 rounded-lg text-gray-300 bg-gray-700/50 border border-gray-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="username-input" className="block text-sm font-medium text-gray-300 mb-1">Usuario</label>
                        <input
                            id="username-input"
                            type="text"
                            required
                            placeholder="Ingresa tu usuario"
                            className="block w-full p-2 rounded-lg bg-gray-700/50 text-gray-300 border border-gray-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password-input" className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
                        <input
                            id="password-input"
                            type="password"
                            required
                            placeholder="Ingresa tu contraseña"
                            className="block w-full p-2 rounded-lg bg-gray-700/50 text-gray-300 border border-gray-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full mt-6 p-3 rounded-lg font-bold text-white shadow-lg transition-all duration-200 
                        ${isLoading
                            ? "bg-gray-600 cursor-not-allowed opacity-70"
                            : "bg-linear-to-r from-cyan-600 to-sky-500 hover:from-cyan-700 hover:to-sky-600 hover:scale-105 active:scale-95"
                        }`}
                >
                    {isLoading ? "Procesando..." : "Registrarse"}
                </button>
            </form>
        </div>
    );
}