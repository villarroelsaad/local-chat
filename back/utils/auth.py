import os
from datetime import datetime, timedelta

import database.models as models
from database.db import get_db
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, Request, status
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

load_dotenv()


# Configuramos el algoritmo bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)



# Configuración de seguridad (Lo ideal es que esto esté en tu archivo .env)
SECRET_KEY = os.getenv("SECRET_KEY", "dsadasdasdwww")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 60 # El token durará 1 hora

def create_access_token(data: dict):
    """
    Crea un token JWT firmado.
    'data' suele contener el email del usuario: {"sub": "kk@example.com"}
    """
    to_encode = data.copy()
    
    # Calculamos el tiempo de expiración
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Añadimos la expiración al cuerpo del token (payload)
    to_encode.update({"exp": expire})
    
    # Firmamos el token con nuestra SECRET_KEY
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt

def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sesión no encontrada",
        )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")  # type: ignore
        if username is None:
            raise HTTPException(status_code=401, detail="Token sin identificación")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    # Buscamos al usuario real en la base de datos
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    return user  # Ahora retornamos el objeto SQLAlchemy completo