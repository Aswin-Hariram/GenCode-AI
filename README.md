# 🚀 GenCode AI - Full Stack Development Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-13.5.6-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
</div>

## 📋 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Frontend Documentation](#-frontend-documentation)
- [Backend Documentation](#-backend-documentation)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

GenCode AI is a full-stack development platform that provides an interactive coding environment with AI-powered assistance. The platform offers real-time code execution, problem-solving assistance, and learning resources for developers of all skill levels.

## ✨ Features

- **Interactive Code Editor** with syntax highlighting
- **AI-Powered Code Assistance**
- **Real-time Code Execution**
- **DSA Problem Generator**
- **User Authentication & Progress Tracking**
- **Responsive Design** for all devices

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 13 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Code Editor**: Monaco Editor

### Backend
- **Framework**: Python (Flask)
- **Authentication**: Firebase Authentication
- **Database**: Firebase Realtime Database
- **API**: RESTful API
- **Code Execution**: Docker-based sandbox

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (for Frontend)
- Python 3.9+ (for Backend)
- Docker & Docker Compose
- Firebase Project with Authentication and Realtime Database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/GenCode-AI-Frontend.git
   cd GenCode-AI-Frontend
   ```

2. **Set up Frontend**
   ```bash
   cd Frontend
   npm install
   ```

3. **Set up Backend**
   ```bash
   cd ../Backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

### Environment Variables

#### Frontend (`.env.local` in Frontend directory)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### Backend (`.env` in Backend directory)
```env
FLASK_APP=app.py
FLASK_ENV=development
FIREBASE_CREDENTIALS=serviceAccountKey.json
OPENAI_API_KEY=your_openai_api_key
```

## 🖥 Frontend Documentation

The frontend is built with Next.js 13 using the App Router for better performance and developer experience.

### Key Features
- **File-based Routing** with Next.js App Router
- **Server Components** for better performance
- **Code Splitting** for optimized loading
- **Responsive Design** with Tailwind CSS

### Project Structure
```
Frontend/
├── app/                  # App Router pages
├── components/           # Reusable components
├── contexts/             # React contexts
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── public/              # Static assets
├── styles/              # Global styles
└── types/               # TypeScript type definitions
```

### Running the Frontend

```bash
cd Frontend
npm run dev
```

## 🔧 Backend Documentation

The backend is built with Python Flask and provides a RESTful API for the frontend.

### Key Features
- **RESTful API** endpoints
- **Firebase Integration** for authentication and database
- **Docker-based** code execution environment
- **Logging** for debugging and monitoring

### Project Structure
```
Backend/
├── app.py               # Main Flask application
├── codeCompiler.py      # Code execution logic
├── firebase_service.py  # Firebase integration
├── question_generator.py # Problem generation logic
├── submitCode.py        # Code submission handler
├── topic_manager.py     # DSA topic management
└── templates/           # Email templates
```

### Running the Backend

```bash
cd Backend
python app.py
```

## 🚀 Deployment

The application can be deployed using Docker Compose:

```bash
docker-compose up --build
```

Or deploy to a cloud provider of your choice (e.g., Vercel for Frontend, Google Cloud Run for Backend).

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Code Execution
- `POST /api/execute` - Execute code
- `POST /api/submit` - Submit code for evaluation

### Problems
- `GET /api/problems` - Get list of problems
- `GET /api/problems/:id` - Get problem details
- `POST /api/problems` - Create new problem (admin only)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ✨ Contributors

- [Your Name](https://github.com/yourusername)

---

<div align="center">
  Made with ❤️ by the GenCode AI Team
</div>
