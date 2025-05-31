import random
from firebase_service import FirebaseService

def test_firebase_connection():
    try:
        # Initialize Firebase
        FirebaseService.initialize()
        print("✅ Successfully connected to Firebase")
        
        # Test getting all topics
        topics = FirebaseService.get_all_topics()
        print(f"\n📋 Current topics in Firestore:")
        for i, topic in enumerate(topics, 1):
            print(f"{i}. {topic}")
        
        # Test getting a random topic
        random_topic = FirebaseService.get_random_topic()
        print(f"\n🎲 Random topic: {random_topic if random_topic else 'No topics found'}")
        
        return True
    except Exception as e:
        print(f"\n❌ Error testing Firebase connection: {str(e)}")
        return False

if __name__ == "__main__":
    print("🔍 Testing Firebase connection...")
    success = test_firebase_connection()
    if success:
        print("\n✨ Firebase connection test completed successfully!")
    else:
        print("\n❌ Firebase connection test failed. Please check your configuration and try again.")
