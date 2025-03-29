from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
import openai
from .services.vector_db import VectorDBService
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Vector Database Service")
vector_db = VectorDBService()

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

class EmbeddingRequest(BaseModel):
    text: str
    metadata: Optional[Dict] = None

class SearchRequest(BaseModel):
    query: str
    limit: Optional[int] = 5

@app.post("/embed")
async def create_embedding(request: EmbeddingRequest):
    """Create embedding for text and store in vector database"""
    try:
        # Get embedding from OpenAI
        response = openai.Embedding.create(
            model="text-embedding-ada-002",
            input=request.text
        )
        embedding = response["data"][0]["embedding"]
        
        # Store in vector database
        vector_db.insert(
            text=request.text,
            embedding=embedding,
            metadata=request.metadata
        )
        
        return {"status": "success", "message": "Embedding created and stored"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search")
async def search_similar(request: SearchRequest):
    """Search for similar texts using query text"""
    try:
        # Get embedding for query
        response = openai.Embedding.create(
            model="text-embedding-ada-002",
            input=request.query
        )
        query_embedding = response["data"][0]["embedding"]
        
        # Search in vector database
        results = vector_db.search(
            query_embedding=query_embedding,
            limit=request.limit
        )
        
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/cleanup/{timestamp}")
async def cleanup_old_entries(timestamp: int):
    """Delete entries older than specified timestamp"""
    try:
        vector_db.delete_by_timestamp(timestamp)
        return {"status": "success", "message": f"Deleted entries older than {timestamp}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    vector_db.close() 