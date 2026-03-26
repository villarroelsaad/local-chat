export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

    try{
  const response = await fetch("http://localhost:8000/upload-document", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
   const errorJson = await response.json().catch(() => ({ detail: "No se pudo leer el JSON de error" }));
    
    console.error("DETALLE EXACTO DEL 422:", JSON.stringify(errorJson, null, 2));
    throw new Error("Error al subir el archivo");
        }
        alert("Archivo subido correctamente");
        return await response.json();
       
        
}catch(error){
  console.error("Error en el fetch de upload:", error);
  throw error;
}

};
