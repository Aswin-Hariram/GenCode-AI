from services.firebase_service import FirebaseService
from typing import List, Optional, Tuple, Dict
import random

def get_all_topics() -> List[Dict]:
    """
    Get all available topics from Firebase
    
    Returns:
        List[Dict]: A list of all topics with their details
    """
    try:
        return FirebaseService.get_all_topics()
    except Exception as e:
        print(f"Error fetching topics: {str(e)}")
        return []

def get_random_topic() -> Tuple[Optional[Dict], str]:
    """
    Get a random topic from Firebase, avoiding recently used ones
    
    Returns:
        Tuple[Optional[Dict], str]: 
            - Random topic with its details (or None if no topics exist)
            - Status message indicating the result
    """
    try:
        topic = FirebaseService.get_random_topic()
        if not topic:
            return None, "No topics available in the database"
            
        # Get recent topics to check if we're repeating any
        recent_topics = FirebaseService.get_recent_topics()
        if topic['name'] in recent_topics[1:]:  # Skip the first one as it's the current topic
            return topic, "All topics have been used recently. Repeating from the beginning."
            
        return topic, "Random topic selected successfully"
        
    except Exception as e:
        error_msg = f"Error getting random topic: {str(e)}"
        print(error_msg)
        return None, error_msg

def get_recent_topics(limit: int = 15) -> List[Dict]:
    """
    Get a list of recently used topics with their details
    
    Args:
        limit (int): Maximum number of recent topics to return
        
    Returns:
        List[Dict]: List of dictionaries containing topic details including:
            - id (str): Document ID
            - name (str): Topic name
            - category (str): Topic category
            - used_at (datetime): When the topic was last used
            - last_used (str): Formatted time string (e.g., '2 hours ago')
    """
    try:
        from datetime import datetime, timezone
        
        recent_topics = FirebaseService.get_recent_topics(limit=limit)
        
        # Format the timestamps
        for topic in recent_topics:
            if 'used_at' in topic and topic['used_at']:
                time_diff = datetime.now(timezone.utc) - topic['used_at'].replace(tzinfo=timezone.utc)
                
                # Convert to appropriate time unit
                if time_diff.days > 365:
                    years = time_diff.days // 365
                    topic['last_used'] = f"{years} year{'s' if years > 1 else ''} ago"
                elif time_diff.days > 30:
                    months = time_diff.days // 30
                    topic['last_used'] = f"{months} month{'s' if months > 1 else ''} ago"
                elif time_diff.days > 0:
                    topic['last_used'] = f"{time_diff.days} day{'s' if time_diff.days > 1 else ''} ago"
                elif time_diff.seconds >= 3600:
                    hours = time_diff.seconds // 3600
                    topic['last_used'] = f"{hours} hour{'s' if hours > 1 else ''} ago"
                elif time_diff.seconds >= 60:
                    minutes = time_diff.seconds // 60
                    topic['last_used'] = f"{minutes} minute{'s' if minutes > 1 else ''} ago"
                else:
                    topic['last_used'] = "Just now"
            else:
                topic['last_used'] = "Unknown time"
                
        return recent_topics
        
    except Exception as e:
        print(f"Error getting recent topics: {str(e)}")
        return []


def get_topic_history() -> List[Dict]:
    """
    Get the list of recently used topics (legacy function)
    
    Returns:
        List[Dict]: List of recently used topic dictionaries
    """
    return get_recent_topics()

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