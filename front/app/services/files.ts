export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

    try{
  const response = await fetch("http://localhost:8000/upload-document", {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al subir el archivo");
        }
        alert("Archivo subido correctamente");
        return await response.json();
       
        
}catch(error){
  console.error("Error en el fetch de upload:", error);
  throw error;
}

};
