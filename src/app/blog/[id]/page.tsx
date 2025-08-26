import api from '@/lib/axios';
import type { Post } from '@/lib/types';
import Image from 'next/image';
import BlogDetailClient from '@/components/blog/blog-detail-client';

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await api.get<{ post: Post }>(`/posts/${id}`);
  const p = res.data.post;
  return <BlogDetailClient post={p} />;
}