"use client";
import { useState } from "react";
import { login } from '@/app/services/log'

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // 1. Nuevo estado para manejar la carga
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // 2. Deshabilitamos el botón antes de la petición
        setIsLoading(true);

        try {
            await login(username, password);
        } catch (error) {
            console.error("Error durante el login:", error);
        } finally {
            // 3. Habilitamos el botón nuevamente cuando termine (éxito o error)
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 via-slate-900 to-black text-white">
            <form onSubmit={handleLogin} className="p-10 w-full max-w-sm bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50">
                <h1 className="text-3xl mb-6 font-bold text-center bg-linear-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
                    Inicia Sesión
                </h1>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="username-input" className="block text-sm font-medium text-gray-300 mb-1">
                            Usuario
                        </label>
                        <input
                            id="username-input"
                            type="text"
                            required
                            placeholder="Ingresa tu usuario"
                            className="block w-full text-gray-300 p-2 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password-input" className="block text-sm font-medium text-gray-300 mb-1">
                            Contraseña
                        </label>
                        <input
                            id="password-input"
                            type="password"
                            required
                            placeholder="Ingresa tu contraseña"
                            className="block w-full p-2 text-gray-300 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <p className="mt-1">
                    <a href="/register" className="text-sky-400 text-sm hover:text-sky-300"> Regístrate aquí </a>
                </p>

                {/* 4. Aplicamos el atributo disabled y estilos condicionales */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full mt-6 p-3 rounded-lg font-bold text-white transition-all duration-200 shadow-lg 
                        ${isLoading
                            ? "bg-gray-600 cursor-not-allowed opacity-70"
                            : "bg-linear-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 hover:scale-105 active:scale-95"
                        }`}
                >
                    {isLoading ? "Cargando..." : "Entrar"}
                </button>
            </form>
        </div>
    );
}