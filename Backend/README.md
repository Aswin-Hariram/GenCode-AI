# DSA Bot Backend

This is the backend service for the DSA Bot application, providing APIs for code compilation, submission, and DSA (Data Structures and Algorithms) question generation.

## Features

- **Code Compilation**: Compile and run code in multiple programming languages
- **Code Submission**: Submit and evaluate code solutions
- **DSA Questions**: Generate random DSA questions based on topics
- **Topic Management**: Add, remove, and manage DSA topics
- **Firebase Integration**: Store and retrieve data using Firebase Firestore

## Prerequisites

- Python 3.9+
- Firebase project (for Firestore)
- Google Cloud account (for Google Generative AI)

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GenCode-AI-Frontend/Backend
   ```

2. **Create and activate a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up Firebase**
   - Follow the instructions in [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
   - Make sure you have a valid `serviceAccountKey.json` file

5. **Configure environment variables**
   Create a `.env` file in the Backend directory with the following variables:
   ```
   PORT=8000
   GOOGLE_APPLICATION_CREDENTIALS=serviceAccountKey.json
   TOPICS_FILE=dsa_topics.txt
   ```

## Running the Server

```bash
python app.py
```

The server will start on `http://localhost:8000` by default.

## API Endpoints

### `POST /submit`
Submit code for evaluation.

**Request Body:**
```json
{
  "actualSolution": "Your complete solution code",
  "description": "Problem description",
  "typedSolution": "Your solution code",
  "language": "python"
}
```

### `POST /compiler`
Compile and run code.

**Request Body:**
```json
{
  "code": "print('Hello, World!')",
  "language": "python"
}
```

### `GET /dsa-question`
Get a random DSA question.

**Response:**
```json
{
  "topic": "Binary Search",
  "question": "Find the first and last position of an element in a sorted array.",
  "difficulty": "Medium"
}
```

### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy"
}
```

## Project Structure

```
Backend/
├── app.py                 # Main Flask application
├── codeCompiler.py        # Code compilation logic
├── question_generator.py  # DSA question generation
├── submitCode.py          # Code submission and evaluation
├── topic_manager.py       # Topic management utilities
├── firebase_service.py    # Firebase integration
├── manage_topics.py       # CLI for topic management
├── config.py              # Configuration settings
├── requirements.txt       # Python dependencies
├── .env                  # Environment variables
├── serviceAccountKey.json # Firebase credentials
└── templates/            # HTML templates (if any)
```

## Development

### Running Tests
```bash
pytest
```

### Code Formatting
```bash
black .
```

### Linting
```bash
flake8
```

## Deployment

The application can be deployed using Gunicorn:

```bash
gunicorn --bind 0.0.0.0:$PORT app:app
```

Or using the provided Dockerfile:

```bash
docker build -t dsa-bot-backend .
docker run -p 8000:8000 dsa-bot-backend
```

## License

[Your License Here]

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request