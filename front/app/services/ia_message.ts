export const sendMessageToAI = async (message: string, session_id: string, model: string) => {
  try {
    const response = await fetch(`http://localhost:8000/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ prompt: message, session_id: session_id, model: model }), 
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error("Sesión expirada. Inicia sesión de nuevo.");
    
      if (response.status === 422) throw new Error("Error de validación en el servidor");
      throw new Error("Error en la respuesta de la IA");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en el fetch de chat:", error);
    throw error;
  }
};