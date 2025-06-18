import firebase_admin
from firebase_admin import credentials, firestore
import os
import random
from datetime import timedelta

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
    def get_question_history_collection(cls):
        return cls.get_db().collection('question_history')

    @classmethod
    def add_to_question_history(cls, question_hash):
        """Add a question hash to the history and clean up old entries."""
        try:
            history_ref = cls.get_question_history_collection()
            history_ref.add({
                'hash': question_hash,
                'created_at': firestore.SERVER_TIMESTAMP
            })

            # Clean up entries older than 1 day
            one_day_ago = firestore.SERVER_TIMESTAMP - timedelta(days=1)
            old_entries_query = history_ref.where('created_at', '<', one_day_ago)
            old_docs = list(old_entries_query.stream())

            if old_docs:
                batch = cls.get_db().batch()
                for doc in old_docs:
                    batch.delete(doc.reference)
                batch.commit()
        except Exception as e:
            print(f"Error adding to question history: {str(e)}")

    @classmethod
    def is_recent_question(cls, question_hash):
        """Check if a question hash exists in the recent history."""
        try:
            history_ref = cls.get_question_history_collection()
            # Check for the hash in the last 24 hours
            one_day_ago = firestore.SERVER_TIMESTAMP - timedelta(days=1)
            query = history_ref.where('hash', '==', question_hash).where('created_at', '>', one_day_ago).limit(1)
            docs = list(query.stream())
            return len(docs) > 0
        except Exception as e:
            print(f"Error checking recent questions: {str(e)}")
            return False
    
    @classmethod
    def add_to_history(cls, topic_name, category='Uncategorized'):
        """
        Add a topic to history and maintain only the last 15 entries.
        This is optimized to reduce read and write operations.

        Args:
            topic_name (str): Name of the topic to add to history.
            category (str): Category of the topic.
        """
        try:
            history_ref = cls.get_topic_history_collection()
            db = cls.get_db()

            # Add new entry with timestamp and category
            history_ref.add({
                'topic_name': topic_name,
                'category': category,
                'used_at': firestore.SERVER_TIMESTAMP
            })

            # Efficiently find and delete older entries beyond 15
            # This query skips the 15 newest documents and gets the rest.
            query = history_ref.order_by('used_at', direction=firestore.Query.DESCENDING).offset(15)
            docs_to_delete = list(query.stream())

            if docs_to_delete:
                # Use a batch to delete all old documents in a single operation
                batch = db.batch()
                for doc in docs_to_delete:
                    batch.delete(doc.reference)
                batch.commit()

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
    def get_random_topic(cls, exclude=None):
        """
        Get a random topic from Firestore, optionally excluding some topics.

        Args:
            exclude (Optional[List[str]]): A list of topic names to exclude.

        Returns:
            Optional[Dict]: A random topic with its details or None if no topics exist.
        """
        try:
            all_topics = cls.get_all_topics()
            if not all_topics:
                print("No topics available in the database")
                return None

            # Get names of recently used topics from history
            excluded_topics = {t['name'] for t in cls.get_recent_topics()}
            
            # Add topics from the exclude list if provided
            if exclude:
                excluded_topics.update(exclude)

            # Filter out excluded topics
            available_topics = [topic for topic in all_topics if topic['name'] not in excluded_topics]

            # If no topics are left after filtering, fall back to the full list
            if not available_topics:
                print("All available topics have been used recently. Falling back to all topics.")
                available_topics = all_topics
            
            # Select a random topic
            selected_topic = random.choice(available_topics)
            
            # Add to history
            cls.add_to_history(selected_topic['name'], selected_topic.get('category', 'Uncategorized'))
            return selected_topic
            
        except Exception as e:
            print(f"Error in get_random_topic: {str(e)}")
            return None
    
    @classmethod
    def track_topic_usage(cls, topic_name):
        """Track when a topic is used (for direct selection or question generation)"""
        try:
            # Get the topic to find its category
            topic_doc = cls.get_topics_collection().document(topic_name).get()
            if topic_doc.exists:
                topic_data = topic_doc.to_dict()
                category = topic_data.get('category', 'Uncategorized')
                cls.add_to_history(topic_name, category)
            else:
                # If topic doesn't exist, add to history with a default category
                cls.add_to_history(topic_name, 'Uncategorized')
        except Exception as e:
            print(f"Error tracking topic usage: {str(e)}")
