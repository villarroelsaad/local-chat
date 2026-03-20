export const getChatHistory = async () => {
  const response = await fetch('http://localhost:8000/chat/history', {
      method: "GET",
         headers: {
      "Content-Type": "application/json",
    },
      credentials: "include", // Importante para enviar la cookie de sesión
 
  });

  if (!response.ok) {
    throw new Error("No se pudo cargar el historial");
  }

  return await response.json(); // Retorna la lista de mensajes de la DB
};