import { useState, useRef, useEffect } from 'react';

const NoteEditor = ({ value, onChange, placeholder = "Start writing..." }) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.max(textareaRef.current.scrollHeight, 200) + 'px';
    }
    
    // Update counts
    const words = value.trim().split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(value.trim() ? words : 0);
    setCharCount(value.length);
  }, [value]);

  const handleFormat = (format) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let formattedText = '';
    let newCursorPos = start;

    switch (format) {
      case 'bold':
        formattedText = selectedText ? `**${selectedText}**` : '**bold text**';
        newCursorPos = selectedText ? end + 4 : start + 2;
        break;
      case 'italic':
        formattedText = selectedText ? `*${selectedText}*` : '*italic text*';
        newCursorPos = selectedText ? end + 2 : start + 1;
        break;
      case 'underline':
        formattedText = selectedText ? `<u>${selectedText}</u>` : '<u>underlined text</u>';
        newCursorPos = selectedText ? end + 7 : start + 3;
        break;
      case 'strikethrough':
        formattedText = selectedText ? `~~${selectedText}~~` : '~~strikethrough text~~';
        newCursorPos = selectedText ? end + 4 : start + 2;
        break;
      case 'heading1':
        formattedText = `# ${selectedText || 'Heading 1'}`;
        newCursorPos = selectedText ? end + 2 : start + 2;
        break;
      case 'heading2':
        formattedText = `## ${selectedText || 'Heading 2'}`;
        newCursorPos = selectedText ? end + 3 : start + 3;
        break;
      case 'heading3':
        formattedText = `### ${selectedText || 'Heading 3'}`;
        newCursorPos = selectedText ? end + 4 : start + 4;
        break;
      case 'bulletList':
        formattedText = `- ${selectedText || 'List item'}`;
        newCursorPos = selectedText ? end + 2 : start + 2;
        break;
      case 'numberedList':
        formattedText = `1. ${selectedText || 'List item'}`;
        newCursorPos = selectedText ? end + 3 : start + 3;
        break;
      case 'quote':
        formattedText = `> ${selectedText || 'Quote text'}`;
        newCursorPos = selectedText ? end + 2 : start + 2;
        break;
      case 'code':
        formattedText = selectedText ? `\`${selectedText}\`` : '`code`';
        newCursorPos = selectedText ? end + 2 : start + 1;
        break;
      case 'codeBlock':
        formattedText = selectedText ? `\`\`\`\n${selectedText}\n\`\`\`` : '```\ncode block\n```';
        newCursorPos = selectedText ? end + 8 : start + 4;
        break;
      case 'link':
        const linkText = selectedText || 'link text';
        formattedText = `[${linkText}](https://example.com)`;
        newCursorPos = start + linkText.length + 3;
        break;
      case 'table':
        formattedText = `| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |`;
        newCursorPos = start + formattedText.length;
        break;
      case 'hr':
        formattedText = '\n---\n';
        newCursorPos = start + formattedText.length;
        break;
      default:
        return;
    }

    const newValue = value.substring(0, start) + formattedText + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleKeyDown = (e) => {
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
          handleFormat('bold');
          break;
        case 'i':
          e.preventDefault();
          handleFormat('italic');
          break;
        case 'u':
          e.preventDefault();
          handleFormat('underline');
          break;
        case 'k':
          e.preventDefault();
          handleFormat('link');
          break;
      }
    }
  };

  const renderMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-2">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-2">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-2">$1</h3>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline" target="_blank">$1</a>')
      .replace(/\n/g, '<br>');
  };

  const insertTemplate = (template) => {
    const templates = {
      meeting: `# Meeting Notes - ${new Date().toLocaleDateString()}\n\n## Attendees\n- \n\n## Agenda\n1. \n\n## Discussion\n\n\n## Action Items\n- [ ] \n\n## Next Steps\n`,
      todo: `# Todo List - ${new Date().toLocaleDateString()}\n\n## High Priority\n- [ ] \n\n## Medium Priority\n- [ ] \n\n## Low Priority\n- [ ] \n\n## Completed\n- [x] `,
      study: `# Study Notes - ${new Date().toLocaleDateString()}\n\n## Subject\n\n\n## Key Concepts\n- \n\n## Important Points\n> \n\n## Questions\n1. \n\n## Summary\n`,
      project: `# Project Notes\n\n## Overview\n\n\n## Goals\n- \n\n## Requirements\n- \n\n## Timeline\n\n\n## Resources\n- \n\n## Notes\n`
    };
    
    onChange(templates[template] || '');
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
      {/* Enhanced Toolbar */}
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-1">
          {/* Text Formatting */}
          <div className="flex items-center space-x-1 pr-2 border-r border-gray-300">
            <button
              type="button"
              onClick={() => handleFormat('bold')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              title="Bold (Ctrl+B)"
            >
              <strong className="text-sm">B</strong>
            </button>
            <button
              type="button"
              onClick={() => handleFormat('italic')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded italic transition-colors"
              title="Italic (Ctrl+I)"
            >
              <span className="text-sm">I</span>
            </button>
            <button
              type="button"
              onClick={() => handleFormat('underline')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded underline transition-colors"
              title="Underline (Ctrl+U)"
            >
              <span className="text-sm">U</span>
            </button>
            <button
              type="button"
              onClick={() => handleFormat('strikethrough')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded line-through transition-colors"
              title="Strikethrough"
            >
              <span className="text-sm">S</span>
            </button>
          </div>

          {/* Headings */}
          <div className="flex items-center space-x-1 pr-2 border-r border-gray-300">
            <button
              type="button"
              onClick={() => handleFormat('heading1')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              title="Heading 1"
            >
              <span className="text-sm font-bold">H1</span>
            </button>
            <button
              type="button"
              onClick={() => handleFormat('heading2')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              title="Heading 2"
            >
              <span className="text-sm font-bold">H2</span>
            </button>
            <button
              type="button"
              onClick={() => handleFormat('heading3')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              title="Heading 3"
            >
              <span className="text-sm font-bold">H3</span>
            </button>
          </div>

          {/* Lists and Formatting */}
          <div className="flex items-center space-x-1 pr-2 border-r border-gray-300">
            <button
              type="button"
              onClick={() => handleFormat('bulletList')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              title="Bullet List"
            >
              <span className="text-sm">•</span>
            </button>
            <button
              type="button"
              onClick={() => handleFormat('numberedList')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              title="Numbered List"
            >
              <span className="text-sm">1.</span>
            </button>
            <button
              type="button"
              onClick={() => handleFormat('quote')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              title="Quote"
            >
              <span className="text-sm">"</span>
            </button>
          </div>

          {/* Code and Links */}
          <div className="flex items-center space-x-1 pr-2 border-r border-gray-300">
            <button
              type="button"
              onClick={() => handleFormat('code')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors font-mono"
              title="Inline Code"
            >
              <span className="text-sm">&lt;/&gt;</span>
            </button>
            <button
              type="button"
              onClick={() => handleFormat('codeBlock')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors font-mono"
              title="Code Block"
            >
              <span className="text-sm">{ }</span>
            </button>
            <button
              type="button"
              onClick={() => handleFormat('link')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              title="Link (Ctrl+K)"
            >
              <span className="text-sm">🔗</span>
            </button>
          </div>

          {/* Templates */}
          <div className="relative">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  insertTemplate(e.target.value);
                  e.target.value = '';
                }
              }}
              className="text-sm bg-white border border-gray-300 rounded px-2 py-1 text-gray-600 hover:bg-gray-50"
            >
              <option value="">Templates</option>
              <option value="meeting">Meeting Notes</option>
              <option value="todo">Todo List</option>
              <option value="study">Study Notes</option>
              <option value="project">Project Notes</option>
            </select>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              isPreviewMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isPreviewMode ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Editor/Preview */}
      {isPreviewMode ? (
        <div 
          className="p-4 min-h-64 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full p-4 border-none resize-none focus:outline-none min-h-64 font-mono text-sm leading-relaxed"
          style={{ minHeight: '300px' }}
        />
      )}

      {/* Enhanced Footer */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>Supports Markdown formatting</span>
            <span>•</span>
            <span>Use Ctrl+B, Ctrl+I, Ctrl+U for quick formatting</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} characters</span>
            <span>•</span>
            <span>{Math.ceil(wordCount / 200)} min read</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;