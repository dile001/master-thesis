import logging
import os
import time

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def log_info(message):
    """Logs an info message."""
    logging.info(message)

def log_error(message):
    """Logs an error message."""
    logging.error(message)

def get_env_variable(var_name, default=None):
    """Returns an environment variable or a default value if missing."""
    value = os.getenv(var_name, default)
    if value is None:
        raise ValueError(f"Missing required environment variable: {var_name}")
    return value

def time_execution(func):
    """Decorator to measure function execution time."""
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} executed in {end_time - start_time:.4f} seconds")
        return result
    return wrapper
