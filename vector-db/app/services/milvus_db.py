from typing import List, Dict, Optional
from pymilvus import connections, Collection, FieldSchema, CollectionSchema, DataType, utility
import os
from .base_vector_db import BaseVectorDB

class MilvusDB(BaseVectorDB):
    def __init__(self, collection_name: str = "chat_embeddings", dimension: int = 1536):
        super().__init__(collection_name, dimension)
        self._connect()
        self._create_collection()

    def _connect(self):
        """Connect to Milvus server"""
        host = os.getenv("MILVUS_HOST", "localhost")
        port = os.getenv("MILVUS_PORT", "19530")
        connections.connect(host=host, port=port)

    def _create_collection(self):
        """Create collection if it doesn't exist"""
        if not utility.has_collection(self.collection_name):
            fields = [
                FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
                FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=self.dimension),
                FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=65535),
                FieldSchema(name="metadata", dtype=DataType.VARCHAR, max_length=65535),
                FieldSchema(name="timestamp", dtype=DataType.INT64)
            ]
            schema = CollectionSchema(fields=fields, description="Chat message embeddings")
            self.collection = Collection(name=self.collection_name, schema=schema)
            self.collection.create_index(field_name="embedding", index_params={
                "metric_type": "L2",
                "index_type": "IVF_FLAT",
                "params": {"nlist": 1024}
            })
        else:
            self.collection = Collection(name=self.collection_name)

    def connect(self):
        """Establish connection to Milvus"""
        self._connect()

    def disconnect(self):
        """Close connection to Milvus"""
        connections.disconnect("default")

    def insert(self, text: str, embedding: List[float], metadata: Optional[Dict] = None):
        """Insert a new embedding with its text and metadata"""
        timestamp = self._get_timestamp()
        entities = [
            [embedding],
            [text],
            [self._format_metadata(metadata)],
            [timestamp]
        ]
        self.collection.insert(entities)
        self.collection.flush()

    def search(self, query_embedding: List[float], limit: int = 5) -> List[Dict]:
        """Search for similar embeddings"""
        self.collection.load()
        search_params = {
            "metric_type": "L2",
            "params": {"nprobe": 10}
        }
        results = self.collection.search(
            data=[query_embedding],
            anns_field="embedding",
            param=search_params,
            limit=limit,
            output_fields=["text", "metadata", "timestamp"]
        )
        
        return [{
            "text": hit.entity.get("text"),
            "metadata": self._parse_metadata(hit.entity.get("metadata")),
            "timestamp": hit.entity.get("timestamp"),
            "distance": hit.distance
        } for hit in results[0]]

    def delete_by_timestamp(self, timestamp: int):
        """Delete entries older than the specified timestamp"""
        expr = f"timestamp < {timestamp}"
        self.collection.delete(expr) 