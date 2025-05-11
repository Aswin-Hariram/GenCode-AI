# 🚀 DSA Practice Helper

<div align="center">

![DSA Practice Helper](https://img.shields.io/badge/DSA-Practice_Helper-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

</div>

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

