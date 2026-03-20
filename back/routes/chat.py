from typing import List

import database.models as models
import utils.auth as auth
import utils.schemas as schemas
from ai_service import ask_phi

# import db
from database.db import get_db
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/chat")
async def chat_with_ai(
    data: schemas.ChatRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    # Extraemos el texto del objeto Pydantic
    user_prompt = data.prompt

    # Llamada a la IA (usamos el texto extraído)
    respuesta_ai = await ask_phi(user_prompt, current_user.id)

    # Guardamos en DB usando el ID que sacamos del Token/Cookie
    nuevo_mensaje = models.ChatMessage(
        user_id=current_user.id, question=user_prompt, answer=respuesta_ai
    )

    db.add(nuevo_mensaje)
    db.commit()

    return {"reply": respuesta_ai}

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