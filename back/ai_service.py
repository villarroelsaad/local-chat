import httpx
from routes.files import FILE_TEXTS

# El nombre del servicio en Docker es 'ollama'
OLLAMA_URL = "http://ollama:11434/api/generate"

SYSTEM_PROMPT = (
    "Eres el Orquestador AI. Tu objetivo es ser un asistente técnico eficiente. "
    "Responde de forma concisa. Si el usuario te pide realizar una tarea, "
    "analiza los pasos necesarios. Siempre responde en español."
)

async def ask_phi(prompt: str, user_id: int) -> str:
    contexto = get_context_for_user(user_id)

    # Le pasamos el texto de los archivos como "Contexto" antes de la pregunta
    full_prompt = f"Contexto de archivos:\n{contexto}\n\nPregunta: {prompt}"
    
    full_prompt = f"Sistema: {SYSTEM_PROMPT}\nUsuario: {prompt}\nAsistente:"
    
    payload = {
        "model": "phi3",
        "prompt": full_prompt,
        "stream": False,
        "options": {
            "temperature": 0.7,
            "num_predict": 256    
        }
    }
    
    async with httpx.AsyncClient() as client:
        try:
            # Se aumenta el tiempo de respuesta en caso de tareas complejas
            response = await client.post(OLLAMA_URL, json=payload, timeout=120.0)
            response.raise_for_status()
            
            return response.json().get("response").strip()
        
        except httpx.ConnectError:
            return "Error: No se pudo conectar con el servicio Ollama. ¿Está el contenedor encendido?"
        except Exception as e:
            return f"Error inesperado: {str(e)}"
        # En ai_service.py


def get_context_for_user(user_id: int) -> str:
    # Buscamos todos los textos que este usuario ha subido
    user_files = [f["content"] for f in FILE_TEXTS if f["user_id"] == user_id]
    return "\n\n".join(user_files)
