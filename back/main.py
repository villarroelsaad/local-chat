import os

import database.models as models
from database.db import engine
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chat import router as chat_router
from routes.files import router as files_router
from routes.log import router as log_router

app = FastAPI()
load_dotenv()
models.Base.metadata.create_all(bind=engine)
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers from /routes
app.include_router(log_router)
app.include_router(chat_router)
app.include_router(files_router)