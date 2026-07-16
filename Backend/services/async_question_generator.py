import threading
import queue
import hashlib
import time
from datetime import datetime
import logging
from typing import Optional, Dict, Any

from .firebase_service import FirebaseService
from .question_generator import generate_dsa_question

logger = logging.getLogger(__name__)

class AsyncQuestionGenerator:
    """Handle asynchronous question generation"""
    
    _instance = None
    _queue = None
    _processing_thread = None
    _stop_event = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialize()
        return cls._instance
    
    def _initialize(self):
        """Initialize the async generator"""
        self._queue = queue.Queue(maxsize=100)
        self._stop_event = threading.Event()
        self._processing_thread = threading.Thread(target=self._process_queue, daemon=True)
        self._processing_thread.start()
        logger.info("AsyncQuestionGenerator initialized")
    
    def add_request(self, topic: str, request_id: str) -> bool:
        """Add a question generation request to the queue"""
        try:
            self._queue.put_nowait({
                'topic': topic,
                'request_id': request_id,
                'timestamp': datetime.now()
            })
            return True
        except queue.Full:
            logger.warning("Question generation queue is full")
            return False
    
    def _process_queue(self):
        """Process queued question generation requests"""
        while not self._stop_event.is_set():
            try:
                # Get next request with timeout
                request = self._queue.get(timeout=5)
                self._generate_question(request)
                self._queue.task_done()
            except queue.Empty:
                continue
            except Exception as e:
                logger.error(f"Error processing question generation: {str(e)}")
    
    def _generate_question(self, request: Dict[str, Any]):
        """Generate a question for a request"""
        topic = request['topic']
        request_id = request['request_id']
        
        try:
            logger.info(f"Generating question for topic '{topic}' (request: {request_id})")
            
            # Generate the question
            result = generate_dsa_question(topic)
            result['topic'] = topic
            
            # Store the result
            FirebaseService.initialize()
            FirebaseService.update_pending_question(request_id, result, 'completed')
            
            logger.info(f"Successfully generated question for topic '{topic}'")
            
        except Exception as e:
            logger.error(f"Error generating question for topic '{topic}': {str(e)}")
            FirebaseService.initialize()
            FirebaseService.update_pending_question(request_id, None, 'failed', error=str(e))
    
    def get_status(self, request_id: str) -> Optional[Dict[str, Any]]:
        """Get the status of a pending question"""
        FirebaseService.initialize()
        return FirebaseService.get_pending_question(request_id)
    
    def shutdown(self):
        """Shutdown the generator"""
        self._stop_event.set()
        if self._processing_thread:
            self._processing_thread.join(timeout=10)

# Singleton instance
async_generator = AsyncQuestionGenerator()