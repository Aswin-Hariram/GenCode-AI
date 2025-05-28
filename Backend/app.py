from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from topic_manager import get_random_topic
from question_generator import generate_dsa_question
from codeCompiler import compile_code
from submitCode import submit_code
import os
import traceback
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

# Create Flask app
app = Flask(__name__)

# Enable CORS for all routes and all origins
CORS(app, resources={r"/*": {"origins": "*"}})


# Constants
TOPICS_FILE = os.getenv('TOPICS_FILE', 'dsa_topics.txt')

def read_topics():
    """Read all topics from the topics file."""
    try:
        if not os.path.exists(TOPICS_FILE):
           
            return []
        
        with open(TOPICS_FILE, 'r') as file:
            topics = file.readlines()
        
        # Clean up topics (remove whitespace and empty lines)
        return [topic.strip() for topic in topics if topic.strip()]
    except Exception as e:
        # Error reading topics file
        return []

def write_topics(topics):
    """Write topics to the topics file."""
    try:
        with open(TOPICS_FILE, 'w') as file:
            for topic in topics:
                file.write(f"{topic}\n")
        # Successfully wrote topics
        return True
    except Exception as e:
        # Error writing topics to file
        return False



@app.route('/submit', methods=['POST'])
def submit():
    """Handle code submission and evaluation."""
    if not request.is_json:
        # Invalid request format
        return jsonify({
            'result': 'Failure',
            'message': 'Invalid request format. JSON required.'
        }), 400
        
    # Retrieve code from the request body
    try:
        actualSolution = request.json.get('actualSolution')
        description = request.json.get('description')
        typedSolution = request.json.get('typedSolution')
        typedLanguage = request.json.get('language')
        
        # Validate required fields
        if not all([description, typedSolution, typedLanguage]):
            # Missing required fields
            return jsonify({
                'result': 'Failure',
                'message': 'Missing required fields in submission.'
            }), 400

        # Pass the code to submit_code function
        # Processing code submission
        result = submit_code(typedSolution, description, typedSolution, typedLanguage)

        # Check the result and respond accordingly
        return jsonify(result)

    except Exception as e:
        error_details = traceback.format_exc()
        # Error in code submission
        return jsonify({
            'result': 'Failure',
            'message': f'Error while processing submission: {str(e)}'
        }), 500


@app.route('/compiler', methods=['POST'])
def compile():
    """Compile and run code."""
    if not request.is_json:
        # Invalid request format
        return jsonify({
            'result': 'Failure',
            'message': 'Invalid request format. JSON required.'
        }), 400
        
    try:
        # Retrieve code from the request body
        lang = request.json.get('lang')
        code = request.json.get('code')
        
        # Validate required fields
        if not lang or not code:
            # Missing required fields for compilation
            return jsonify({
                'result': 'Failure',
                'message': 'Both language and code are required.'
            }), 400

        # Pass the code to compile_code function
        # Compiling code
        result = compile_code(code, lang)

        # Check the result and respond accordingly
        return jsonify(result)

    except Exception as e:
        error_details = traceback.format_exc()
        # Error during compilation
        return jsonify({
            'result': 'Failure',
            'message': f'Error while compiling: {str(e)}'
        }), 500

@app.route('/get_dsa_question', methods=['GET'])
def get_dsa_question():
    """Generate a random DSA question based on a topic."""
    try:
        # Get a random topic from Firebase
        topic = get_random_topic()
        if not topic:
            # No topics found in Firestore
            return jsonify({
                'error': 'No topics available. Please add topics first.'
            }), 404
            
        # Generate DSA question using the selected topic
        result = generate_dsa_question(topic)
        return jsonify(result)
    except Exception as e:
        error_details = traceback.format_exc()
        print(f"Error in get_dsa_question: {error_details}")
        # Error generating DSA question
        return jsonify({
            'error': f'Failed to generate question: {str(e)}',
            'details': str(e)  # Include more details for debugging
        }), 500

@app.route('/manage_topics')
def manage_topics():
    """Display the topics management page."""
    try:
        from firebase_service import FirebaseService
        topics = FirebaseService.get_all_topics()
        # Displaying manage_topics page
        return render_template('manage_topics.html', topics=topics)
    except Exception as e:
        error_details = traceback.format_exc()
        # Error displaying manage_topics page
        return render_template('error.html', error=str(e)), 500

@app.route('/add_topic', methods=['POST'])
def add_topic():
    """Add a new topic to Firestore."""
    try:
        from firebase_service import FirebaseService
        new_topic = request.form.get('new_topic', '').strip()
        
        if not new_topic:
            return render_template('manage_topics.html', 
                                topics=FirebaseService.get_all_topics(), 
                                message="Topic cannot be empty", 
                                success=False)
        
        # Try to add the topic to Firebase
        if not FirebaseService.add_topic(new_topic):
            return render_template('manage_topics.html', 
                                topics=FirebaseService.get_all_topics(), 
                                message=f"Topic '{new_topic}' already exists", 
                                success=False)
        
        return render_template('manage_topics.html', 
                            topics=FirebaseService.get_all_topics(), 
                            message=f"Topic '{new_topic}' added successfully", 
                            success=True)
        
    except Exception as e:
        error_details = traceback.format_exc()
        return render_template('manage_topics.html', 
                            topics=FirebaseService.get_all_topics() if 'FirebaseService' in locals() else [], 
                            message=f"Error adding topic: {str(e)}", 
                            success=False)

@app.route('/remove_topic', methods=['POST'])
def remove_topic():
    """Remove a topic from Firestore."""
    try:
        from firebase_service import FirebaseService
        topic_to_remove = request.form.get('topic', '').strip()
        
        if not topic_to_remove:
            return render_template('manage_topics.html', 
                                topics=FirebaseService.get_all_topics(), 
                                message="No topic specified for removal", 
                                success=False)
        
        # Try to remove the topic from Firebase
        if not FirebaseService.remove_topic(topic_to_remove):
            return render_template('manage_topics.html', 
                                topics=FirebaseService.get_all_topics(), 
                                message=f"Topic '{topic_to_remove}' not found", 
                                success=False)
        
        return render_template('manage_topics.html', 
                            topics=FirebaseService.get_all_topics(), 
                            message=f"Topic '{topic_to_remove}' removed successfully", 
                            success=True)
        
    except Exception as e:
        error_details = traceback.format_exc()
        return render_template('manage_topics.html', 
                            topics=FirebaseService.get_all_topics() if 'FirebaseService' in locals() else [], 
                            message=f"Error removing topic: {str(e)}", 
                            success=False)

# Error handlers
@app.errorhandler(404)
def page_not_found(e):
    # 404 error
    return render_template('error.html', error="Page not found"), 404

@app.errorhandler(500)
def server_error(e):
    # 500 error
    return render_template('error.html', error="Internal server error"), 500

# Health check endpoint
@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy'}), 200

# Root path handler
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))  # Default to 8001 for local dev
    app.run(host="0.0.0.0", port=port)
