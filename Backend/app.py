import logging
import os
import sys
import traceback
import gc
import psutil
import time
from functools import wraps
from datetime import datetime
from services.changeLanguage import LangChange
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from flask import Flask, jsonify, request, render_template, redirect, url_for, flash
from flask_cors import CORS

from services.topic_manager import get_random_topic, get_recent_topics, add_topic as add_topic_manager
from services.question_generator import generate_dsa_question, generate_random_faang_question
from services.codeCompiler import compile_code
from services.submitCode import submit_code
from services.firebase_service import FirebaseService
from services.askHelpToAI import ask_help_to_ai
from config.config import get_gemini_readiness, get_llm_readiness, get_openrouter_readiness
from services.language_utils import normalize_language
from services.github_service import GitHubService
# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables from .env file if it exists
load_dotenv()

# Create Flask app
app = Flask(__name__)

# Configure rate limiting
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
)

# Enable CORS for all routes and all origins
CORS(app, resources={r"/*": {"origins": "*"}})

# Rate limit error handler
@app.errorhandler(429)
def ratelimit_handler(e):
    # Custom message for /compiler endpoint
    if request.endpoint == 'compile':
        return jsonify({
            'result': 'Error',
            'message': 'more frequent compilation request try again later'
        }), 429
    # Default message for other endpoints
    return jsonify({
        'result': 'Error',
        'message': f'Rate limit exceeded: {e.description}'
    }), 429

# Memory monitoring endpoint
@app.route('/api/memory')
def memory_usage():
    process = psutil.Process(os.getpid())
    mem_info = process.memory_info()
    return jsonify({
        'rss': mem_info.rss,  # Resident Set Size
        'vms': mem_info.vms,  # Virtual Memory Size
        'percent': process.memory_percent(),
        'available_mb': psutil.virtual_memory().available / (1024 * 1024),
        'used_mb': psutil.virtual_memory().used / (1024 * 1024)
    })

def log_memory_usage():
    """Log current memory usage"""
    process = psutil.Process(os.getpid())
    mem_info = process.memory_info()
    logger.info(f"Memory usage: {mem_info.rss / (1024 * 1024):.2f} MB RSS, {mem_info.vms / (1024 * 1024):.2f} MB VMS")


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
@limiter.limit("50 per minute")  # Add rate limiting
def submit():
    """Handle code submission and evaluation."""
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({
            'result': 'Failure',
            'message': 'Invalid request format. JSON required.'
        }), 400

    try:
        actualSolution = data.get('actualSolution')
        description = data.get('description')
        typedSolution = data.get('typedSolution')
        typedLanguage = data.get('language')

        if not all([description, typedSolution, typedLanguage]):
            return jsonify({
                'result': 'Failure',
                'message': 'Missing required fields in submission.'
            }), 400

        result = submit_code(actualSolution, description, typedSolution, typedLanguage)
        return jsonify(result)

    except Exception as e:
        logger.exception("Error while processing submission")
        return jsonify({
            'result': 'Failure',
            'message': f'Error while processing submission: {str(e)}'
        }), 500


@limiter.limit("10 per minute")
@app.route('/compiler', methods=['POST'])
def compile():
    """Compile and run code."""
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({
            'result': 'Failure',
            'message': 'Invalid request format. JSON required.'
        }), 400

    try:
        lang = normalize_language(data.get('lang') or data.get('language'))
        code = data.get('code')

        if not lang or code is None:
            return jsonify({
                'result': 'Failure',
                'message': 'Both language and code are required.'
            }), 400

        if not code.strip():
            return jsonify({
                'result': 'Failure',
                'message': 'cannot compile empty code'
            }), 400

        result = compile_code(code, lang)
        return jsonify(result)

    except Exception as e:
        logger.exception("Error while compiling code")
        return jsonify({
            'result': 'Failure',
            'message': f'Error while compiling: {str(e)}'
        }), 500


@app.route('/changeLanguage', methods=['POST'])
def changeLanguage():
    """Convert the initial code from one language to another language"""
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({
            'result': 'Failure',
            'message': 'Invalid request format. JSON required.'
        }), 400

    try:
        fromLang = normalize_language(data.get('fromLang'))
        toLang = normalize_language(data.get('toLang'))
        code = data.get('code')

        if not fromLang or not toLang or code is None:
            return jsonify({
                'result': 'Failure',
                'message': 'Code, source language, and target language are required.'
            }), 400

        result = LangChange(code, fromLang, toLang)

        return jsonify(result)
    except Exception as e:
        logger.exception("Error while changing language")
        return jsonify({
            'result': 'Failure',
            'message': f'Error while processing submission: {str(e)}'
        }), 500
    
    
        

@app.route('/get_dsa_question', methods=['GET'])
def get_dsa_question():
    """Generate a DSA question based on the provided topic or a random one if not specified."""
    started_at = time.perf_counter()
    try:
        from services.firebase_service import FirebaseService
        FirebaseService.initialize()

        # Get topic from query parameter
        topic_name = request.args.get('topic', '').strip()

        if topic_name:
            resolved_topic = FirebaseService.find_topic(topic_name)
            if not resolved_topic:
                return jsonify({'error': f"Topic '{topic_name}' was not found."}), 404

            topic = resolved_topic['name']
            FirebaseService.track_topic_usage(topic)
        else:
            # If no topic is provided, get a random one, excluding recent topics
            topic_details = FirebaseService.get_random_topic()
            if not topic_details:
                return jsonify({'error': 'No topics available.'}), 404
            topic = topic_details['name']
        
        # Generate DSA question using the selected topic
        logger.info("Generating DSA question for topic: %s", topic)
        result = generate_dsa_question(topic)
        
        # Ensure topic is a string and clean it up
        topic_str = str(topic).strip()
        result['topic'] = topic_str
        
        # Get the topic details including difficulty from Firestore
        from services.firebase_service import FirebaseService
        FirebaseService.initialize()
        topics = FirebaseService.get_all_topics()
        
        # Find the topic details with case-insensitive comparison and handle potential errors
        topic_details = {}
        for t in topics:
            try:
                if 'name' in t and t['name'] and isinstance(t['name'], str):
                    if t['name'].lower() == topic_str.lower():
                        topic_details = t
                        break
            except (AttributeError, TypeError):
                continue
                
        result['difficulty'] = topic_details.get('difficulty', 'medium').lower() if isinstance(topic_details, dict) else 'medium'
        
        elapsed = time.perf_counter() - started_at
        logger.info("Generated DSA question for topic '%s' in %.2fs", topic_str, elapsed)
        return jsonify(result)
    except Exception as e:
        elapsed = time.perf_counter() - started_at
        error_details = traceback.format_exc()
        logger.error("Error in get_dsa_question after %.2fs: %s", elapsed, error_details)
        # Error generating DSA question
        return jsonify({
            'error': f'Failed to generate question: {str(e)}',
            'details': str(e)  # Include more details for debugging
        }), 500


@app.route('/generate_random_faang_question', methods=['POST'])
@limiter.limit("10 per hour")
def generate_random_faang_question_route():
    started_at = time.perf_counter()
    try:
        FirebaseService.initialize()
        existing_topics = [topic.get('name', '') for topic in FirebaseService.get_all_topics()]
        result = generate_random_faang_question(existing_topics=existing_topics)
        generated_question_id = FirebaseService.save_generated_question(result)
        result['generated_question_id'] = generated_question_id

        elapsed = time.perf_counter() - started_at
        logger.info(
            "Generated random FAANG question '%s' for %s in %.2fs",
            result.get('title', 'Untitled'),
            result.get('company', 'FAANG'),
            elapsed,
        )
        return jsonify(result)
    except Exception as e:
        elapsed = time.perf_counter() - started_at
        logger.error("Error generating random FAANG question after %.2fs: %s", elapsed, traceback.format_exc())
        return jsonify({
            'error': f'Failed to generate random FAANG question: {str(e)}',
            'details': str(e),
        }), 500

@app.route('/manage_topics')
def manage_topics():
    """Display the topics management page."""
    try:
        from services.firebase_service import FirebaseService
        # Ensure Firebase is initialized
        FirebaseService.initialize()
        topics = FirebaseService.get_all_topics()
        return render_template('manage_topics.html', topics=topics)
    except Exception as e:
        logger.error(f"Error in manage_topics: {str(e)}\n{traceback.format_exc()}")
        return render_template('manage_topics.html', 
                            topics=[], 
                            message=f"Error loading topics: {str(e)}", 
                            success=False), 500

@app.route('/add_topic', methods=['POST'])
def add_topic():
    """Add a new topic to Firestore."""
    try:
        from services.firebase_service import FirebaseService
        FirebaseService.initialize()
        
        new_topic = request.form.get('new_topic', '').strip()
        category = request.form.get('category', '').strip()
        difficulty = request.form.get('difficulty', 'medium').strip()
        
        if not new_topic or not category or not difficulty:
            return render_template('manage_topics.html', 
                                topics=FirebaseService.get_all_topics(),
                                message="Please fill in all required fields", 
                                success=False)
        
        # Prepare topic data
        topic_data = {
            'name': new_topic,
            'category': category,
            'difficulty': difficulty
        }
        
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

@app.route('/add_topics_bulk', methods=['POST'])
def add_topics_bulk():
    """Add multiple topics to Firestore (JSON API endpoint)."""
    try:
        from services.firebase_service import FirebaseService
        FirebaseService.initialize()
        
        data = request.get_json()
        if not data or 'topics' not in data:
            return jsonify({'error': 'Topics array not provided', 'success': False}), 400
        
        topics_list = data.get('topics', [])
        category = data.get('category', 'Uncategorized').strip()
        difficulty = data.get('difficulty', 'medium').strip()
        
        if not isinstance(topics_list, list) or not topics_list:
            return jsonify({'error': 'Topics must be a non-empty array', 'success': False}), 400
        
        added_count = 0
        failed_topics = []
        
        for topic_name in topics_list:
            topic_name = topic_name.strip()
            if not topic_name:
                continue
            
            topic_data = {
                'name': topic_name,
                'category': category,
                'difficulty': difficulty
            }
            
            try:
                if FirebaseService.add_topic(topic_data):
                    added_count += 1
                    logger.info(f"Topic '{topic_name}' added successfully")
                else:
                    failed_topics.append(topic_name)
                    logger.warning(f"Topic '{topic_name}' already exists or failed to add")
            except Exception as e:
                failed_topics.append(topic_name)
                logger.warning(f"Error adding topic '{topic_name}': {str(e)}")
        
        return jsonify({
            'success': True,
            'message': f"Added {added_count} topics",
            'added': added_count,
            'failed': len(failed_topics),
            'failed_topics': failed_topics
        }), 200
            
    except Exception as e:
        logger.error(f"Error in add_topics_bulk: {str(e)}\n{traceback.format_exc()}")
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/edit_topic', methods=['POST'])
def edit_topic():
    """Edit an existing topic in Firestore."""
    try:
        from services.firebase_service import FirebaseService
        FirebaseService.initialize()
        
        old_topic_name = request.form.get('old_topic_name', '').strip()
        new_topic_name = request.form.get('new_topic_name', '').strip()
        category = request.form.get('category', '').strip()
        difficulty = request.form.get('difficulty', 'medium').strip()
        
        if not old_topic_name or not new_topic_name or not category or not difficulty:
            return render_template('manage_topics.html', 
                                topics=FirebaseService.get_all_topics(), 
                                message="All fields are required", 
                                success=False)
        
        # Prepare topic data with difficulty
        topic_data = {
            'name': new_topic_name,
            'category': category,
            'difficulty': difficulty
        }
        
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

@app.route('/update_topic', methods=['POST'])
def update_topic():
    """Update an existing topic in Firestore (JSON API endpoint)."""
    try:
        from services.firebase_service import FirebaseService
        FirebaseService.initialize()
        
        data = request.get_json()
        if not data or 'name' not in data:
            return jsonify({'error': 'Topic data not provided', 'success': False}), 400
        
        old_name = data.get('old_name', data.get('name', '')).strip()
        new_name = data.get('name', '').strip()
        category = data.get('category', 'Uncategorized').strip()
        difficulty = data.get('difficulty', 'medium').strip()
        
        if not new_name:
            return jsonify({'error': 'Topic name is required', 'success': False}), 400
        
        topic_data = {
            'name': new_name,
            'category': category,
            'difficulty': difficulty
        }
        
        # If name changed, delete old and add new
        if old_name and old_name != new_name:
            if not FirebaseService.remove_topic(old_name):
                return jsonify({'error': f"Could not update topic '{old_name}'", 'success': False}), 404
            if not FirebaseService.add_topic(topic_data):
                return jsonify({'error': 'Could not add updated topic', 'success': False}), 500
        else:
            # Just update the existing topic
            success, message = FirebaseService.edit_topic(old_name or new_name, topic_data)
            if not success:
                return jsonify({'error': message, 'success': False}), 400
        
        logger.info(f"Topic updated: {new_name}")
        return jsonify({
            'message': f"Topic updated successfully",
            'success': True,
            'updated_topic': new_name
        }), 200
            
    except Exception as e:
        logger.error(f"Error in update_topic: {str(e)}\n{traceback.format_exc()}")
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/remove_topic', methods=['POST'])
def remove_topic():
    """Remove a topic from Firestore."""
    try:
        from services.firebase_service import FirebaseService
        FirebaseService.initialize()
        
        topic_to_remove = request.form.get('topic', '').strip()
        
        if not topic_to_remove:
            return render_template('manage_topics.html', 
                                topics=FirebaseService.get_all_topics(), 
                                message="No topic specified for removal", 
                                success=False)
        
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
        logger.error(f"Error in remove_topic: {str(e)}\n{traceback.format_exc()}")
        return render_template('manage_topics.html', 
                            topics=FirebaseService.get_all_topics() if 'FirebaseService' in locals() else [], 
                            message=f"Error removing topic: {str(e)}", 
                            success=False)

@app.route('/load_topics_from_github', methods=['POST'])
def load_topics_from_github_route():
    """Load topics from a GitHub repository."""
    try:
        data = request.get_json()
        if not data or 'repo_url' not in data:
            return jsonify({'error': 'repo_url not provided'}), 400

        repo_url = data['repo_url']
        added_count, existed_count = GitHubService.load_topics_from_github(repo_url)

        return jsonify({
            'message': f'Successfully loaded topics from {repo_url}',
            'added': added_count,
            'existed': existed_count
        })
    except Exception as e:
        logger.error(f"Error in load_topics_from_github_route: {str(e)}\n{traceback.format_exc()}")
        return jsonify({'error': str(e)}), 500

@app.route('/find_topic_gaps', methods=['POST'])
def find_topic_gaps_route():
    """Finds topics that are in a GitHub repository but not in Firebase."""
    try:
        data = request.get_json()
        if not data or 'repo_url' not in data:
            return jsonify({'error': 'repo_url not provided'}), 400

        repo_url = data['repo_url']
        repo_topics = GitHubService.get_topics_from_repo(repo_url)
        
        FirebaseService.initialize()
        firebase_topics = [topic['name'] for topic in FirebaseService.get_all_topics()]
        
        missing_topics = [topic for topic in repo_topics if topic not in firebase_topics]

        return jsonify({
            'message': f'Found {len(missing_topics)} missing topics.',
            'missing_topics': missing_topics
        })
    except Exception as e:
        logger.error(f"Error in find_topic_gaps_route: {str(e)}\n{traceback.format_exc()}")
        return jsonify({'error': str(e)}), 500

@app.route('/delete_topic', methods=['POST'])
def delete_topic():
    """Delete a topic from Firebase (JSON API endpoint)."""
    try:
        from services.firebase_service import FirebaseService
        FirebaseService.initialize()
        
        data = request.get_json()
        if not data or 'name' not in data:
            return jsonify({'error': 'Topic name not provided', 'success': False}), 400
        
        topic_name = data.get('name', '').strip()
        
        if not topic_name:
            return jsonify({'error': 'Topic name cannot be empty', 'success': False}), 400
        
        # Delete from Firebase
        if FirebaseService.remove_topic(topic_name):
            logger.info(f"Topic '{topic_name}' deleted successfully from Firebase")
            return jsonify({
                'message': f"Topic '{topic_name}' deleted successfully",
                'success': True,
                'deleted_topic': topic_name
            }), 200
        else:
            return jsonify({
                'error': f"Topic '{topic_name}' not found",
                'success': False
            }), 404
            
    except Exception as e:
        logger.error(f"Error in delete_topic: {str(e)}\n{traceback.format_exc()}")
        return jsonify({'error': str(e), 'success': False}), 500

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
    firebase_ready, firebase_message = FirebaseService.get_firebase_readiness()
    llm_ready, llm_message = get_llm_readiness()
    gemini_ready, gemini_message = get_gemini_readiness()
    openrouter_ready, openrouter_message = get_openrouter_readiness()
    is_healthy = firebase_ready and llm_ready

    return jsonify({
        'status': 'healthy' if is_healthy else 'degraded',
        'services': {
            'firebase': {
                'ready': firebase_ready,
                'message': firebase_message,
            },
            'gemini': {
                'ready': gemini_ready,
                'message': gemini_message,
            },
            'openrouter': {
                'ready': openrouter_ready,
                'message': openrouter_message,
            },
            'llm': {
                'ready': llm_ready,
                'message': llm_message,
            },
        },
    }), 200 if is_healthy else 503

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
@limiter.limit("300 per minute") 
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
@limiter.limit("30 per minute")  # Add rate limiting
def api_recent_topics():
    """API endpoint to get recent topics in JSON format"""
    # Log memory usage before processing
    process = psutil.Process(os.getpid())
    mem_info = process.memory_info()
    logger.info(f"Memory before recent topics: {mem_info.rss / (1024 * 1024):.2f} MB")
    
    try:
        # Limit the number of topics to reduce memory usage
        max_topics = 15
        recent = get_recent_topics(limit=max_topics)
        
        if not recent or not isinstance(recent, list):
            logger.warning("No recent topics found or invalid format")
            return jsonify({
                'success': True,
                'data': []
            })
        
        # Format the response with memory efficiency
        topics = []
        for i, topic in enumerate(recent[:max_topics], 1):
            try:
                topics.append({
                    'id': str(i),
                    'name': str(topic.get('name', '')).strip(),
                    'slug': FirebaseService.topic_to_slug(topic.get('name', '')),
                    'category': str(topic.get('category', 'Uncategorized')),
                    'difficulty': str(topic.get('difficulty', 'medium')),
                    'last_used': str(topic.get('last_used', 'Recently'))
                })
            except Exception as e:
                logger.error(f"Error formatting topic {i}: {str(e)}")
                continue
        
        # Force garbage collection
        if len(topics) > 0:
            gc.collect()
            
        logger.info(f"Returning {len(topics)} recent topics")
        return jsonify({
            'success': True,
            'data': topics
        })
        
    except Exception as e:
        logger.error(f"Error in api_recent_topics: {str(e)}\n{traceback.format_exc()}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch recent topics',
            'details': str(e)
        }), 500
    finally:
        # Log memory usage after processing
        mem_info = process.memory_info()
        logger.info(f"Memory after recent topics: {mem_info.rss / (1024 * 1024):.2f} MB")


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

@app.route('/api/ask-help-to-ai', methods=['POST'])
def api_ask_help_to_ai():
    """
    Endpoint to ask for help from AI.
    
    Request body:
    {
        "sender": "user",
        "message": "Your question or request here",
        "language": "cpp",
        "problem Data": {
            "title": "Enter problem title here",
            "description": "Enter markdown-formatted problem description here",
            "solution": "Enter C++ solution code here",
            "testcases": [],
            "difficulty": "easy | medium | hard",
            "time_complexity": "Enter time complexity (e.g., O(N + M))",
            "space_complexity": "Enter space complexity (e.g., O(M))",
            "initial_code": "Enter initial starter code here",
            "realtopic": "Enter real topic or reference here"
        }
    }   
    """
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({
            'success': False,
            'error': 'Invalid request format. JSON required.'
        }), 400

    try:
        message = data.get('message', '')
        language = data.get('language', 'cpp')
        problem_description = data.get('problemDescription') or data.get('problem Description', '')
        problem_topic = data.get('problemTopic') or data.get('problem Topic', '')
        initial_code = data.get('initialCode') or data.get('initial code', '')
        user_code_progress = data.get('userCodeProgress') or data.get('user_code_progress', '')

        if not message or not problem_description or not problem_topic:
            return jsonify({
                'success': False,
                'error': 'Message, problem description, and problem topic are required.'
            }), 400

        # Call the AI service to get help
        response = ask_help_to_ai(message, language, problem_description, problem_topic, initial_code, user_code_progress)

        return jsonify(response) 

    except Exception as e:
        logger.exception("Failed to process ask-help request")
        return jsonify({
            'success': False,
            'error': f'Failed to process request: {str(e)}'
        }), 500


@app.route('/api/all-topics', methods=['GET'])
def api_all_topics():
    """
    Optimised endpoint returning a paginated list of all topics.

    Query-params:
        limit (int, default=10, min=1, max=100)
        offset (int, default=0, min=0)

    Response:
        {
            "success": bool,
            "data": [ { id, name, category, difficulty } ]
        }
    """
    # Sanitise pagination params
    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)
    limit = min(max(limit, 1), 100)
    offset = max(offset, 0)

    try:
        FirebaseService.initialize()
        topics = FirebaseService.get_all_topics()
    except Exception as exc:
        logger.exception("Failed to fetch topics from Firestore")
        return jsonify({
            "success": False,
            "error": "Failed to fetch topics from Firestore",
            "details": str(exc)
        }), 500

    if not topics:
        return jsonify({"success": True, "data": []})

    topics.sort(key=lambda t: t.get('name', '').lower())
    paginated = topics[offset: offset + limit]

    formatted = [{
        "id": str(i + offset + 1),
        "name": t.get('name', '').strip(),
        "slug": t.get('slug') or FirebaseService.topic_to_slug(t.get('name', '')),
        "category": t.get('category', 'Uncategorized'),
        "difficulty": t.get('difficulty', 'medium')
    } for i, t in enumerate(paginated)]

    return jsonify({"success": True, "data": formatted})

if __name__ == "__main__":
    # Enable debug mode and detailed error messages
    app.debug = True
    app.config['DEBUG'] = True
    
    # Configure garbage collection
    gc.set_threshold(700, 10, 10)  # Tune these values based on your app's needs
    
    # Log memory usage periodically
    def log_memory():
        while True:
            log_memory_usage()
            time.sleep(300)  # Log every 5 minutes
    
    # Start memory logging in a separate thread
    import threading
    memory_thread = threading.Thread(target=log_memory, daemon=True)
    memory_thread.start()
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
