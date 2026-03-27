from typing import List
from routes.files import FILE_TEXTS
import database.models as models
import utils.auth as auth
import utils.schemas as schemas
from ai_service import ask_phi

# import db
from database.db import get_db
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter()
# routes/chat.py
from routes.files import FILE_TEXTS  # <-- Importante importar la lista global

@router.post("/chat")
async def chat_with_ai(
    data: schemas.ChatRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    user_prompt = data.prompt
    # Extraemos el ID que generó tu Frontend (Zustand)
    session_id = data.session_id 

    contexto = ""
    user_docs = [doc for doc in FILE_TEXTS if doc["user_id"] == current_user.id]
    
    if user_docs:
        contexto = "\n\nINFORMACIÓN EXTRAÍDA DE TUS DOCUMENTOS:\n"
        for doc in user_docs:
            contexto += f"--- Archivo: {doc['filename']} ---\n{doc['content']}\n\n"

    promt = f"{contexto}\nPregunta del usuario: {user_prompt}"
    
    respuesta_ai = await ask_phi(promt, current_user.id)

    
    nuevo_mensaje = models.ChatMessage(
        user_id=current_user.id,
        session_id=session_id, 
        question=user_prompt, 
        answer=respuesta_ai
    )

    db.add(nuevo_mensaje)
    db.commit()

   
    return {
        "reply": respuesta_ai,
        "session_id": session_id
    }

@router.get("/chat/history", response_model=List[schemas.ChatHistoryResponse])
def get_history(
    db: Session = Depends(get_db),
    # Extraemos el usuario directamente del token JWT
    current_user: models.User = Depends(auth.get_current_user),
):
    """
    Recupera el historial basado en el token de sesión,
    no en un parámetro de la URL.
    """
    return (
        db.query(models.ChatMessage)
        .filter(models.ChatMessage.user_id == current_user.id)
        .all()
    )
