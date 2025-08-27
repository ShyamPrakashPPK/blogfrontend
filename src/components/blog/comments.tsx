'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import type { Comment, PaginatedComments } from '@/lib/types';
import Image from 'next/image';

export default function Comments({ postId }: { postId: string }) {
  const [items, setItems] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get<PaginatedComments>('/comments', { params: { post: postId, page: 1, limit: 50 } });
      setItems(res.data.comments);
    } catch (error: any) {
      toast.error('Failed to load comments');
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [postId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setSubmitting(true);
    
    try {
      const res = await api.post<{ comment: Comment }>('/comments', { postId, content });
      setItems((prev) => [res.data.comment, ...prev]);
      setContent('');
      toast.success('Comment posted successfully!');
    } catch (error: any) {
      // Handle different error scenarios
      if (error.response?.status === 401) {
        toast.error('Please login to post a comment');
        // Optional: Redirect to login with current page as return URL
        setTimeout(() => {
          router.push(`/auth/login`);
        }, 1000);
      } else if (error.response?.status === 403) {
        toast.error('You are not authorized to post comments');
      } else if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || 'Invalid comment data';
        toast.error(errorMessage);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to post comment. Please try again.');
      }
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-3">Comments</h3>

      <form onSubmit={submit} className="mb-4 flex gap-2">
        <input 
          className="flex-1 rounded border px-3 py-2" 
          placeholder="Write a comment..." 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          disabled={submitting}
        />
        <button 
          className="rounded bg-neutral-900 text-white px-3 py-2 disabled:opacity-50" 
          disabled={submitting}
        >
          {submitting ? 'Posting...' : 'Post'}
        </button>
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500">Loading comments...</p>
        </div>
      ) : (
        <div>
          {items.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
          ) : (
            <ul className="space-y-3">
              {items.map((c) => {
                const a = typeof c.author === 'string' ? { name: c.author } : c.author || { name: 'Unknown' };
                return (
                  <li key={c._id} className="rounded border bg-white p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Image 
                        src={`/avatar/${(a as any).avatar || '1'}.jpeg`} 
                        alt={a.name} 
                        width={24} 
                        height={24} 
                        className="rounded-full" 
                      />
                      <span className="text-sm font-medium">{a.name}</span>
                      <span className="ml-auto text-xs text-neutral-500">
                        {new Date(c.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{c.content}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
