import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { Markdown } from '@tiptap/markdown';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Check,
  ChevronDown,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Italic,
  Link as LinkIcon,
  List,
  ListChecks,
  ListOrdered,
  Quote,
  SquareCode,
  Strikethrough,
  Type,
  Unlink,
} from 'lucide-react';
import './MarkdownContent.css';
import './RichTextEditor.css';

interface RichTextEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
}

type OpenMenu = 'block' | 'list' | null;

const keepSelection = (event: MouseEvent) => event.preventDefault();

function normalizeHref(raw: string): string {
  const value = raw.trim();
  if (!value) return '';
  return /^(https?:|mailto:)/i.test(value) ? value : `https://${value}`;
}

interface MenuItemProps {
  icon: ReactNode;
  label: string;
  hint?: string;
  active?: boolean;
  onSelect: () => void;
}

function MenuItem({ icon, label, hint, active, onSelect }: MenuItemProps) {
  return (
    <button type="button" className="rte-item" onMouseDown={keepSelection} onClick={onSelect}>
      <span className="rte-item-icon">{icon}</span>
      <span className="rte-item-label">{label}</span>
      {hint && <span className="rte-item-hint">{hint}</span>}
      {active && <Check size={14} className="rte-item-check" />}
    </button>
  );
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [linkMode, setLinkMode] = useState(false);
  const [linkValue, setLinkValue] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ underline: false, link: { openOnClick: false } }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Markdown.configure({ markedOptions: { breaks: true } }),
      Placeholder.configure({ placeholder: placeholder ?? '' }),
    ],
    content: value,
    contentType: 'markdown',
    onUpdate: ({ editor: current }) => onChange(current.getMarkdown()),
    editorProps: { attributes: { class: 'md rte-content' } },
  });

  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => {
      if (!current) return null;
      return {
        bold: current.isActive('bold'),
        italic: current.isActive('italic'),
        strike: current.isActive('strike'),
        code: current.isActive('code'),
        link: current.isActive('link'),
        heading1: current.isActive('heading', { level: 1 }),
        heading2: current.isActive('heading', { level: 2 }),
        heading3: current.isActive('heading', { level: 3 }),
        heading4: current.isActive('heading', { level: 4 }),
        codeBlock: current.isActive('codeBlock'),
        blockquote: current.isActive('blockquote'),
        bulletList: current.isActive('bulletList'),
        orderedList: current.isActive('orderedList'),
        taskList: current.isActive('taskList'),
      };
    },
  });

  useEffect(() => {
    if (!editor) return;
    const reset = () => {
      setOpenMenu(null);
      setLinkMode(false);
    };
    editor.on('selectionUpdate', reset);
    return () => {
      editor.off('selectionUpdate', reset);
    };
  }, [editor]);

  if (!editor || !state) return null;

  const blockLabel = state.heading1
    ? 'Cabeçalho 1'
    : state.heading2
      ? 'Cabeçalho 2'
      : state.heading3
        ? 'Cabeçalho 3'
        : state.heading4
          ? 'Cabeçalho 4'
          : state.codeBlock
            ? 'Bloco de código'
            : state.blockquote
              ? 'Citação'
              : 'Texto';

  function run(command: () => void) {
    command();
    setOpenMenu(null);
  }

  function startLink() {
    if (state?.link) {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    setLinkValue('');
    setLinkMode(true);
  }

  function applyLink() {
    const href = normalizeHref(linkValue);
    if (href) {
      editor?.chain().focus().extendMarkRange('link').setLink({ href }).run();
    }
    setLinkMode(false);
  }

  const toggleButton = (active: boolean, label: string, icon: ReactNode, onClick: () => void) => (
    <button
      type="button"
      className={active ? 'rte-btn rte-btn--active' : 'rte-btn'}
      aria-label={label}
      title={label}
      onMouseDown={keepSelection}
      onClick={onClick}
    >
      {icon}
    </button>
  );

  return (
    <div className="rte">
      <BubbleMenu editor={editor} options={{ placement: 'top', offset: 8 }}>
        <div className="rte-bar">
          {linkMode ? (
            <form
              className="rte-link-form"
              onSubmit={(event) => {
                event.preventDefault();
                applyLink();
              }}
            >
              <LinkIcon size={15} />
              <input
                autoFocus
                value={linkValue}
                onChange={(event) => setLinkValue(event.target.value)}
                placeholder="Cole o endereço e tecle Enter"
              />
              <button type="submit" className="rte-btn" aria-label="Aplicar link">
                <Check size={15} />
              </button>
            </form>
          ) : (
            <>
              <div className="rte-dd">
                <button
                  type="button"
                  className="rte-dd-btn"
                  onMouseDown={keepSelection}
                  onClick={() => setOpenMenu(openMenu === 'block' ? null : 'block')}
                >
                  {blockLabel} <ChevronDown size={13} />
                </button>
                {openMenu === 'block' && (
                  <div className="rte-panel">
                    <p className="rte-panel-title">Transformar em</p>
                    <MenuItem
                      icon={<Type size={16} />}
                      label="Texto"
                      active={blockLabel === 'Texto'}
                      onSelect={() => run(() => editor.chain().focus().clearNodes().run())}
                    />
                    <MenuItem
                      icon={<Heading1 size={16} />}
                      label="Cabeçalho 1"
                      hint="Ctrl Alt 1"
                      active={state.heading1}
                      onSelect={() => run(() => editor.chain().focus().toggleHeading({ level: 1 }).run())}
                    />
                    <MenuItem
                      icon={<Heading2 size={16} />}
                      label="Cabeçalho 2"
                      hint="Ctrl Alt 2"
                      active={state.heading2}
                      onSelect={() => run(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}
                    />
                    <MenuItem
                      icon={<Heading3 size={16} />}
                      label="Cabeçalho 3"
                      hint="Ctrl Alt 3"
                      active={state.heading3}
                      onSelect={() => run(() => editor.chain().focus().toggleHeading({ level: 3 }).run())}
                    />
                    <MenuItem
                      icon={<Heading4 size={16} />}
                      label="Cabeçalho 4"
                      hint="Ctrl Alt 4"
                      active={state.heading4}
                      onSelect={() => run(() => editor.chain().focus().toggleHeading({ level: 4 }).run())}
                    />
                    <div className="rte-panel-sep" />
                    <MenuItem
                      icon={<SquareCode size={16} />}
                      label="Bloco de código"
                      active={state.codeBlock}
                      onSelect={() => run(() => editor.chain().focus().toggleCodeBlock().run())}
                    />
                    <MenuItem
                      icon={<Quote size={16} />}
                      label="Citação"
                      active={state.blockquote}
                      onSelect={() => run(() => editor.chain().focus().toggleBlockquote().run())}
                    />
                  </div>
                )}
              </div>

              <div className="rte-dd">
                <button
                  type="button"
                  className="rte-dd-btn"
                  aria-label="Listas"
                  onMouseDown={keepSelection}
                  onClick={() => setOpenMenu(openMenu === 'list' ? null : 'list')}
                >
                  <List size={16} /> <ChevronDown size={13} />
                </button>
                {openMenu === 'list' && (
                  <div className="rte-panel">
                    <MenuItem
                      icon={<List size={16} />}
                      label="Lista com marcadores"
                      hint="Ctrl Shift 8"
                      active={state.bulletList}
                      onSelect={() => run(() => editor.chain().focus().toggleBulletList().run())}
                    />
                    <MenuItem
                      icon={<ListOrdered size={16} />}
                      label="Lista numerada"
                      hint="Ctrl Shift 7"
                      active={state.orderedList}
                      onSelect={() => run(() => editor.chain().focus().toggleOrderedList().run())}
                    />
                    <MenuItem
                      icon={<ListChecks size={16} />}
                      label="Checklist"
                      hint="Ctrl Shift 9"
                      active={state.taskList}
                      onSelect={() => run(() => editor.chain().focus().toggleTaskList().run())}
                    />
                  </div>
                )}
              </div>

              {toggleButton(state.taskList, 'Checklist', <ListChecks size={15} />, () =>
                run(() => editor.chain().focus().toggleTaskList().run()),
              )}
              <span className="rte-sep" />
              {toggleButton(state.bold, 'Negrito', <Bold size={15} />, () =>
                run(() => editor.chain().focus().toggleBold().run()),
              )}
              {toggleButton(state.italic, 'Itálico', <Italic size={15} />, () =>
                run(() => editor.chain().focus().toggleItalic().run()),
              )}
              {toggleButton(state.strike, 'Tachado', <Strikethrough size={15} />, () =>
                run(() => editor.chain().focus().toggleStrike().run()),
              )}
              {toggleButton(state.code, 'Código', <Code size={15} />, () =>
                run(() => editor.chain().focus().toggleCode().run()),
              )}
              <span className="rte-sep" />
              {toggleButton(
                state.link,
                state.link ? 'Remover link' : 'Adicionar link',
                state.link ? <Unlink size={15} /> : <LinkIcon size={15} />,
                startLink,
              )}
            </>
          )}
        </div>
      </BubbleMenu>

      <EditorContent editor={editor} />
    </div>
  );
}
