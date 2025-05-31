import firebase_admin
from firebase_admin import credentials, firestore
import os

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
        """Add a topic to history and maintain only last 15 entries"""
        history_ref = cls.get_topic_history_collection()
        
        # Add new entry with timestamp
        history_ref.add({
            'topic_name': topic_name,
            'used_at': firestore.SERVER_TIMESTAMP
        })
        
        # Get all history entries sorted by timestamp
        history = history_ref.order_by('used_at', direction=firestore.Query.DESCENDING).stream()
        
        # Delete older entries beyond 15
        count = 0
        for entry in history:
            count += 1
            if count > 15:
                entry.reference.delete()
    
    @classmethod
    def get_recent_topics(cls):
        """Get list of recently used topics"""
        history_ref = cls.get_topic_history_collection()
        history = history_ref.order_by('used_at', direction=firestore.Query.DESCENDING).limit(15).stream()
        return [doc.get('topic_name') for doc in history]
    
    @classmethod
    def get_all_topics(cls):
        """Get all topics from Firestore"""
        topics_ref = cls.get_topics_collection()
        docs = topics_ref.stream()
        return [{
            'name': doc.id,
            'category': doc.get('category'),
            'created_at': doc.get('created_at')
        } for doc in docs]
    
    @classmethod
    def add_topic(cls, topic_data):
        """Add a new topic to Firestore"""
        topics_ref = cls.get_topics_collection()
        topic_doc = topics_ref.document(topic_data['name'])
        
        if topic_doc.get().exists:
            return False
        
        topic_doc.set({
            'category': topic_data['category'],
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
                'created_at': old_doc.get().get('created_at')
            })
            old_doc.delete()
        else:
            old_doc.update({
                'category': topic_data['category']
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
        """Get a random topic from Firestore, avoiding recently used ones"""
        all_topics = cls.get_all_topics()
        if not all_topics:
            return None
        
        recent_topics = cls.get_recent_topics()
        available_topics = [topic for topic in all_topics if topic['name'] not in recent_topics]
        
        if not available_topics:
            # If all topics have been used recently, use the least recently used one
            selected_topic = all_topics[0]
        else:
            selected_topic = random.choice(available_topics)
            
        cls.add_to_history(selected_topic['name'])
        return selected_topic
    
    @classmethod
    def track_topic_usage(cls, topic_name):
        """Track when a topic is used (for direct selection or question generation)"""
        cls.add_to_history(topic_name)
