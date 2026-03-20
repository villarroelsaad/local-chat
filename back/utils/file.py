# Primero instala: pip install pymupdf
import fitz  # PyMuPDF


def extract_text_from_file(content: bytes, filename: str) -> str:
    ext = filename.split(".")[-1].lower()
    
    if ext == "txt":
        return content.decode("utf-8")
    
    elif ext == "pdf":
        text = ""
        # Abrimos el PDF desde el stream de bytes en memoria
        with fitz.open(stream=content, filetype="pdf") as doc:
            for page in doc:
                text += page.get_text()
        return text

    return ""