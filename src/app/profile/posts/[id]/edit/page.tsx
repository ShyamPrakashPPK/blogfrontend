'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import type { Post } from '@/lib/types';
import PostForm from '@/components/profile/post-form';
import { useRouter, useParams } from 'next/navigation';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    api.get<{ post: Post }>(`/posts/${params.id}`).then((r) => setPost(r.data.post)).catch(() => router.push('/profile'));
  }, [params.id, router]);

  const updatePost = async (title: string, content: string) => {
    await api.patch(`/posts/${params.id}`, { title, content });
    router.push(`/blog/${params.id}`);
  };

  if (!post) return <div className="mx-auto max-w-3xl px-4 py-8">Loading...</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Edit Post</h1>
      <PostForm initialTitle={post.title} initialContent={post.content} onSubmit={updatePost} />
    </div>
  );
}
