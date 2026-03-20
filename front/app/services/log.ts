import { useAuthStore } from "@/store/userAuthStore"; 

export const login = async (username: string, password: string) => {
    try {
        const response = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
            credentials: "include",
        });

        if (response.ok) {
            const { login: loginUser } = useAuthStore.getState();
            loginUser(username);
            alert("¡Sesión iniciada!");
       
            window.location.href = "/chat"; 
        } else {
            const errorData = await response.json(); 
            alert("Error en las credenciales: " + (errorData.message || "Intente de nuevo"));
        }
    } catch (error) {
        console.error("Error de red:", error);
        alert("No se pudo conectar con el servidor.");
    }
}