// faircodeblogs/src/app/profile/comments/page.tsx
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import type { Comment, PaginatedComments } from '@/lib/types';

export default function AdminComments() {
  const [items, setItems] = useState<Comment[]>([]);
  useEffect(() => {
    api.get<PaginatedComments>('/comments', { params: { page: 1, limit: 100 } })
      .then((res) => setItems(res.data.comments));
  }, []);

  const onDelete = async (id: string) => {
    if (!confirm('Delete comment?')) return;
    await api.delete(`/comments/${id}`);
    setItems((prev) => prev.filter(c => c._id !== id));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">All Comments</h1>
      <ul className="space-y-3">
        {items.map((c) => (
          <li key={c._id} className="rounded border bg-white p-3 flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm">{c.content}</p>
              <p className="text-xs text-neutral-500 mt-1">{new Date(c.createdAt).toLocaleString()}</p>
            </div>
            <button onClick={() => onDelete(c._id)} className="text-red-600 text-sm">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}