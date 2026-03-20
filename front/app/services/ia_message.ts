export const sendMessageToAI = async (message: string) => {
  try {
    // 1. Limpiamos la URL (ya no lleva ?prompt=...)
    const response = await fetch(`http://localhost:8000/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // 2. Enviamos el mensaje en el body como JSON
      body: JSON.stringify({ prompt: message }), 
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error("Sesión expirada. Inicia sesión de nuevo.");
      // Manejo específico para el error 422 si algo sale mal con el esquema
      if (response.status === 422) throw new Error("Error de validación en el servidor");
      throw new Error("Error en la respuesta de la IA");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en el fetch de chat:", error);
    throw error;
  }
};