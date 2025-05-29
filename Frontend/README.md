# 🚀 GenCode AI - Frontend

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-13.5.6-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Monaco_Editor-0078D7?style=for-the-badge" alt="Monaco Editor">
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
- [Available Scripts](#-available-scripts)
- [Development](#-development)
- [Build & Deployment](#-build--deployment)
- [Contributing](#-contributing)

## 🌟 Project Overview

The GenCode AI Frontend is a modern, responsive web application built with Next.js 13 and React 18. It provides an interactive coding environment with real-time code execution, AI-powered assistance, and a seamless user experience for developers practicing data structures and algorithms.

## ✨ Features

- **Interactive Code Editor** with syntax highlighting and IntelliSense
- **Real-time Code Execution** with immediate feedback
- **AI-Powered Hints & Solutions**
- **Dark/Light Mode** with system preference detection
- **Responsive Design** for all device sizes
- **User Authentication** with Firebase
- **Progress Tracking** for DSA problems
- **Custom Test Cases** for problem-solving

## 🛠 Tech Stack

- **Framework**: Next.js 13 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Code Editor**: Monaco Editor
- **Authentication**: Firebase Authentication
- **API Client**: Axios
- **Build Tool**: Vite (optional)
- **Testing**: Jest, React Testing Library

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm 9.0.0 or later
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

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

## 🏗 Project Structure

```
Frontend/
├── app/                    # App Router pages
│   ├── api/                # API routes
│   ├── (auth)/             # Authentication pages
│   ├── (dashboard)/        # Authenticated routes
│   └── layout.tsx          # Root layout
├── components/             # Reusable components
│   ├── ui/                 # UI components
│   ├── layout/             # Layout components
│   └── editor/             # Code editor components
├── contexts/               # React contexts
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── public/                 # Static assets
├── styles/                 # Global styles
└── types/                  # TypeScript type definitions
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 💻 Development

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🚀 Build & Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Deploy:
   ```bash
   vercel
   ```

Or connect your GitHub repository to Vercel for continuous deployment.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 📝 Overview

DSA Practice Helper is a modern web application designed to make practicing Data Structures and Algorithms more engaging and productive. It provides an interactive coding environment with real-time feedback, problem descriptions, and performance tracking.

<div align="center">

### 💡 _No more boring DSA practice sessions!_ 💡

</div>

## ✨ Features

- **Interactive Code Editor** - Write and test your code in multiple languages
- **Problem Descriptions** - Clear problem statements with examples and constraints
- **Real-time Code Execution** - Run your code against test cases instantly
- **Syntax Highlighting** - Support for multiple programming languages
- **Dark/Light Mode** - Choose your preferred theme for comfortable coding
- **Submission History** - Track your progress with detailed submission records
- **Performance Metrics** - Monitor runtime and memory usage of your solutions
- **Split View Layout** - Customize your workspace with resizable panels
- **Markdown Support** - Rich text formatting with math expressions using KaTeX

## 🛠️ Technologies

- **Frontend**: React 19, Next.js 15
- **UI**: TailwindCSS, NextUI, Framer Motion
- **Code Editor**: Monaco Editor
- **Markdown**: React Markdown, Rehype, Remark
- **Icons**: Lucide React, React Icons

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/no_boring_dsa.git
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

