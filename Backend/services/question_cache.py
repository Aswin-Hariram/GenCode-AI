from flask_caching import Cache
import hashlib
import json
from datetime import datetime, timedelta
from functools import wraps

# Initialize cache
cache = Cache()

def init_cache(app):
    """Initialize cache with app"""
    app.config['CACHE_TYPE'] = 'SimpleCache'  # Use 'RedisCache' in production
    app.config['CACHE_DEFAULT_TIMEOUT'] = 3600  # 1 hour
    cache.init_app(app)

def get_question_cache_key(topic, params=None):
    """Generate cache key for a question"""
    key_parts = [topic.strip().lower()]
    if params:
        key_parts.append(json.dumps(params, sort_keys=True))
    key_string = '_'.join(key_parts)
    return f"dsa_question_{hashlib.md5(key_string.encode()).hexdigest()}"

def cache_question(timeout=3600):
    """Decorator to cache question generation"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key from function arguments
            topic = kwargs.get('topic') or (args[0] if args else None)
            if not topic:
                return func(*args, **kwargs)
            
            cache_key = get_question_cache_key(topic)
            cached_result = cache.get(cache_key)
            
            if cached_result:
                return cached_result
            
            result = func(*args, **kwargs)
            if result:
                cache.set(cache_key, result, timeout=timeout)
            return result
        return wrapper
    return decorator

class QuestionCache:
    """Manage question caching"""
    
    @staticmethod
    def get_question(topic):
        """Get cached question for topic"""
        cache_key = get_question_cache_key(topic)
        return cache.get(cache_key)
    
    @staticmethod
    def set_question(topic, question_data, timeout=3600):
        """Cache a question"""
        cache_key = get_question_cache_key(topic)
        cache.set(cache_key, question_data, timeout=timeout)
    
    @staticmethod
    def invalidate_topic(topic):
        """Invalidate cache for a specific topic"""
        cache_key = get_question_cache_key(topic)
        cache.delete(cache_key)
    
    @staticmethod
    def clear_all():
        """Clear all cached questions"""
        cache.clear()
    
    @staticmethod
    def get_cached_questions():
        """Get all cached question keys (debugging)"""
        # This depends on the cache backend
        return cache.cache._cache.keys() if hasattr(cache.cache, '_cache') else []