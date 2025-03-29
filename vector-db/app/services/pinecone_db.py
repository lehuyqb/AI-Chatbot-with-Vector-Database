from typing import List, Dict, Optional
import pinecone
import os
from .base_vector_db import BaseVectorDB

class PineconeDB(BaseVectorDB):
    def __init__(self, collection_name: str = "chat-embeddings", dimension: int = 1536):
        super().__init__(collection_name, dimension)
        self._connect()
        self._create_index()

    def _connect(self):
        """Connect to Pinecone"""
        api_key = os.getenv("PINECONE_API_KEY")
        environment = os.getenv("PINECONE_ENVIRONMENT")
        if not api_key or not environment:
            raise ValueError("PINECONE_API_KEY and PINECONE_ENVIRONMENT must be set")
        
        pinecone.init(api_key=api_key, environment=environment)

    def _create_index(self):
        """Create index if it doesn't exist"""
        if self.collection_name not in pinecone.list_indexes():
            pinecone.create_index(
                name=self.collection_name,
                dimension=self.dimension,
                metric="cosine"
            )
        self.index = pinecone.Index(self.collection_name)

    def connect(self):
        """Establish connection to Pinecone"""
        self._connect()

    def disconnect(self):
        """Close connection to Pinecone"""
        # Pinecone doesn't require explicit disconnection
        pass

    def insert(self, text: str, embedding: List[float], metadata: Optional[Dict] = None):
        """Insert a new embedding with its text and metadata"""
        timestamp = self._get_timestamp()
        vector_id = f"vec_{timestamp}"
        
        # Prepare metadata
        metadata_dict = metadata or {}
        metadata_dict.update({
            "text": text,
            "timestamp": timestamp
        })
        
        # Upsert to Pinecone
        self.index.upsert(
            vectors=[(vector_id, embedding, metadata_dict)]
        )

    def search(self, query_embedding: List[float], limit: int = 5) -> List[Dict]:
        """Search for similar embeddings"""
        results = self.index.query(
            vector=query_embedding,
            top_k=limit,
            include_metadata=True
        )
        
        return [{
            "text": match.metadata.get("text", ""),
            "metadata": {k: v for k, v in match.metadata.items() if k not in ["text", "timestamp"]},
            "timestamp": match.metadata.get("timestamp", 0),
            "distance": match.score
        } for match in results.matches]

    def delete_by_timestamp(self, timestamp: int):
        """Delete entries older than the specified timestamp"""
        # Pinecone doesn't support direct deletion by timestamp
        # We would need to query first and then delete by ID
        # This is a limitation of Pinecone's free tier
        pass 