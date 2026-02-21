import { useState, useRef, useEffect } from 'react';

const NoteEditor = ({ value, onChange, placeholder = "Type '/' for commands..." }) => {
  const [showCommands, setShowCommands] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef(null);
  const commandsRef = useRef(null);

  const commands = [
    { id: 'h1', label: 'Heading 1', icon: 'H1', format: '# ' },
    { id: 'h2', label: 'Heading 2', icon: 'H2', format: '## ' },
    { id: 'h3', label: 'Heading 3', icon: 'H3', format: '### ' },
    { id: 'bullet', label: 'Bullet List', icon: '•', format: '- ' },
    { id: 'number', label: 'Numbered List', icon: '1.', format: '1. ' },
    { id: 'todo', label: 'Todo List', icon: '☐', format: '- [ ] ' },
    { id: 'quote', label: 'Quote', icon: '"', format: '> ' },
    { id: 'code', label: 'Code Block', icon: '</>', format: '```\n\n```' },
    { id: 'divider', label: 'Divider', icon: '—', format: '\n---\n' },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(commandSearch.toLowerCase())
  );

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.max(textareaRef.current.scrollHeight, 400) + 'px';
    }
    
    const words = value.trim().split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(value.trim() ? words : 0);
    setCharCount(value.length);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    onChange(newValue);
    setCursorPosition(cursorPos);

    // Check for slash command
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastLine = textBeforeCursor.split('\n').pop();
    
    if (lastLine.startsWith('/')) {
      setShowCommands(true);
      setCommandSearch(lastLine.substring(1));
    } else {
      setShowCommands(false);
      setCommandSearch('');
    }
  };

  const insertCommand = (command) => {
    const textarea = textareaRef.current;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const textAfterCursor = value.substring(cursorPosition);
    
    // Remove the slash command
    const lines = textBeforeCursor.split('\n');
    lines[lines.length - 1] = lines[lines.length - 1].replace(/\/[^\s]*$/, '');
    const newTextBefore = lines.join('\n');
    
    // Insert the format
    let newValue;
    let newCursorPos;
    
    if (command.id === 'code') {
      newValue = newTextBefore + command.format + textAfterCursor;
      newCursorPos = newTextBefore.length + 4; // Position inside code block
    } else {
      newValue = newTextBefore + command.format + textAfterCursor;
      newCursorPos = newTextBefore.length + command.format.length;
    }
    
    onChange(newValue);
    setShowCommands(false);
    setCommandSearch('');
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleKeyDown = (e) => {
    // Handle command menu navigation
    if (showCommands) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowCommands(false);
        return;
      }
      if (e.key === 'Enter' && filteredCommands.length > 0) {
        e.preventDefault();
        insertCommand(filteredCommands[0]);
        return;
      }
    }

    // Tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        e.target.setSelectionRange(start + 2, start + 2);
      }, 0);
    }

    // Keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          wrapSelection('**', '**');
          break;
        case 'i':
          e.preventDefault();
          wrapSelection('*', '*');
          break;
        case 'k':
          e.preventDefault();
          wrapSelection('[', '](url)');
          break;
        case '`':
          e.preventDefault();
          wrapSelection('`', '`');
          break;
      }
    }
  };

  const wrapSelection = (before, after) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newValue);
    
    setTimeout(() => {
      textarea.focus();
      const newPos = selectedText ? end + before.length + after.length : start + before.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  return (
    <div className="relative">
      {/* Notion-like Editor */}
      <div className="bg-white rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full p-6 border-none resize-none focus:outline-none text-gray-900 leading-relaxed"
          style={{ 
            minHeight: '400px',
            fontSize: '16px',
            lineHeight: '1.75'
          }}
        />

        {/* Command Menu */}
        {showCommands && filteredCommands.length > 0 && (
          <div 
            ref={commandsRef}
            className="absolute left-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-64 overflow-hidden"
            style={{ top: 'auto' }}
          >
            <div className="py-2">
              {filteredCommands.map((command, index) => (
                <button
                  key={command.id}
                  type="button"
                  onClick={() => insertCommand(command)}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center space-x-3 ${
                    index === 0 ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-semibold text-gray-600">
                    {command.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{command.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Floating Toolbar - appears on text selection */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => wrapSelection('**', '**')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              title="Bold (Ctrl+B)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 12h12M6 6h12M6 18h12" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => wrapSelection('*', '*')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors italic"
              title="Italic (Ctrl+I)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => wrapSelection('`', '`')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors font-mono"
              title="Code (Ctrl+`)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => wrapSelection('[', '](url)')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              title="Link (Ctrl+K)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} characters</span>
          </div>
        </div>
      </div>

      {/* Helpful Tips */}
      <div className="mt-3 text-xs text-gray-500 flex items-center space-x-4">
        <span>💡 Type <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300 font-mono">/</kbd> for commands</span>
        <span>•</span>
        <span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300 font-mono">Ctrl+B</kbd> Bold</span>
        <span>•</span>
        <span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300 font-mono">Ctrl+I</kbd> Italic</span>
        <span>•</span>
        <span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300 font-mono">Ctrl+K</kbd> Link</span>
      </div>
    </div>
  );
};

export default NoteEditor;