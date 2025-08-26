'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function RichTextEditor({ value, onChange }: { value?: string; onChange?: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '<p>Write your post...</p>',
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="border rounded p-2 bg-white">
      <div className="flex flex-wrap gap-2 mb-2">
        <button className="px-2 py-1 border rounded" onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
        <button className="px-2 py-1 border rounded" onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
        <button className="px-2 py-1 border rounded" onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
        <button className="px-2 py-1 border rounded" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      </div>
      <EditorContent editor={editor} className="prose prose-neutral max-w-none min-h-[200px]" />
    </div>
  );
}
