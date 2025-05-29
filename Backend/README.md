# 🚀 GenCode AI - Backend

<div align="center">
  <img src="https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI">
</div>

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Code Execution](#-code-execution)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Project Overview

The GenCode AI Backend is a robust Python Flask application that powers the GenCode AI platform. It provides APIs for code execution, question generation, user authentication, and more. The backend is designed to be scalable, secure, and efficient.

## ✨ Features

- **RESTful API** endpoints for all platform functionality
- **Secure Authentication** with Firebase
- **Code Execution** in isolated Docker containers
- **AI-Powered Question Generation**
- **Real-time Database** with Firebase
- **Logging and Monitoring**
- **Rate Limiting** and API security
- **Asynchronous Task Processing**

## 🛠 Tech Stack

- **Language**: Python 3.9+
- **Framework**: Flask
- **Database**: Firebase Realtime Database
- **Authentication**: Firebase Authentication
- **Containerization**: Docker
- **Code Execution**: Docker-based sandbox
- **AI Integration**: OpenAI API
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Pytest
- **Logging**: Python logging module

## 🚀 Getting Started

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)
- Docker and Docker Compose
- Firebase project with Authentication and Realtime Database
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/GenCode-AI-Frontend.git
   cd GenCode-AI-Frontend/Backend
   ```

2. **Create and activate a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the Backend directory:
   ```env
   FLASK_APP=app.py
   FLASK_ENV=development
   FIREBASE_CREDENTIALS=serviceAccountKey.json
   OPENAI_API_KEY=your_openai_api_key
   PORT=5000
   DEBUG=True
   ```

5. **Set up Firebase**
   - Download your Firebase service account key and save it as `serviceAccountKey.json` in the Backend directory
   - Enable Authentication and Realtime Database in your Firebase console

## 🏗 Project Structure

```
Backend/
├── app.py                 # Main application entry point
├── config.py              # Configuration settings
├── requirements.txt       # Python dependencies
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose configuration
├── serviceAccountKey.json # Firebase credentials (gitignored)
├── .env                  # Environment variables (gitignored)
├── logs/                 # Application logs
├── tests/                # Test files
└── src/                  # Source code
    ├── __init__.py
    ├── api/              # API routes
    │   ├── __init__.py
    │   ├── auth.py       # Authentication endpoints
    │   ├── code.py       # Code execution endpoints
    │   └── problems.py   # Problem management endpoints
    ├── core/             # Core functionality
    │   ├── code_executor.py  # Code execution logic
    │   ├── question_generator.py  # AI question generation
    │   └── firebase_service.py    # Firebase integration
    └── utils/            # Utility functions
        ├── helpers.py
        └── logger.py
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token

### Code Execution
- `POST /api/code/execute` - Execute code in a sandbox
- `POST /api/code/submit` - Submit code for evaluation
- `GET /api/code/results/:id` - Get execution results

### Problems
- `GET /api/problems` - Get list of problems
- `GET /api/problems/:id` - Get problem details
- `POST /api/problems` - Create new problem (admin)
- `PUT /api/problems/:id` - Update problem (admin)
- `DELETE /api/problems/:id` - Delete problem (admin)

### Topics
- `GET /api/topics` - Get all topics
- `GET /api/topics/:id` - Get topic details
- `POST /api/topics` - Create new topic (admin)

## 🚀 Code Execution

The code execution system uses Docker containers to safely run user-submitted code in an isolated environment.

### Execution Flow
1. User submits code via API
2. Backend creates a temporary directory
3. Code is written to a file in the directory
4. A Docker container is launched with the code
5. The code is executed with appropriate time and memory limits
6. Results are captured and returned to the user
7. The container is removed

### Security Measures
- Resource limits (CPU, memory, execution time)
- Read-only filesystem
- Network isolation
- User namespace remapping
- Process limits

## 🚀 Deployment

### Local Development
```bash
flask run --host=0.0.0.0 --port=5000
```

### Using Docker
```bash
docker build -t gencode-ai-backend .
docker run -p 5000:5000 gencode-ai-backend
```

### Using Docker Compose
```bash
docker-compose up --build
```

### Production Deployment
For production deployment, consider using:
- Gunicorn or uWSGI as WSGI server
- Nginx as reverse proxy
- Supervisor or systemd for process management
- Container orchestration (Kubernetes, Docker Swarm) for scaling

## 🧪 Testing

### Running Tests
```bash
pytest tests/
```

### Test Coverage
```bash
pytest --cov=src tests/
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

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
