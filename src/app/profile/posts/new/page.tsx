'use client';

import PostForm from '@/components/profile/post-form';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
  const router = useRouter();

  const createPost = async (title: string, content: string, badge: string, thumbnailUrl: string) => {
    console.log(title, content, badge, thumbnailUrl,"title, content, badge, thumbnailUrl");
    const res = await api.post<{ post: { _id: string } }>('/posts', { 
      title, 
      content, 
      badge, 
      thumbnailUrl 
    });
    router.push(`/blog/${res.data.post._id}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Create New Post</h1>
      <PostForm onSubmit={createPost} />
    </div>
  );
}