# AI Chatbot with Long-term Memory

A sophisticated chatbot that integrates ChatGPT with long-term memory using vector databases. Built with Angular, Nest.js, and FastAPI.

## Features

- Real-time chat interface with Angular
- Long-term memory using vector databases (Milvus or Pinecone)
- Context-aware responses using similarity search
- Modern, responsive UI
- Support for multiple vector database backends

## Tech Stack

- Frontend: Angular 16
- Backend: NestJS
- Vector Database: Milvus or Pinecone
- Database: MongoDB
- AI: OpenAI GPT-3.5 and Embeddings API

## Prerequisites

- Node.js (v16 or later)
- Python 3.8+
- MongoDB
- Milvus or Pinecone account (for vector database)
- OpenAI API key

## Project Structure

```
chatbot-vector-database/
├── frontend/           # Angular frontend
├── backend/           # NestJS backend
└── vector-db/         # Vector database service (FastAPI)
```

## Setup

### 1. Vector Database Service

The vector database service supports two options: Milvus and Pinecone. Configure your choice in the `.env` file:

```env
# Choose between 'milvus' or 'pinecone'
VECTOR_DB_TYPE=milvus

# Milvus Configuration
MILVUS_HOST=localhost
MILVUS_PORT=19530

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
```

#### Milvus Setup
1. Install Milvus using Docker:
```bash
wget https://github.com/milvus-io/milvus/releases/download/v2.3.3/milvus-standalone-docker-compose.yml -O docker-compose.yml
docker-compose up -d
```

#### Pinecone Setup
1. Sign up for a Pinecone account at https://www.pinecone.io/
2. Create an index in your Pinecone console
3. Get your API key and environment from the Pinecone console

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/chatbot
OPENAI_API_KEY=your_openai_api_key_here
VECTOR_DB_URL=http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:
```env
API_URL=http://localhost:3000
```

## Running the Application

1. Start the vector database service:
```bash
cd vector-db
pip install -r requirements.txt
uvicorn app.main:app --reload
```

2. Start the backend service:
```bash
cd backend
npm run start:dev
```

3. Start the frontend development server:
```bash
cd frontend
npm run start
```

The application will be available at:
- Frontend: http://localhost:4200
- Backend: http://localhost:3000
- Vector DB Service: http://localhost:5000

## API Endpoints

### Vector Database Service
- POST `/embed`: Create and store embeddings
- POST `/search`: Search for similar texts
- DELETE `/cleanup/{timestamp}`: Remove old entries (Note: Not supported in Pinecone free tier)

### Backend Service
- POST `/chat`: Send a message and get a response
- GET `/chat/history`: Get chat history
- DELETE `/chat/cleanup`: Clean up old messages

## Vector Database Comparison

### Milvus
- Self-hosted solution
- Full control over data
- Supports all operations including deletion
- Requires more setup and maintenance

### Pinecone
- Managed service
- Easy to set up
- Limited operations in free tier
- No direct timestamp-based deletion
- Better for production deployments

Choose the vector database based on your needs:
- Use Milvus for full control and all features
- Use Pinecone for easier deployment and managed service

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 