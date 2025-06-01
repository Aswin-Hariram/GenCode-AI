from flask import Flask, jsonify, request, render_template, redirect, url_for, flash
from flask_cors import CORS
from topic_manager import get_random_topic, get_recent_topics, add_topic as add_topic_manager
from question_generator import generate_dsa_question
from codeCompiler import compile_code
from submitCode import submit_code
import os
import traceback
import sys
from datetime import datetime
from dotenv import load_dotenv
from firebase_service import FirebaseService

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
    """Generate a DSA question based on the provided topic or a random one if not specified."""
    try:
        # Get topic from query parameter or get a random one if not provided
        topic = request.args.get('topic')
        if not topic:
            topic = get_random_topic()
            if not topic:
                # No topics found in Firestore
                return jsonify({
                    'error': 'No topics available. Please add topics first.'
                }), 404
        
        # Generate DSA question using the selected topic
        result = generate_dsa_question(topic)
        
        # Add the topic to the response
        result['topic'] = topic
        
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
        return render_template('manage_topics.html', topics=topics)
    except Exception as e:
        error_details = traceback.format_exc()
        return render_template('error.html', error=str(e)), 500

@app.route('/add_topic', methods=['POST'])
def add_topic():
    """Add a new topic to Firestore."""
    try:
        from firebase_service import FirebaseService
        topic_data = {
            'name': request.form.get('new_topic', '').strip(),
            'category': request.form.get('category', '').strip()
        }
        
        if not topic_data['name']:
            return render_template('manage_topics.html', 
                                topics=FirebaseService.get_all_topics(), 
                                message="Topic name cannot be empty", 
                                success=False)
        
        if FirebaseService.add_topic(topic_data):
            return render_template('manage_topics.html', 
                                topics=FirebaseService.get_all_topics(), 
                                message=f"Topic '{topic_data['name']}' added successfully", 
                                success=True)
        else:
            return render_template('manage_topics.html', 
                                topics=FirebaseService.get_all_topics(), 
                                message=f"Topic '{topic_data['name']}' already exists", 
                                success=False)
            
    except Exception as e:
        error_details = traceback.format_exc()
        return render_template('manage_topics.html', 
                            topics=FirebaseService.get_all_topics() if 'FirebaseService' in locals() else [], 
                            message=f"Error adding topic: {str(e)}", 
                            success=False)

@app.route('/edit_topic', methods=['POST'])
def edit_topic():
    """Edit an existing topic in Firestore."""
    try:
        from firebase_service import FirebaseService
        old_topic_name = request.form.get('old_topic_name', '').strip()
        topic_data = {
            'name': request.form.get('new_topic_name', '').strip(),
            'category': request.form.get('category', '').strip()
        }
        
        if not topic_data['name']:
            return render_template('manage_topics.html', 
                                topics=FirebaseService.get_all_topics(), 
                                message="Topic name cannot be empty", 
                                success=False)
        
        success, message = FirebaseService.edit_topic(old_topic_name, topic_data)
        return render_template('manage_topics.html', 
                            topics=FirebaseService.get_all_topics(), 
                            message=message, 
                            success=success)
            
    except Exception as e:
        error_details = traceback.format_exc()
        return render_template('manage_topics.html', 
                            topics=FirebaseService.get_all_topics() if 'FirebaseService' in locals() else [], 
                            message=f"Error editing topic: {str(e)}", 
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
                                message="Topic name cannot be empty", 
                                success=False)
        
        if FirebaseService.remove_topic(topic_to_remove):
            return render_template('manage_topics.html', 
                                topics=FirebaseService.get_all_topics(), 
                                message=f"Topic '{topic_to_remove}' removed successfully", 
                                success=True)
        else:
            return render_template('manage_topics.html', 
                                topics=FirebaseService.get_all_topics(), 
                                message=f"Topic '{topic_to_remove}' not found", 
                                success=False)
            
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
@app.route('/recent')
def recent_topics():
    """Display the recent topics page"""
    try:
        recent_topics = get_recent_topics(limit=15)
        return render_template('recent_topics.html', recent_topics=recent_topics)
    except Exception as e:
        print(f"Error in recent_topics: {str(e)}")
        return render_template('recent_topics.html', recent_topics=[])

@app.route('/')
def index():
    """Render the main index page with recent topics"""
    try:
        # Get recent topics from the topic manager
        recent = get_recent_topics()
        return render_template('index.html', recent_topics=recent)
    except Exception as e:
        # Log the error and render the page without recent topics
        print(f"Error in index route: {e}")
        return render_template('index.html', recent_topics=[])

@app.route('/api/recent-topics', methods=['GET'])
def api_recent_topics():
    """API endpoint to get recent topics in JSON format"""
    try:
        # Get recent topics from the topic manager
        recent = get_recent_topics()
        
        # Format the response
        topics = []
        for i, topic in enumerate(recent, 1):
            topics.append({
                'id': i,
                'name': topic.get('name', '').replace(' ', '_').lower(),
                'category': topic.get('category', 'Uncategorized'),
                'last_used': topic.get('last_used', 'Recently')
            })
        
        return jsonify({
            'success': True,
            'data': topics
        })
        
    except Exception as e:
        print(f"Error in api_recent_topics: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch recent topics',
            'details': str(e)
        }), 500


def log_error(message, print_to_console=True):
    """Helper function to log errors to a file and optionally to console"""
    try:
        log_dir = os.path.join(os.path.dirname(__file__), 'logs')
        os.makedirs(log_dir, exist_ok=True)
        log_file = os.path.join(log_dir, 'api_errors.log')
        
        log_entry = f"[{datetime.now().isoformat()}] {message}\n"
        
        # Write to file
        with open(log_file, 'a') as f:
            f.write(log_entry)
            traceback.print_exc(file=f)
            f.write("\n" + "="*80 + "\n\n")
            
        # Print to console if requested
        if print_to_console:
            print(log_entry, flush=True)
            traceback.print_exc()
            print("\n" + "="*80 + "\n", flush=True)
            
    except Exception as e:
        print(f"Error in log_error: {str(e)}", flush=True)
        traceback.print_exc()

@app.route('/api/all-topics', methods=['GET'])
def api_all_topics():
    """
    API endpoint to get all topics in JSON format
    
    Returns:
        JSON response with list of topics or error message
        {
            'success': bool,
            'data': [
                {
                    'id': str,
                    'name': str,
                    'category': str,
                    'last_used': str
                }
            ]
        }
    """
    print("\n" + "="*80, flush=True)
    print("STARTING /api/all-topics ENDPOINT", flush=True)
    
    try:
        print(f"\n[DEBUG] Python path: {sys.path}", flush=True)
        print(f"[DEBUG] Current working directory: {os.getcwd()}", flush=True)
        
        # Import required Firebase modules
        try:
            import firebase_admin
            from firebase_admin import credentials, firestore
            
            # Initialize Firebase Admin SDK if not already initialized
            if not firebase_admin._apps:
                # Use the service account key from the current directory
                service_account_path = os.path.join(os.path.dirname(__file__), 'serviceAccountKey.json')
                print(f"[DEBUG] Using service account key from: {service_account_path}", flush=True)
                
                if not os.path.exists(service_account_path):
                    error_msg = f"Service account key not found at: {service_account_path}"
                    print(f"[ERROR] {error_msg}", flush=True)
                    return jsonify({
                        'success': False,
                        'error': 'Service account key not found',
                        'details': error_msg
                    }), 500
                
                try:
                    cred = credentials.Certificate(service_account_path)
                    firebase_admin.initialize_app(cred)
                    print("[DEBUG] Firebase Admin SDK initialized successfully", flush=True)
                except Exception as e:
                    error_msg = f"Failed to initialize Firebase Admin SDK: {str(e)}"
                    print(f"[ERROR] {error_msg}", flush=True)
                    traceback.print_exc()
                    return jsonify({
                        'success': False,
                        'error': 'Failed to initialize Firebase',
                        'details': str(e),
                        'type': type(e).__name__
                    }), 500
            
            # Get Firestore client
            try:
                db = firestore.client()
                print("[DEBUG] Firestore client created successfully", flush=True)
            except Exception as e:
                error_msg = f"Failed to create Firestore client: {str(e)}"
                print(f"[ERROR] {error_msg}", flush=True)
                traceback.print_exc()
                return jsonify({
                    'success': False,
                    'error': 'Failed to connect to Firestore',
                    'details': str(e),
                    'type': type(e).__name__
                }), 500
            
            # List all collections to check available collections
            try:
                print("[DEBUG] Listing all collections in Firestore...", flush=True)
                collections = list(db.collections())  # Convert to list to avoid timeout
                collection_names = [collection.id for collection in collections]
                print(f"[DEBUG] Available collections: {collection_names}", flush=True)
            except Exception as e:
                error_msg = f"Failed to list collections: {str(e)}"
                print(f"[ERROR] {error_msg}", flush=True)
                traceback.print_exc()
                return jsonify({
                    'success': False,
                    'error': 'Failed to list Firestore collections',
                    'details': str(e),
                    'type': type(e).__name__
                }), 500
            
            # Check if 'dsa_topics' collection exists
            collection_name = 'dsa_topics'
            if collection_name not in collection_names:
                print(f"[WARNING] Collection '{collection_name}' not found in Firestore", flush=True)
                return jsonify({
                    'success': False,
                    'error': f'Collection {collection_name} not found',
                    'available_collections': collection_names,
                    'data': []
                }), 404
            
            # Get all topics from the collection
            try:
                print(f"[DEBUG] Fetching topics from '{collection_name}' collection...", flush=True)
                topics_ref = db.collection(collection_name)
                docs = list(topics_ref.limit(100).stream())  # Limit to 100 documents to avoid timeout
                
                print(f"[DEBUG] Found {len(docs)} documents in '{collection_name}' collection", flush=True)
                
                # Convert Firestore documents to a list of dictionaries
                topics = []
                for doc in docs:
                    try:
                        topic_data = doc.to_dict()
                        topic_data['id'] = doc.id
                        # Use document ID as the topic name if 'name' field doesn't exist
                        if 'name' not in topic_data or not topic_data['name']:
                            topic_data['name'] = doc.id
                        topics.append(topic_data)
                    except Exception as e:
                        print(f"[ERROR] Error processing document {doc.id}: {str(e)}", flush=True)
                        continue
                
                print(f"[DEBUG] Retrieved {len(topics)} topics from Firestore", flush=True)
                
                if not topics:
                    print("[WARNING] No topics found in Firestore", flush=True)
                    return jsonify({
                        'success': False,
                        'error': 'No topics found',
                        'data': []
                    }), 404
                
                # Format the response
                print("\n[DEBUG] Formatting topics...", flush=True)
                formatted_topics = []
                for i, topic in enumerate(topics, 1):
                    try:
                        # Ensure we have a valid topic name
                        if not topic or not isinstance(topic, dict):
                            print(f"[WARNING] Skipping invalid topic: {topic}", flush=True)
                            continue
                            
                        topic_name = str(topic.get('name', '')).strip()
                        if not topic_name:
                            print(f"[WARNING] Skipping topic {i} - empty name", flush=True)
                            continue
                            
                        formatted_topic = {
                            'id': str(i),
                            'name': topic_name.replace(' ', '_').lower().strip('_'),
                            'category': str(topic.get('category', 'Uncategorized')).strip(),
                            
                        }
                        formatted_topics.append(formatted_topic)
                        
                    except Exception as e:
                        print(f"[ERROR] Error formatting topic {i}: {str(e)}", flush=True)
                        print(f"[DEBUG] Topic data: {topic}", flush=True)
                        continue
                
                print(f"[SUCCESS] Successfully formatted {len(formatted_topics)} topics", flush=True)
                print("="*80 + "\n", flush=True)
                
                return jsonify({
                    'success': True,
                    'data': formatted_topics
                })
                
            except Exception as e:
                error_msg = f"Error fetching topics from Firestore: {str(e)}"
                print(f"[ERROR] {error_msg}", flush=True)
                traceback.print_exc()
                return jsonify({
                    'success': False,
                    'error': 'Failed to fetch topics from Firestore',
                    'details': str(e),
                    'type': type(e).__name__
                }), 500
            
        except ImportError as e:
            error_msg = f"Failed to import Firebase modules: {str(e)}"
            print(f"[ERROR] {error_msg}", flush=True)
            traceback.print_exc()
            return jsonify({
                'success': False,
                'error': 'Failed to import required Firebase modules',
                'details': str(e),
                'type': 'ImportError'
            }), 500
            
    except Exception as e:
        error_msg = f"Unexpected error in api_all_topics: {str(e)}"
        print(f"\n[CRITICAL] {error_msg}", flush=True)
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'details': str(e),
            'type': type(e).__name__,
            'traceback': traceback.format_exc()
        }), 500

if __name__ == "__main__":
    # Enable debug mode and detailed error messages
    app.debug = True
    app.config['DEBUG'] = True
    app.config['PROPAGATE_EXCEPTIONS'] = True
    
    # Set up logging
    import logging
    logging.basicConfig(level=logging.DEBUG)
    logger = logging.getLogger(__name__)
    
    # Log all requests
    @app.before_request
    def log_request_info():
        logger.debug('Headers: %s', request.headers)
        logger.debug('Body: %s', request.get_data())
    
    port = int(os.environ.get("PORT", 8000))  # Default to 8000 for local dev
    logger.info(f"Starting server on port {port} with debug={app.debug}")
    app.run(host="0.0.0.0", port=port, debug=True, use_reloader=True)
