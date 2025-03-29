# AI Chatbot with Vector Memory

A sophisticated chatbot that combines ChatGPT's conversational capabilities with long-term memory using vector database storage.

## Features

- Real-time chat interface built with Angular
- Long-term memory using Milvus vector database
- OpenAI integration for natural language processing
- MongoDB for persistent storage
- Context-aware responses using semantic search

## Tech Stack

- Frontend: Angular
- Backend: NestJS
- Database: MongoDB
- Vector Database: Milvus
- AI: OpenAI (GPT-4 + Embeddings)
- API: RESTful

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- OpenAI API key
- Python (for Milvus)

## Project Structure

```
chatbot-vector-database/
├── frontend/           # Angular frontend application
├── backend/           # NestJS backend application
└── vector-db/         # Milvus vector database service
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd backend
   npm install

   # Vector DB Service
   cd vector-db
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   - Create `.env` files in both frontend and backend directories
   - Add your OpenAI API key and other configuration

4. Start the services:
   ```bash
   # Start MongoDB
   # Start Vector DB Service
   python vector-db/main.py

   # Start Backend
   cd backend
   npm run start:dev

   # Start Frontend
   cd frontend
   ng serve
   ```

## Environment Variables

### Backend (.env)
```
OPENAI_API_KEY=your_api_key
MONGODB_URI=your_mongodb_uri
VECTOR_DB_URL=http://localhost:5000
```

### Frontend (.env)
```
API_URL=http://localhost:3000
```

## API Documentation

The API documentation is available at `/api/docs` when running the backend server.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT 