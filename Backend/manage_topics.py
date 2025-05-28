from flask import Flask, render_template, request, redirect, url_for, flash
import os
from firebase_service import FirebaseService

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'your-secret-key')  # Use environment variable in production

# Initialize Firebase
FirebaseService.initialize()

def read_topics():
    """Read all topics from Firebase."""
    return FirebaseService.get_all_topics()

@app.route('/')
def index():
    """Display the topics management page."""
    topics = read_topics()
    return render_template('manage_topics.html', topics=topics)

@app.route('/add_topic', methods=['POST'])
def add_topic():
    """Add a new topic to the topics file."""
    new_topic = request.form.get('new_topic', '').strip()
    
    if not new_topic:
        return render_template('manage_topics.html', 
                              topics=read_topics(), 
                              message="Topic cannot be empty", 
                              success=False)
    
    # Try to add the topic to Firebase
    if not FirebaseService.add_topic(new_topic):
        return render_template('manage_topics.html', 
                            topics=read_topics(), 
                            message=f"Topic '{new_topic}' already exists", 
                            success=False)
    
    return render_template('manage_topics.html', 
                          topics=FirebaseService.get_all_topics(), 
                          message=f"Topic '{new_topic}' added successfully", 
                          success=True)

@app.route('/remove_topic', methods=['POST'])
def remove_topic():
    """Remove a topic from the topics file."""
    topic_to_remove = request.form.get('topic', '').strip()
    
    if not topic_to_remove:
        return render_template('manage_topics.html', 
                              topics=read_topics(), 
                              message="No topic specified for removal", 
                              success=False)
    
    # Remove the topic from Firebase
    if not FirebaseService.remove_topic(topic_to_remove):
        return render_template('manage_topics.html', 
                            topics=read_topics(), 
                            message=f"Topic '{topic_to_remove}' not found", 
                            success=False)
    
    return render_template('manage_topics.html', 
                          topics=topics, 
                          message=f"Topic '{topic_to_remove}' removed successfully", 
                          success=True)

if __name__ == '__main__':
    app.run(debug=True)
