import os
from .base_vector_db import VectorDBInterface
from .milvus_db import MilvusDB
from .pinecone_db import PineconeDB

def create_vector_db(collection_name: str = "chat_embeddings", dimension: int = 1536) -> VectorDBInterface:
    """
    Create a vector database instance based on the VECTOR_DB_TYPE environment variable.
    Defaults to Milvus if not specified.
    """
    db_type = os.getenv("VECTOR_DB_TYPE", "milvus").lower()
    
    if db_type == "milvus":
        return MilvusDB(collection_name, dimension)
    elif db_type == "pinecone":
        return PineconeDB(collection_name, dimension)
    else:
        raise ValueError(f"Unsupported vector database type: {db_type}") 