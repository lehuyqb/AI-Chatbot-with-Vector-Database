from abc import ABC, abstractmethod
from typing import List, Dict, Optional
import time

class VectorDBInterface(ABC):
    @abstractmethod
    def connect(self):
        """Establish connection to the vector database"""
        pass

    @abstractmethod
    def disconnect(self):
        """Close connection to the vector database"""
        pass

    @abstractmethod
    def insert(self, text: str, embedding: List[float], metadata: Optional[Dict] = None):
        """Insert a new embedding with its text and metadata"""
        pass

    @abstractmethod
    def search(self, query_embedding: List[float], limit: int = 5) -> List[Dict]:
        """Search for similar embeddings"""
        pass

    @abstractmethod
    def delete_by_timestamp(self, timestamp: int):
        """Delete entries older than the specified timestamp"""
        pass

class BaseVectorDB(VectorDBInterface):
    def __init__(self, collection_name: str, dimension: int):
        self.collection_name = collection_name
        self.dimension = dimension

    def _get_timestamp(self) -> int:
        """Get current timestamp"""
        return int(time.time())

    def _format_metadata(self, metadata: Optional[Dict]) -> str:
        """Format metadata for storage"""
        return str(metadata) if metadata else ""

    def _parse_metadata(self, metadata_str: str) -> Dict:
        """Parse stored metadata string back to dictionary"""
        try:
            return eval(metadata_str) if metadata_str else {}
        except:
            return {} 