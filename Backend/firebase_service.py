import firebase_admin
from firebase_admin import credentials, firestore
import os
import random

class FirebaseService:
    _instance = None
    
    @classmethod
    def initialize(cls):
        if not cls._instance:
            cred = credentials.Certificate('serviceAccountKey.json')
            firebase_admin.initialize_app(cred)
            cls._instance = firebase_admin.get_app()
            cls.db = firestore.client()
    
    @classmethod
    def get_db(cls):
        if not cls._instance:
            cls.initialize()
        return cls.db
    
    @classmethod
    def get_topics_collection(cls):
        return cls.get_db().collection('dsa_topics')
    
    @classmethod
    def get_topic_history_collection(cls):
        return cls.get_db().collection('topic_history')
    
    @classmethod
    def add_to_history(cls, topic_name):
        """
        Add a topic to history and maintain only last 15 entries
        
        Args:
            topic_name (str): Name of the topic to add to history
        """
        try:
            history_ref = cls.get_topic_history_collection()
            
            # Get the topic to find its category
            topic_doc = cls.get_topics_collection().document(topic_name).get()
            topic_data = topic_doc.to_dict() if topic_doc.exists else {}
            
            # Add new entry with timestamp and category
            history_ref.add({
                'topic_name': topic_name,
                'category': topic_data.get('category', 'Uncategorized'),
                'used_at': firestore.SERVER_TIMESTAMP
            })
            
            # Get all history entries sorted by timestamp
            history = history_ref.order_by('used_at', direction=firestore.Query.DESCENDING).stream()
            
            # Delete older entries beyond 15
            entries_to_keep = 15
            entries = list(history)
            if len(entries) > entries_to_keep:
                for entry in entries[entries_to_keep:]:
                    entry.reference.delete()
                    
        except Exception as e:
            print(f"Error adding to history: {str(e)}")
    
    @classmethod
    def get_recent_topics(cls, limit=15):
        """
        Get list of recently used topics with timestamps
        
        Args:
            limit (int): Maximum number of recent topics to return
            
        Returns:
            List[Dict]: List of dictionaries containing topic info with 'name', 'used_at', and 'id'
        """
        try:
            history_ref = cls.get_topic_history_collection()
            history_docs = history_ref.order_by('used_at', direction=firestore.Query.DESCENDING).limit(limit).stream()
            
            recent_topics = []
            for doc in history_docs:
                data = doc.to_dict()
                recent_topics.append({
                    'id': doc.id,
                    'name': data.get('topic_name', ''),
                    'used_at': data.get('used_at'),
                    'category': data.get('category', 'Uncategorized')
                })
            return recent_topics
        except Exception as e:
            print(f"Error getting recent topics: {str(e)}")
            return []
    
    @classmethod
    def get_all_topics(cls):
        """Get all topics from Firestore"""
        topics_ref = cls.get_topics_collection()
        docs = topics_ref.stream()
        topics = []
        for doc in docs:
            data = doc.to_dict()
            topics.append({
                'name': doc.id,
                'category': data.get('category'),
                'difficulty': data.get('difficulty', 'medium'),  # Default to medium if not set
                'created_at': data.get('created_at')
            })
        return topics
    
    @classmethod
    def add_topic(cls, topic_data):
        """Add a new topic to Firestore"""
        topics_ref = cls.get_topics_collection()
        topic_doc = topics_ref.document(topic_data['name'])
        
        if topic_doc.get().exists:
            return False
        
        topic_doc.set({
            'category': topic_data['category'],
            'difficulty': topic_data.get('difficulty', 'medium'),
            'created_at': firestore.SERVER_TIMESTAMP
        })
        return True
    
    @classmethod
    def edit_topic(cls, old_name, topic_data):
        """Edit an existing topic in Firestore"""
        topics_ref = cls.get_topics_collection()
        old_doc = topics_ref.document(old_name)
        
        if not old_doc.get().exists:
            return False, "Topic not found"
            
        if old_name != topic_data['name']:
            new_doc = topics_ref.document(topic_data['name'])
            if new_doc.get().exists:
                return False, "New topic name already exists"
            
            # Copy data to new document
            new_doc.set({
                'category': topic_data['category'],
                'difficulty': topic_data.get('difficulty', 'medium'),
                'created_at': old_doc.get().get('created_at')
            })
            old_doc.delete()
        else:
            old_doc.update({
                'category': topic_data['category'],
                'difficulty': topic_data.get('difficulty', 'medium')
            })
        return True, "Topic updated successfully"
    
    @classmethod
    def remove_topic(cls, topic_name):
        """Remove a topic from Firestore"""
        topics_ref = cls.get_topics_collection()
        topic_doc = topics_ref.document(topic_name)
        
        if not topic_doc.get().exists:
            return False
        
        topic_doc.delete()
        return True
    
    @classmethod
    def get_random_topic(cls):
        """
        Get a random topic from Firestore, avoiding recently used ones.
        
        Returns:
            Optional[Dict]: A random topic with its details or None if no topics exist
        """
        try:
            all_topics = cls.get_all_topics()
            if not all_topics:
                print("No topics available in the database")
                return None
            
            recent_topics = cls.get_recent_topics()
            # Filter out recently used topics
            available_topics = [topic for topic in all_topics if topic['name'] not in recent_topics]
            
            # If all topics have been used recently or only one topic exists
            if not available_topics:
                print("All topics have been used recently. Selecting from all topics.")
                available_topics = all_topics
            
            # Select a random topic
            selected_topic = random.choice(available_topics)
            
            # Add to history
            cls.add_to_history(selected_topic['name'])
            return selected_topic
            
        except Exception as e:
            print(f"Error in get_random_topic: {str(e)}")
            return None
    
    @classmethod
    def track_topic_usage(cls, topic_name):
        """Track when a topic is used (for direct selection or question generation)"""
        cls.add_to_history(topic_name)
