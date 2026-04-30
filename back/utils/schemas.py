from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# Esquema base para el Usuario (lo que comparten todos)
class UserBase(BaseModel):

    email: EmailStr

# Lo que pedimos cuando alguien se registra
class UserCreate(UserBase):
    username: str = Field(..., min_length=3, max_length=50, description="El nombre de usuario debe tener entre 3 y 50 caracteres")
    password: str = Field(..., min_length=8, description="La contraseña debe tener al menos 8 caracteres")


class UserLogin(BaseModel):
    username: str
    password: str

class ChatRequest(BaseModel):
    prompt: str
    session_id: str  
    model: str = "phi3"  # Default model  


# Lo que devolvemos al Frontend (¡Nunca devolvemos la contraseña!)
class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True  # Esto permite que Pydantic lea modelos de SQLAlchemypip


class ChatHistoryResponse(BaseModel):
    id: int
    question: str
    answer: str
    created_at: datetime

    class Config:
        from_attributes = True