import firebase_admin
from firebase_admin import credentials, firestore
import os

class FirebaseService:
    _instance = None
    
    @classmethod
    def initialize(cls):
        if not cls._instance:
            # Initialize Firebase Admin SDK
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
    def get_all_topics(cls):
        """Get all topics from Firestore"""
        topics_ref = cls.get_topics_collection()
        docs = topics_ref.stream()
        return [doc.id for doc in docs]
    
    @classmethod
    def add_topic(cls, topic_name):
        """Add a new topic to Firestore"""
        topics_ref = cls.get_topics_collection()
        topic_doc = topics_ref.document(topic_name)
        
        if topic_doc.get().exists:
            return False  # Topic already exists
        
        topic_doc.set({'created_at': firestore.SERVER_TIMESTAMP})
        return True
    
    @classmethod
    def remove_topic(cls, topic_name):
        """Remove a topic from Firestore"""
        topics_ref = cls.get_topics_collection()
        topic_doc = topics_ref.document(topic_name)
        
        if not topic_doc.get().exists:
            return False  # Topic doesn't exist
        
        topic_doc.delete()
        return True
    
    @classmethod
    def get_random_topic(cls):
        """Get a random topic from Firestore"""
        import random
        topics = cls.get_all_topics()
        if not topics:
            return None
        return random.choice(topics)
