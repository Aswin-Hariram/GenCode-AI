from flask import Flask, render_template, request, redirect, url_for, flash
import os
from services.firebase_service import FirebaseService

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
    category = request.form.get('category', '').strip()
    difficulty = request.form.get('difficulty', 'medium').strip()
    
    if not new_topic or not category or not difficulty:
        return render_template('manage_topics.html', 
                            topics=read_topics(), 
                            message="Please fill in all required fields", 
                            success=False)
    
    # Prepare topic data
    topic_data = {
        'name': new_topic,
        'category': category,
        'difficulty': difficulty
    }
    
    # Try to add the topic to Firebase
    if not FirebaseService.add_topic(topic_data):
        return render_template('manage_topics.html', 
                            topics=read_topics(), 
                            message=f"Topic '{new_topic}' already exists", 
                            success=False)
    
    return render_template('manage_topics.html', 
                        topics=FirebaseService.get_all_topics(), 
                        message=f"Topic '{new_topic}' added successfully", 
                        success=True)

@app.route('/edit_topic', methods=['POST'])
def edit_topic():
    """Edit an existing topic."""
    old_name = request.form.get('old_topic_name', '').strip()
    new_name = request.form.get('new_topic_name', '').strip()
    category = request.form.get('category', '').strip()
    difficulty = request.form.get('difficulty', 'medium').strip()
    
    if not old_name or not new_name or not category or not difficulty:
        return render_template('manage_topics.html',
                            topics=read_topics(),
                            message="All fields are required",
                            success=False)
    
    # Prepare topic data
    topic_data = {
        'name': new_name,
        'category': category,
        'difficulty': difficulty
    }
    
    # Try to edit the topic in Firebase
    success, message = FirebaseService.edit_topic(old_name, topic_data)
    
    return render_template('manage_topics.html',
                        topics=FirebaseService.get_all_topics(),
                        message=message,
                        success=success)

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
                        topics=FirebaseService.get_all_topics(), 
                        message=f"Topic '{topic_to_remove}' removed successfully", 
                        success=True)

if __name__ == '__main__':
    app.run(debug=True)
