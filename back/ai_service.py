import httpx
from routes.files import FILE_TEXTS

# El nombre del servicio en Docker es 'ollama'
OLLAMA_URL = "http://ollama:11434/api/generate"

SYSTEM_PROMPT = (
    "You are the AI Orchestrator. Your goal is to be an efficient technical assistant."
    "Respond concisely. If the user asks you to perform a task, analyze the necessary steps "
)

async def ask_ia(prompt: str, user_id: int, model: str = "phi3") -> str:
    contexto = get_context_for_user(user_id)

    # Le pasamos el texto de los archivos como "Contexto" antes de la pregunta
    full_prompt = f"Contexto de archivos:\n{contexto}\n\nPregunta: {prompt}"
    
    full_prompt = f"Sistema: {SYSTEM_PROMPT}\nUsuario: {prompt}\nAsistente:"
    
    payload = {
        "model": model,
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
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return (
                    "Error: modelo no encontrado en Ollama. "
                    "Asegúrate de que el modelo esté descargado en el contenedor Ollama "
                    "y usa el nombre exacto (por ejemplo, llama2:7b, mistral, codellama)."
                )
            return f"Error inesperado: {e.response.text or str(e)}"
        except Exception as e:
            return f"Error inesperado: {str(e)}"
        # En ai_service.py


def get_context_for_user(user_id: int) -> str:
    # Buscamos todos los textos que este usuario ha subido
    user_files = [f["content"] for f in FILE_TEXTS if f["user_id"] == user_id]
    return "\n\n".join(user_files)
