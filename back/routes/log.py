import database.models as models
import utils.auth as auth
import utils.schemas as schemas
from database.db import get_db
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # 1. user already exists?
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    db_user_username = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user_username:
        raise HTTPException(status_code=400, detail="El nombre de usuario ya está registrado")

    # 2. Hash password
    hashed_pass = auth.hash_password(user.password)
    
    # 3. build instance model
    new_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_pass
    )
    
    # Save in db
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.post("/login")
async def login(
    response: Response,
    user_credentials: schemas.UserLogin,
    db: Session = Depends(get_db),
):
    # 1. find out user by email
    user = db.query(models.User).filter(models.User.username == user_credentials.username).first()
    
    # 2. find out user already exists and verify pasword
    if not user or not auth.verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. make the token with the username as subject
    access_token = auth.create_access_token(data={"sub": user.username})
    
    # 4. set cookies
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,  # Evita robos por XSS (JavaScript no puede leerla)
        secure=False,  # Cambiar a True en producción (requiere HTTPS)
        samesite="lax",  # Cambia a "lax" si estaba en "strict"
        path="/",  # Protección básica contra CSRF
        max_age=3600,  # 1 hora de duración
        expires=3600,
    )

    return {"message": "Login exitoso", "user": user.username}

@router.get("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Sesión cerrada"}

@router.get("/users/me", response_model=schemas.UserResponse)
# example of secured endpoint with cookie authentication
async def read_users_me(
    current_username: str = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):

    user = (
        db.query(models.User).filter(models.User.username == current_username).first()
    )
    if user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user