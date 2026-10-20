import type { MouseEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import './MarkdownContent.css';

interface MarkdownContentProps {
  source: string;
  className?: string;
  onToggleTask?: (taskIndex: number) => void;
}

const noop = () => {};

export function MarkdownContent({ source, className, onToggleTask }: MarkdownContentProps) {
  const interactive = Boolean(onToggleTask);

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!onToggleTask || !(target instanceof HTMLInputElement) || target.type !== 'checkbox') return;

    const checkboxes = Array.from(event.currentTarget.querySelectorAll('input[type="checkbox"]'));
    const index = checkboxes.indexOf(target);
    if (index >= 0) onToggleTask(index);
  }

  return (
    <div
      className={['md', interactive ? 'md--interactive' : '', className].filter(Boolean).join(' ')}
      onClick={handleClick}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
          input: ({ node: _node, ...props }) =>
            props.type === 'checkbox' ? (
              <input {...props} disabled={!interactive} onChange={noop} />
            ) : (
              <input {...props} />
            ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
