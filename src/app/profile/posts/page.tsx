// faircodeblogs/src/app/profile/posts/page.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import type { Post } from '@/lib/types';
import Link from 'next/link';

export default function ProfilePostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/posts', { params: { author: 'me', page: 1, limit: 50 } })
      .then((res) => setPosts(res.data.posts))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-8">Loading...</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">My Posts</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div key={post._id} className="rounded border bg-white p-4">
            <h3 className="font-semibold">{post.title}</h3>
            <div className="mt-3 flex items-center gap-3">
              <Link href={`/blog/${post._id}`} className="text-blue-600 hover:underline">View</Link>
              <Link href={`/profile/posts/${post._id}/edit`} className="text-neutral-700 hover:underline">Edit</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}