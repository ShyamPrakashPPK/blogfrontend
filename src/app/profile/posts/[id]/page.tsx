// faircodeblogs/src/app/profile/posts/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import type { Post } from '@/lib/types';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function ProfilePostDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ post: Post }>(`/posts/${params.id}`)
      .then((res) => setPost(res.data.post))
      .catch(() => router.push('/profile'))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  const deletePost = async () => {
    if (!confirm('Delete this post?')) return;
    await api.delete(`/posts/${params.id}`);
    router.push('/profile');
  };

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-8">Loading...</div>;
  if (!post) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Post Details</h1>
      <div className="rounded border bg-white p-4">
        <h2 className="text-xl font-semibold">{post.title}</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Created: {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <div className="mt-4 flex gap-3">
          <Link href={`/blog/${post._id}`} className="text-blue-600 hover:underline">View</Link>
          <Link href={`/profile/posts/${post._id}/edit`} className="text-neutral-700 hover:underline">Edit</Link>
          <button onClick={deletePost} className="text-red-600 hover:underline">Delete</button>
        </div>
      </div>
    </div>
  );
}