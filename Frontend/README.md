<div align="center">
  <h1>🚀 GenCode AI - Frontend</h1>
  <p>An interactive coding platform for mastering Data Structures and Algorithms</p>
  
  <div>
    <img src="https://img.shields.io/badge/Next.js-14.2.3-black?style=for-the-badge&logo=next.js" alt="Next.js">
    <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/Monaco_Editor-0078D7?style=for-the-badge" alt="Monaco Editor">
  </div>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
</div>

## 📋 Table of Contents
- [🌟 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [🚀 Quick Start](#-quick-start)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [🏗 Project Structure](#-project-structure)
- [🛠 Development](#-development)
  - [Available Scripts](#-available-scripts)
  - [Environment Variables](#-environment-variables)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🌟 Project Overview

GenCode AI Frontend is a modern, interactive coding platform designed to help developers master Data Structures and Algorithms through hands-on practice. Built with Next.js 14 and React 18, it provides a seamless coding experience with real-time feedback and AI-powered assistance.

<div align="center">
  <img src="/public/images/app-screenshot.png" alt="App Screenshot" width="800" />
  <p><em>Interactive coding environment with real-time feedback</em></p>
</div>

## ✨ Features

### 🎯 Core Features
- **Interactive Code Editor** with syntax highlighting and IntelliSense
- **Real-time Code Execution** with immediate feedback
- **Multiple Language Support** (JavaScript, TypeScript, Python, Java, C++)
- **AI-Powered Hints & Solutions** for guided learning
- **Custom Test Cases** to validate your solutions

### 🎨 User Experience
- **Dark/Light Mode** with system preference detection
- **Responsive Design** that works on all devices
- **Split View Layout** for efficient coding
- **Keyboard Shortcuts** for faster navigation

### 📊 Progress Tracking
- **User Authentication** with Firebase
- **Submission History** with detailed analytics
- **Performance Metrics** for each solution
- **Achievements & Badges** to stay motivated

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **UI Library**: [React 18](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)

### Backend Integration
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **API Client**: [Axios](https://axios-http.com/)
- **Real-time Updates**: [Firebase Realtime Database](https://firebase.google.com/products/realtime-database)

### Development Tools
- **Package Manager**: npm
- **Linting**: [ESLint](https://eslint.org/)
- **Formatting**: [Prettier](https://prettier.io/)
- **Testing**: [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/)

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher
- Firebase project with Authentication enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/GenCode-AI-Frontend.git
   cd GenCode-AI-Frontend/Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

### Configuration

1. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:5000
   
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗 Project Structure

```
Frontend/
├── app/                    # App Router pages
│   ├── api/                # API routes
│   ├── (auth)/             # Authentication pages (login, register, etc.)
│   ├── (dashboard)/        # Authenticated user dashboard
│   ├── problems/           # Problem solving interface
│   └── layout.tsx          # Root layout component
│
├── components/            # Reusable UI components
│   ├── ui/                 # Base UI components (buttons, inputs, etc.)
│   ├── editor/            # Code editor components
│   ├── layout/             # Layout components (header, footer, etc.)
│   └── problems/          # Problem-specific components
│
├── contexts/              # React context providers
│   ├── AuthContext.tsx     # Authentication state
│   └── ThemeContext.tsx    # Theme management
│
├── lib/                   # Utility functions and helpers
│   ├── api/               # API client and services
│   ├── constants/         # App constants
│   └── utils/             # Helper functions
│
├── public/               # Static assets
│   ├── images/            # Image assets
│   └── icons/             # SVG icons
│
├── styles/               # Global styles
│   ├── globals.css        # Global CSS
│   └── theme.css          # Theme variables
│
└── types/                # TypeScript type definitions
    └── index.ts           # Shared type definitions
```

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | ✅ |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase configuration | ✅ |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics ID | ❌ |

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deployment Options

#### Vercel (Recommended)
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Deploy:
   ```bash
   vercel
   ```

#### Docker
1. Build the Docker image:
   ```bash
   docker build -t gencode-ai-frontend .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 gencode-ai-frontend
   ```

#### Static Export
```bash
npm run build
npm run export
# Outputs to the 'out' directory
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

### Development Guidelines
- Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification
- Write tests for new features
- Update documentation when necessary
- Keep the code style consistent

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

<div align="center">
  Made with ❤️ by the GenCode AI Team
</div>
   cd no_boring_dsa
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_API_BASE_URL=your_api_base_url
   NEXT_PUBLIC_COMPILER_ENDPOINT=your_compiler_endpoint
   NEXT_PUBLIC_SUBMIT_ENDPOINT=your_submit_endpoint
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🧩 Project Structure

```
/
├── app/                  # Next.js app directory
│   ├── components/       # React components
│   │   ├── editor/       # Code editor components
│   │   ├── problem/      # Problem-related components
│   │   │   ├── tabs/     # Tab components for different views
│   │   │   └── markdown/ # Markdown rendering components
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions and constants
│   ├── globals.css       # Global styles
│   ├── layout.js         # Root layout component
│   └── page.js           # Main application page
├── public/               # Static assets
├── .env                  # Environment variables
├── next.config.mjs       # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Project dependencies and scripts
```

## 💻 Usage

1. **Select a Problem**: Browse through available DSA problems
2. **Read the Description**: Understand the problem statement, constraints, and examples
3. **Write Your Solution**: Use the code editor to implement your solution
4. **Run Your Code**: Test your solution against example test cases
5. **Submit**: When you're confident, submit your solution for evaluation
6. **Review Results**: Check the performance metrics and correctness of your solution
7. **View Submission History**: Track your progress and improvements over time

## 🔄 Local Storage

The application uses localStorage to persist:
- Theme preference (dark/light mode)
- Submission history
- Code snippets

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) - The React Framework
- [TailwindCSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - The code editor that powers VS Code
- [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown component for React

