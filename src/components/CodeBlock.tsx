import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../context/ThemeContext';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'typescript',
  title,
  showLineNumbers = true,
}) => {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 overflow-hidden rounded-lg border bg-background">
      {title && (
        <div className="flex items-center justify-between border-b px-4 py-2 text-sm font-medium">
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground">{title}</span>
          </div>
          <button
            onClick={handleCopy}
            className="ml-auto flex h-7 items-center gap-1 rounded-md px-2 text-xs transition-colors hover:bg-muted"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={theme === 'dark' ? vscDarkPlus : vs}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          padding: '1rem',
          fontSize: '0.875rem',
          borderRadius: title ? '0 0 0.5rem 0.5rem' : '0.5rem',
          background: 'transparent',
        }}
      >
        {code}
      </SyntaxHighlighter>
      {!title && (
        <button
          onClick={handleCopy}
          className="absolute right-3 top-3 rounded-md bg-background/80 p-2 text-muted-foreground backdrop-blur transition-colors hover:bg-muted"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      )}
    </div>
  );
};

export default CodeBlock;