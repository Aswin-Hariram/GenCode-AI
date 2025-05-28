# DSA BOT

A Data Structures and Algorithms question generator and code evaluation platform.

## Features

- Random DSA question generation based on topics
- Code compilation and execution
- Solution evaluation
- Topic management interface

## Setup and Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd DSA\ BOT
   ```

2. Create and activate a virtual environment (recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   - Copy the `.env.example` file to `.env` (if not already present)
   - Update the values in `.env` as needed

## Development

To run the application in development mode:

```
python app.py
```

The application will be available at http://localhost:8080

## Production Deployment

### Configuration

1. Update the `.env` file with production settings:
   ```
   FLASK_ENV=production
   SECRET_KEY=<your-secure-secret-key>
   CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   ```

2. Set up a proper WSGI server (Gunicorn):
   ```
   gunicorn -w 4 -b 0.0.0.0:8080 app:app
   ```

### Deployment Options

#### Option 1: Deploy with Docker

1. Build the Docker image:
   ```
   docker build -t dsa-bot .
   ```

2. Run the container:
   ```
   docker run -p 8080:8080 -d dsa-bot
   ```

#### Option 2: Deploy to a Cloud Platform

The application can be deployed to platforms like:
- Heroku
- AWS Elastic Beanstalk
- Google Cloud Run
- DigitalOcean App Platform

Follow the platform-specific deployment instructions and ensure environment variables are properly configured.

## Monitoring and Logging

- Logs are stored in the `logs` directory
- The application uses a rotating file handler to manage log size
- Health check endpoint available at `/health`

## Security Considerations

- Keep your `.env` file secure and never commit it to version control
- Regularly update dependencies to patch security vulnerabilities
- Use HTTPS in production
- Generate a strong, unique SECRET_KEY for production

## License

[Specify your license here]
