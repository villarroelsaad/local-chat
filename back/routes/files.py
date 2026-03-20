import database.models as models
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from utils.auth import get_current_user
from utils.file import extract_text_from_file

router = APIRouter()

# Lista para mantener los textos en memoria (puedes cambiarlo a DB luego)
FILE_TEXTS = []

@router.post("/upload-document")
async def upload_document(
    file: UploadFile = File(...), 
    current_user: models.User = Depends(get_current_user)
):
    # 1. Validaciones básicas
    if not file.filename:
        raise HTTPException(status_code=400, detail="Archivo sin nombre")
    
    # Solo permitimos formatos que sepamos leer
    allowed_extensions = ["txt", "pdf", "docx"]
    ext = file.filename.split(".")[-1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"Extensión .{ext} no permitida")

    try:
        # 2. Leer el archivo binario
        content = await file.read()
        
        # 3. Extraer el texto usando nuestra utilidad
        text = extract_text_from_file(content, file.filename)
        
        if not text:
            raise ValueError("No se pudo extraer texto legible del archivo")

        # 4. Guardar en memoria con referencia al usuario
        # Esto permite que la IA sepa qué archivos ha subido este usuario
        record = {
            "user_id": current_user.id,
            "filename": file.filename,
            "content": text
        }
        FILE_TEXTS.append(record)

        return {
            "status": "success",
            "filename": file.filename,
            "characters_extracted": len(text)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando archivo: {str(e)}")