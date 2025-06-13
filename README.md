# NotepadAI 🤖📝

An intelligent notepad application with AI-powered autocorrect and next-word suggestions using Ollama integration.

## ✨ Features

### 🔧 Core Features
- **Modern Note-taking Interface**: Clean, responsive design with real-time editing
- **Note Management**: Create, edit, save, and organize your notes
- **Mobile-Friendly**: Responsive design that works on all devices

### 🤖 AI-Powered Features
- **Real-time Autocorrect**: Automatically detects and suggests corrections for misspelled words while typing
- **Next Word Prediction**: Press spacebar to get intelligent next word suggestions based on context
- **Ollama Integration**: Uses local Ollama API with gemma2:2b model for privacy-focused AI assistance
- **Instant Feedback**: Immediate visual feedback with loading states and suggestions

### 🎨 Technical Features
- **Modern Tech Stack**: React + TypeScript + Vite for fast development
- **Beautiful UI**: Tailwind CSS with shadcn/ui components
- **Optimized Performance**: Debounced API calls and efficient state management
- **Debug Panel**: Built-in debugging tools for testing AI features

## 🚀 Getting Started

### Prerequisites
- Node.js & npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Ollama installed and running locally ([Download Ollama](https://ollama.ai/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/euii-ii/NotepadAI.git
cd NotepadAI
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Ollama**
```bash
# Install and start Ollama
ollama pull gemma2:2b
ollama serve
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🤖 AI Setup

### Ollama Configuration
1. **Install Ollama**: Download from [ollama.ai](https://ollama.ai/)
2. **Pull the model**: `ollama pull gemma2:2b`
3. **Start Ollama**: `ollama serve` (runs on localhost:11434)
4. **Verify**: The app will test connectivity on startup

### Supported Models
- **gemma2:2b** (recommended): Fast, lightweight model for autocorrect and suggestions
- Other Ollama models can be configured in `src/components/NoteEditor.tsx`

## 🎯 How to Use

### Basic Note-taking
1. Click "Create New Note" to start
2. Add a title and start typing your content
3. Notes are saved automatically

### AI Features
1. **Autocorrect**: Type words with intentional misspellings (e.g., "helo", "teh")
   - Suggestions appear automatically while typing
   - Click the red "Fix: word" button to apply corrections

2. **Next Word Suggestions**: Type some text and press spacebar
   - Blue "Next: word" button appears with suggestions
   - Click to add the suggested word

3. **Debug Panel**: Use the yellow debug panel to:
   - Monitor AI feature states
   - Test specific words manually
   - View API response logs

## 🛠️ Technologies Used

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **AI Integration**: Ollama API (gemma2:2b)
- **State Management**: React Hooks
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── NoteEditor.tsx   # AI-powered note editor
│   ├── NotesList.tsx    # Notes list view
│   └── WelcomeScreen.tsx
├── types/
│   └── Note.ts          # TypeScript types
├── pages/
│   └── Index.tsx        # Main page
└── lib/
    └── utils.ts         # Utility functions
```

## 🔧 Configuration

### API Timeouts
Adjust timeout settings in `src/components/NoteEditor.tsx`:
```typescript
const USE_TIMEOUTS = true;
const AUTOCORRECT_TIMEOUT = 8000; // 8 seconds
const SUGGESTION_TIMEOUT = 10000; // 10 seconds
```

### Model Configuration
Change the AI model in the API calls:
```typescript
model: "gemma2:2b" // Change to your preferred model
```

## 🐛 Troubleshooting

### Common Issues

1. **"Connection Refused" Error**
   - Ensure Ollama is running: `ollama serve`
   - Check if port 11434 is available
   - Verify model is installed: `ollama list`

2. **Autocorrect Not Working**
   - Type words with 3+ letters
   - Check browser console for API logs
   - Use debug panel test buttons

3. **Spacebar Suggestions Not Appearing**
   - Ensure you have text before pressing spacebar
   - Check console logs for debugging info
   - Try the manual test button

### Debug Mode
Enable detailed logging by checking the browser console (F12) for:
- API request/response logs
- State change notifications
- Error messages and timeouts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -m "Add feature"`
5. Push: `git push origin feature-name`
6. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai/) for local AI model hosting
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for icons

---

**Built with ❤️ using modern web technologies and AI**
