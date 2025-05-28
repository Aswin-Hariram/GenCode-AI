# Firebase Setup for DSA Bot

This guide will help you set up Firebase for the DSA Bot application.

## Prerequisites

1. A Firebase project (create one at [Firebase Console](https://console.firebase.google.com/))
2. Python 3.6 or higher
3. Required Python packages: `firebase-admin`, `python-dotenv`

## Setup Instructions

1. **Install Required Packages**
   ```bash
   pip install firebase-admin python-dotenv
   ```

2. **Set Up Firebase Admin SDK**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Click on the gear icon ⚙️ > Project settings
   - Go to the "Service accounts" tab
   - Click "Generate new private key" and save it as `serviceAccountKey.json` in your project root
   - **IMPORTANT**: Add `serviceAccountKey.json` to your `.gitignore` file

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your Firebase project details
   - Make sure `GOOGLE_APPLICATION_CREDENTIALS` points to your `serviceAccountKey.json`

4. **Enable Firestore Database**
   - In Firebase Console, go to Firestore Database
   - Click "Create database" if you haven't already
   - Start in production mode (or test mode for development)
   - Choose a location for your database

5. **Update Security Rules (Optional but Recommended)**
   In Firebase Console > Firestore > Rules, you might want to add security rules:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /dsa_topics/{topic} {
         allow read: if true;
         allow write: if request.auth != null; // Only authenticated users can write
       }
     }
   }
   ```

## Migrating Existing Topics

If you have existing topics in `dsa_topics.txt`, you can migrate them to Firestore using this script:

```python
from firebase_service import FirebaseService

# Initialize Firebase
FirebaseService.initialize()

# Read topics from file
with open('dsa_topics.txt', 'r') as f:
    topics = [line.strip() for line in f.readlines() if line.strip()]

# Add topics to Firestore
for topic in topics:
    FirebaseService.add_topic(topic)
    print(f"Added topic: {topic}")
print("Migration completed!")
```

## Running the Application

1. Start the topic management server:
   ```bash
   python manage_topics.py
   ```
   This will start a local server at http://127.0.0.1:5000

2. Access the web interface to manage your DSA topics.

## Security Notes

- Never commit `serviceAccountKey.json` to version control
- Keep your `.env` file secure and don't commit it to version control
- In production, use environment variables or a secure secret management system
