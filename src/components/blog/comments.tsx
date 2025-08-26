'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import type { Comment, PaginatedComments } from '@/lib/types';
import Image from 'next/image';

export default function Comments({ postId }: { postId: string }) {
  const [items, setItems] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await api.get<PaginatedComments>('/comments', { params: { post: postId, page: 1, limit: 50 } });
    setItems(res.data.comments);
    setLoading(false);
  };

  useEffect(() => { load(); }, [postId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    const res = await api.post<{ comment: Comment }>('/comments', { postId, content });
    setItems((prev) => [res.data.comment, ...prev]);
    setContent('');
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-3">Comments</h3>

      <form onSubmit={submit} className="mb-4 flex gap-2">
        <input className="flex-1 rounded border px-3 py-2" placeholder="Write a comment..." value={content} onChange={(e) => setContent(e.target.value)} />
        <button className="rounded bg-neutral-900 text-white px-3 py-2">Post</button>
      </form>

      {loading ? <p>Loading...</p> : (
        <ul className="space-y-3">
          {items.map((c) => {
            const a = typeof c.author === 'string' ? { name: c.author } : c.author || { name: 'Unknown' };
            return (
              <li key={c._id} className="rounded border bg-white p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Image src={`/avatar/${(a as any).avatar || '1'}.jpeg`} alt={a.name} width={24} height={24} className="rounded-full" />
                  <span className="text-sm">{a.name}</span>
                  <span className="ml-auto text-xs text-neutral-500">{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm">{c.content}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}