FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    apt-utils \
    ca-certificates \
    build-essential \
    default-jdk \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*
# Set up Python virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables
ENV FLASK_APP=app.py \
    FLASK_ENV=production \
    PORT=8000 \
    WEB_CONCURRENCY=1 \
    GUNICORN_THREADS=2 \
    GUNICORN_TIMEOUT=180 \
    GUNICORN_GRACEFUL_TIMEOUT=30

EXPOSE 8000

CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-8000} --workers ${WEB_CONCURRENCY:-1} --threads ${GUNICORN_THREADS:-2} --timeout ${GUNICORN_TIMEOUT:-180} --graceful-timeout ${GUNICORN_GRACEFUL_TIMEOUT:-30} app:app"]
