from firebase_service import FirebaseService
from typing import List, Optional, Tuple
import random

def get_all_topics() -> List[str]:
    """
    Get all available topics from Firebase
    
    Returns:
        List[str]: A list of all topic names
    """
    try:
        return FirebaseService.get_all_topics()
    except Exception as e:
        print(f"Error fetching topics: {str(e)}")
        return []

def get_random_topic() -> Optional[str]:
    """
    Get a random topic from Firebase
    
    Returns:
        Optional[str]: A random topic name or None if no topics exist
    """
    try:
        return FirebaseService.get_random_topic()
    except Exception as e:
        print(f"Error getting random topic: {str(e)}")
        return None

def add_topic(topic_name: str) -> Tuple[bool, str]:
    """
    Add a new topic to Firebase
    
    Args:
        topic_name (str): Name of the topic to add
        
    Returns:
        Tuple[bool, str]: (success status, message)
    """
    if not topic_name or not isinstance(topic_name, str) or not topic_name.strip():
        return False, "Topic name cannot be empty"
    
    try:
        if FirebaseService.add_topic(topic_name.strip()):
            return True, f"Topic '{topic_name}' added successfully"
        else:
            return False, f"Topic '{topic_name}' already exists"
    except Exception as e:
        error_msg = f"Error adding topic: {str(e)}"
        print(error_msg)
        return False, error_msg

def remove_topic(topic_name: str) -> Tuple[bool, str]:
    """
    Remove a topic from Firebase
    
    Args:
        topic_name (str): Name of the topic to remove
        
    Returns:
        Tuple[bool, str]: (success status, message)
    """
    if not topic_name or not isinstance(topic_name, str):
        return False, "Invalid topic name"
    
    try:
        if FirebaseService.remove_topic(topic_name):
            return True, f"Topic '{topic_name}' removed successfully"
        else:
            return False, f"Topic '{topic_name}' not found"
    except Exception as e:
        error_msg = f"Error removing topic: {str(e)}"
        print(error_msg)
        return False, error_msg