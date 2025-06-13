
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic, Wand2, Lightbulb } from 'lucide-react';
import { Note } from '../types/Note';

interface NoteEditorProps {
  note: Note;
  onSave: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onBack: () => void;
}

const NoteEditor = ({ note, onSave, onDelete, onBack }: NoteEditorProps) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [autocorrectSuggestion, setAutocorrectSuggestion] = useState<string>('');
  const [nextWordSuggestion, setNextWordSuggestion] = useState<string>('');
  const [lastWord, setLastWord] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingNextWord, setIsLoadingNextWord] = useState(false);
  const [isLoadingAutocorrect, setIsLoadingAutocorrect] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const spacebarDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Configuration for API timeouts - can be disabled if causing issues
  const USE_TIMEOUTS = true;
  const AUTOCORRECT_TIMEOUT = 8000; // 8 seconds
  const SUGGESTION_TIMEOUT = 10000; // 10 seconds

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);

    // Test Ollama connectivity on component mount
    const testOllamaConnection = async () => {
      try {
        console.log('🔗 Testing Ollama connection...');
        const response = await fetch('http://localhost:11434/api/tags');
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Ollama is running, available models:', data);
        } else {
          console.error('❌ Ollama responded with error:', response.status);
        }
      } catch (error) {
        console.error('❌ Ollama connection failed:', error);
        console.log('💡 Make sure Ollama is running on localhost:11434');
      }
    };

    testOllamaConnection();
  }, [note]);

  // Cleanup debounce timeouts on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (spacebarDebounceRef.current) {
        clearTimeout(spacebarDebounceRef.current);
      }
    };
  }, []);

  // API function for autocorrect
  const callAutocorrectAPI = async (word: string) => {
    try {
      console.log('Calling autocorrect API for word:', word);

      // Create an AbortController for timeout
      const controller = new AbortController();
      let timeoutId: NodeJS.Timeout | null = null;

      if (USE_TIMEOUTS) {
        timeoutId = setTimeout(() => {
          console.log('⏰ Autocorrect API timeout triggered');
          controller.abort();
        }, AUTOCORRECT_TIMEOUT);
      }

      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gemma2:2b",
          messages: [
            {
              role: "user",
              content: `Spell check: "${word}". Return ONLY the corrected word, nothing else. Examples: "helo" -> "hello", "teh" -> "the", "recieve" -> "receive". Word:`
            }
          ],
          stream: false,
          temperature: 0,
          options: {
            num_predict: 3, // Very short response for autocorrect
            top_k: 5,
            top_p: 0.8
          }
        }),
        signal: USE_TIMEOUTS ? controller.signal : undefined
      });

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Autocorrect API response:', data);

      // Extract just the first word from the response, removing any extra text
      const rawResponse = data.message?.content?.trim() || word;
      const correctedWord = rawResponse.split(/\s+/)[0].replace(/[^\w]/g, '') || word;

      console.log('Raw response:', rawResponse);
      console.log('Extracted corrected word:', correctedWord);
      setAutocorrectSuggestion(correctedWord);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('⏰ Autocorrect API request was aborted (timeout)');
        setAutocorrectSuggestion(word); // Fallback to original word
      } else {
        console.error('Autocorrect API error:', error);
        setAutocorrectSuggestion(word);
      }
    }
  };

  // API function for next word suggestion
  const callSuggestionAPI = async (text: string) => {
    try {
      console.log('Calling suggestion API for text:', text);

      // Create an AbortController for timeout
      const controller = new AbortController();
      let timeoutId: NodeJS.Timeout | null = null;

      if (USE_TIMEOUTS) {
        timeoutId = setTimeout(() => {
          console.log('⏰ Suggestion API timeout triggered');
          controller.abort();
        }, SUGGESTION_TIMEOUT);
      }

      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gemma2:2b",
          messages: [
            {
              role: "user",
              content: `Next word after: "${text}". Return ONLY one word. Examples: "I am" -> "going", "Hello" -> "world". Word:`
            }
          ],
          stream: false,
          temperature: 0,
          options: {
            num_predict: 3, // Reduced for faster processing
            top_k: 5,
            top_p: 0.8
          }
        }),
        signal: USE_TIMEOUTS ? controller.signal : undefined
      });

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Suggestion API response:', data);

      // Extract just the first word from the response, removing markdown and special characters
      const rawResponse = data.message?.content?.trim() || '';
      // Remove markdown formatting like **word** and extract just the word
      const cleanedResponse = rawResponse.replace(/\*\*/g, '').replace(/[^\w\s]/g, '');
      const suggestedWord = cleanedResponse.split(/\s+/)[0] || '';

      console.log('Raw suggestion response:', rawResponse);
      console.log('Cleaned response:', cleanedResponse);
      console.log('Extracted suggested word:', suggestedWord);
      setNextWordSuggestion(suggestedWord);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('⏰ Suggestion API request was aborted (timeout)');
        setNextWordSuggestion('');
      } else {
        console.error('Suggestion API error:', error);
        setNextWordSuggestion('');
      }
    }
  };

  // Real-time word analysis as user types with debouncing
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    console.log('🔍 Real-time typing:', { newContent: `"${newContent}"` });

    // Clear previous debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Get current cursor position
    const cursorPosition = e.target.selectionStart;

    // Get text up to cursor position
    const textBeforeCursor = newContent.substring(0, cursorPosition);

    // Split into words and get the current word being typed
    const words = textBeforeCursor.split(/\s+/);
    const currentWord = words[words.length - 1];

    console.log('📝 Current word:', {
      currentWord,
      length: currentWord?.length || 0,
      textBeforeCursor: `"${textBeforeCursor}"`,
      cursorPosition
    });

    // Immediate feedback for short words
    if (!currentWord || currentWord.length < 3) {
      setShowSuggestions(false);
      setAutocorrectSuggestion('');
      setNextWordSuggestion('');
      setLastWord('');
      return;
    }

    // Set current word immediately for UI feedback
    setLastWord(currentWord);

    // Show immediate feedback for autocorrect
    console.log('🔄 Setting up autocorrect for word:', currentWord);
    setShowSuggestions(true);
    setIsLoadingAutocorrect(true);
    setAutocorrectSuggestion(''); // Clear previous suggestion immediately

    // Debounce API calls to avoid too many requests while typing
    debounceTimeoutRef.current = setTimeout(async () => {
      if (currentWord && currentWord.length >= 3) {
        console.log('🔄 Analyzing word after debounce:', currentWord);

        try {
          // Focus on autocorrect while typing
          await callAutocorrectAPI(currentWord);

          console.log('✅ Real-time autocorrect completed for:', currentWord);
        } catch (error) {
          console.error('❌ Real-time analysis failed:', error);
        } finally {
          setIsLoadingAutocorrect(false);
        }
      }
    }, 500); // 500ms debounce delay
  };

  // Handle keydown events - Trigger next word suggestions on spacebar
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    console.log('🔍 Key pressed:', e.key, 'Code:', e.code);
    if (e.key === ' ') {
      console.log('🚀 Spacebar pressed - triggering next word suggestions');

      // Clear any existing spacebar debounce
      if (spacebarDebounceRef.current) {
        clearTimeout(spacebarDebounceRef.current);
      }

      // Get current content and cursor position
      const textarea = e.currentTarget;
      const cursorPosition = textarea.selectionStart;
      const currentContent = content;

      // Get text up to cursor position (this will be the text before the space)
      const textBeforeCursor = currentContent.substring(0, cursorPosition);

      console.log('📝 Spacebar analysis:', {
        textBeforeCursor: `"${textBeforeCursor}"`,
        cursorPosition,
        contentLength: currentContent.length
      });

      // Only trigger if we have some text to work with
      if (textBeforeCursor.trim().length > 0) {
        console.log('✅ Text found, setting up next word suggestion');
        // Show immediate feedback - suggestions panel with loading state
        setShowSuggestions(true);
        setIsLoadingNextWord(true);
        setNextWordSuggestion(''); // Clear previous suggestion immediately

        console.log('🔄 Showing immediate feedback, will call API in 100ms');
        console.log('🔄 Current state - showSuggestions:', true, 'isLoadingNextWord:', true);

        // Short debounce to prevent multiple rapid spacebar presses
        spacebarDebounceRef.current = setTimeout(async () => {
          try {
            console.log('🔄 Calling next word suggestion API after spacebar');
            // Call suggestion API for the text before cursor
            await callSuggestionAPI(textBeforeCursor.trim());
            console.log('✅ Spacebar suggestion API completed');
          } catch (error) {
            console.error('❌ Spacebar suggestion API failed:', error);
          } finally {
            setIsLoadingNextWord(false);
          }
        }, 100); // Very short delay - just enough to debounce rapid presses
      }
    }
  };

  // Apply autocorrect suggestion
  const applyAutocorrect = () => {
    if (autocorrectSuggestion && lastWord) {
      const words = content.trim().split(/\s+/);
      words[words.length - 1] = autocorrectSuggestion;
      const newContent = words.join(' ') + ' ';
      setContent(newContent);
      setShowSuggestions(false);

      // Focus back to textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newContent.length, newContent.length);
      }
    }
  };

  // Apply next word suggestion
  const applyNextWordSuggestion = () => {
    if (nextWordSuggestion) {
      // Check if content already ends with space, if not add one before the suggestion
      let newContent = content;
      if (!content.endsWith(' ')) {
        newContent += ' ';
      }
      newContent += nextWordSuggestion + ' ';

      setContent(newContent);
      setShowSuggestions(false);

      // Focus back to textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newContent.length, newContent.length);
      }
    }
  };

  const handleSave = () => {
    const updatedNote: Note = {
      ...note,
      title: title || 'Untitled',
      content,
      date: new Date().toISOString(),
    };
    onSave(updatedNote);
  };

  const formatDate = () => {
    const today = new Date();
    return `TODAY - ${today.toLocaleDateString('en-GB', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })}`;
  };

  return (
    <div>
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 mb-4 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-coral hover:bg-coral/10 px-2"
            >
              ← SAVE
            </Button>
            <div className="w-8 h-8 bg-note rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Title */}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold border-0 bg-transparent p-0 mb-5 focus:ring-0 text-note placeholder:text-note-light"
            placeholder="New Note"
          />

          {/* Content */}
          <div className="pb-20">
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              className="min-h-[400px] border-0 bg-transparent p-0 resize-none focus:ring-0 text-note placeholder:text-note-light leading-relaxed"
              placeholder="Type something here ..."
            />

            {/* Debug Info - Remove this in production */}
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-xs">
              <div className="font-bold mb-2 text-yellow-800">🔍 Debug Panel</div>
              <div className="grid grid-cols-2 gap-1">
                <div>Show Suggestions:</div>
                <div className={showSuggestions ? 'text-green-600 font-bold' : 'text-red-600'}>{showSuggestions.toString()}</div>
                <div>Last Word:</div>
                <div className="font-mono">"{lastWord}"</div>
                <div>Autocorrect:</div>
                <div className="font-mono text-blue-600">"{autocorrectSuggestion}"</div>
                <div>Next Word:</div>
                <div className="font-mono text-purple-600">"{nextWordSuggestion}"</div>
                <div>Loading Next Word:</div>
                <div className={isLoadingNextWord ? 'text-orange-600 font-bold' : 'text-gray-600'}>{isLoadingNextWord.toString()}</div>
                <div>Loading Autocorrect:</div>
                <div className={isLoadingAutocorrect ? 'text-orange-600 font-bold' : 'text-gray-600'}>{isLoadingAutocorrect.toString()}</div>
              </div>

              <div className="mt-2 text-xs text-gray-600">
                💡 Type a word like "helo" or "teh" (3+ letters) - autocorrect appears automatically!
              </div>

              <div className="mt-1 text-xs text-blue-600">
                🚀 Press SPACEBAR after typing "I am going" to get INSTANT next word suggestions!
              </div>

              <div className="mt-1 text-xs text-orange-600">
                🔍 Debug: Type text, then press spacebar. Check console for logs.
              </div>

              <div className="mt-1 text-xs text-green-700">
                ✨ Faster suggestions with immediate feedback + optimized API calls!
              </div>

              <div className="mt-1 text-xs text-gray-600">
                ⚙️ Timeouts: {USE_TIMEOUTS ? `Enabled (${AUTOCORRECT_TIMEOUT/1000}s/${SUGGESTION_TIMEOUT/1000}s)` : 'Disabled'}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    const words = content.trim().split(/\s+/);
                    const lastWord = words[words.length - 1];
                    if (lastWord) {
                      console.log('🧪 Manual test triggered for word:', lastWord);
                      setLastWord(lastWord);
                      setShowSuggestions(true);
                      setIsLoadingAutocorrect(true);
                      setIsLoadingNextWord(true);
                      try {
                        await Promise.all([
                          callAutocorrectAPI(lastWord),
                          callSuggestionAPI(content.trim())
                        ]);
                      } finally {
                        setIsLoadingAutocorrect(false);
                        setIsLoadingNextWord(false);
                      }
                    }
                  }}
                  className="mt-2 text-xs bg-blue-500 hover:bg-blue-600"
                  size="sm"
                >
                  🧪 Test Current
                </Button>

                <Button
                  onClick={async () => {
                    console.log('🧪 Testing misspelled word: "helo"');
                    setLastWord('helo');
                    setShowSuggestions(true);
                    setIsLoadingAutocorrect(true);
                    try {
                      await callAutocorrectAPI('helo');
                    } finally {
                      setIsLoadingAutocorrect(false);
                    }
                  }}
                  className="mt-2 text-xs bg-red-500 hover:bg-red-600"
                  size="sm"
                >
                  🧪 Test "helo"
                </Button>

                <Button
                  onClick={async () => {
                    console.log('🧪 Testing next word suggestion: "I am going"');
                    setShowSuggestions(true);
                    setIsLoadingNextWord(true);
                    try {
                      await callSuggestionAPI('I am going');
                    } finally {
                      setIsLoadingNextWord(false);
                    }
                  }}
                  className="mt-2 text-xs bg-green-500 hover:bg-green-600"
                  size="sm"
                >
                  🧪 Test "I am going"
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Formatting Tools */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto">
          {/* Suggestion Buttons Row - Show when suggestions are available or loading */}
          {showSuggestions && (autocorrectSuggestion || nextWordSuggestion || isLoadingNextWord || isLoadingAutocorrect) && (
            <div className="flex gap-2 mb-3">
              {(autocorrectSuggestion || isLoadingAutocorrect) && lastWord && (
                <Button
                  onClick={applyAutocorrect}
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-1 ${
                    autocorrectSuggestion && autocorrectSuggestion !== lastWord
                      ? 'text-coral border-coral hover:bg-coral/10'
                      : 'text-green-600 border-green-600 hover:bg-green-50'
                  }`}
                  disabled={isLoadingAutocorrect || !autocorrectSuggestion}
                >
                  <Wand2 className="w-3 h-3" />
                  {isLoadingAutocorrect
                    ? 'Checking spelling...'
                    : autocorrectSuggestion && autocorrectSuggestion !== lastWord
                      ? `Fix: ${autocorrectSuggestion}`
                      : `✓ ${autocorrectSuggestion || lastWord}`
                  }
                </Button>
              )}
              {(nextWordSuggestion || isLoadingNextWord) && (
                <Button
                  onClick={applyNextWordSuggestion}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-blue-600 border-blue-600 hover:bg-blue-50"
                  disabled={isLoadingNextWord || !nextWordSuggestion}
                >
                  <Lightbulb className="w-3 h-3" />
                  {isLoadingNextWord ? 'Getting suggestions...' : `Next: ${nextWordSuggestion}`}
                </Button>
              )}
            </div>
          )}

          {/* Formatting Tools Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBold(!isBold)}
                className={`p-2 ${isBold ? 'bg-coral/20' : ''} text-note-light hover:bg-coral/10`}
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsItalic(!isItalic)}
                className={`p-2 ${isItalic ? 'bg-coral/20' : ''} text-note-light hover:bg-coral/10`}
              >
                <Italic className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-xs text-coral font-medium">
              {formatDate()}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSave}
              className="bg-coral-gradient hover:opacity-90 text-white rounded-full px-8 py-2 w-full"
            >
              Save Note
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
