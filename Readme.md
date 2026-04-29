# Local Chat

A local AI-powered chat application that allows users to interact with an AI assistant, upload documents for context, and maintain chat history. The application is fully containerized and runs locally using Docker.

## Features

- **User Authentication**: Register and login to access personalized chat sessions
- **AI Chat**: Interact with a local AI model powered by Ollama (choose from Phi-3, Llama 2, Mistral, Code Llama)
- **Model Selection**: Choose your preferred AI model from the sidebar
- **Document Upload**: Upload PDF documents to provide context for AI responses
- **Chat History**: View and manage multiple chat sessions
- **Session Management**: Create new conversations and switch between existing ones
- **Responsive UI**: Modern, dark-themed interface built with Next.js and Tailwind CSS

## Technology Stack

### Backend
- **FastAPI**: High-performance web framework for building APIs
- **SQLAlchemy**: ORM for database operations
- **PostgreSQL**: Relational database for user data and chat history
- **Ollama**: Local AI model serving (Phi-3, Llama 2, Mistral, Code Llama)
- **PyMuPDF**: PDF processing for document uploads

### Frontend
- **Next.js 16**: React framework for the web interface
- **React 19**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: State management
- **Jest**: Testing framework

### Infrastructure
- **Docker & Docker Compose**: Containerization and orchestration
- **PostgreSQL**: Database
- **Ollama**: AI model container

## Prerequisites

- Docker and Docker Compose installed
- At least 8GB RAM recommended for Ollama
- Git

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd local-chat
   ```

2. **Create environment file**:
   Create a `.env` file in the root directory with the following variables:
   ```env
   POSTGRES_USER=your_db_user
   POSTGRES_PASSWORD=your_db_password
   POSTGRES_DB=local_chat
   DATABASE_URL=postgresql://your_db_user:your_db_password@db:5432/local_chat
   SECRET_KEY=your_secret_key_here
   ```

3. **Build and run the application**:
   ```bash
   docker-compose up --build
   ```

   This will:
   - Build the frontend and backend containers
   - Start PostgreSQL database
   - Start Ollama service
   - Pull the Phi-3 model (first run may take time)

   **Note**: Additional models (Llama 2, Mistral, Code Llama) can be selected in the app but must be pulled manually if not available. To pull a model, run: `docker exec ollama_service ollama pull <model_name>`

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Ollama API: http://localhost:11434

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Start Chatting**: Begin a new conversation with the AI assistant
3. **Upload Documents**: Use the file upload feature to provide context from PDF documents
4. **Manage Sessions**: View chat history and switch between different conversations
5. **Logout**: Securely end your session

## API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout

### Chat
- `POST /chat` - Send message to AI and get response

### Files
- `POST /upload` - Upload document for context

### Logs
- Additional logging endpoints for debugging

## Development

### Backend Development
```bash
cd back
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Development
```bash
cd front
npm install
npm run dev
```

### Running Tests
```bash
# Backend tests (if any)
cd back
# Add test commands

# Frontend tests
cd front
npm test
```

## Project Structure

```
local-chat/
├── docker-compose.yml          # Docker orchestration
├── Readme.md                   # This file
├── back/                       # Backend application
│   ├── main.py                 # FastAPI application
│   ├── ai_service.py           # AI integration
│   ├── requirements.txt        # Python dependencies
│   ├── database/
│   │   ├── db.py              # Database configuration
│   │   └── models.py          # SQLAlchemy models
│   ├── routes/
│   │   ├── chat.py            # Chat endpoints
│   │   ├── files.py           # File upload endpoints
│   │   └── log.py             # Logging endpoints
│   └── utils/
│       ├── auth.py            # Authentication utilities
│       ├── file.py            # File processing
│       └── schemas.py         # Pydantic schemas
└── front/                      # Frontend application
    ├── package.json            # Node dependencies
    ├── app/                    # Next.js app directory
    │   ├── layout.tsx         # Root layout
    │   ├── page.tsx           # Home page
    │   ├── chat/              # Chat pages
    │   ├── login/             # Login pages
    │   ├── register/          # Registration pages
    │   └── services/          # API service functions
    ├── store/                 # Zustand stores
    └── public/                # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License



## Acknowledgments

- Ollama for local AI model serving
- Phi-3 model by Microsoft
- FastAPI and Next.js communities