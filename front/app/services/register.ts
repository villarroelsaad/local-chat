export const register = async (email:string, username:string, password:string) => {
    try {
        const response = await fetch("http://localhost:8000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, email }),
            credentials: "include",
        });

        if (response.ok) {
            alert("¡Registro exitoso!");
            window.location.href = "/login";
        } else {
            const errorData = await response.json(); 
            alert("Error en las credenciales: " + (errorData.message || "Intente de nuevo"));
        }
    } catch (error) {
        console.error("Error de red:", error);
        alert("No se pudo conectar con el servidor.");
    }
}