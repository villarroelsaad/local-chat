export const logOut = async () => {
  const response = await fetch('http://localhost:8000/chat/logout', {
      method: "GET",
         headers: {
      "Content-Type": "application/json",
    },
      credentials: "include", // Importante para enviar la cookie de sesión
 
  });

  if (!response.ok) {
    throw new Error("No se pudo cerrar sesion");
  }

  return await response.json();
};