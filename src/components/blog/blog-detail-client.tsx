// faircodeblogs/src/components/blog/blog-detail-client.tsx
'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Comments from '@/components/blog/comments';
import BlogAction from '@/components/blog/blog-action';
import type { Post } from '@/lib/types';

export default function BlogDetailClient({ post }: { post: Post }) {
  const [open, setOpen] = useState(false);
  const author = typeof post.author === 'string' ? { name: 'Unknown' } : post.author;

  const openComments = useCallback(() => setOpen(true), []);
  const closeComments = useCallback(() => setOpen(false), []);

  return (
    <div className="relative mx-auto max-w-6xl px-3 py-4">
      <div className={`transition-transform duration-300 ${open ? 'md:translate-x-6' : ''}`}>
        <article className="border rounded-lg bg-white">
          <div className="pb-4">
            {post.thumbnailUrl ? (
              <Image className="w-full h-[40vh] object-cover rounded-t-lg" src={post.thumbnailUrl} alt={post.title} width={1200} height={400} />
            ) : (
              <div className="w-full h-[40vh] rounded-t-lg bg-neutral-100" />
            )}
          </div>

          <div className="p-4">
            <h1 className="text-3xl font-bold pb-4">{post.title}</h1>

            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`/avatar/${(author as any)?.avatar || '1'}.jpeg`} />
                  <AvatarFallback>{author?.name?.[0] ?? 'U'}</AvatarFallback>
                </Avatar>
                <p className="text-sm text-neutral-600">
                  By {author?.name ?? 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>

              <BlogAction postId={post._id} initialLikes={(post as any).likes ?? 0} onOpenComments={openComments} />
            </div>

            <div className="prose prose-neutral mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </article>
      </div>

      <div
        className={`fixed inset-y-0 left-0 z-40 w-full md:w-[380px] max-w-[90vw] bg-white border-r shadow-xl transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <div className="h-12 flex items-center justify-between px-3 border-b">
          <h3 className="text-sm font-semibold">Comments</h3>
          <button onClick={closeComments} className="text-sm text-neutral-600 hover:text-neutral-900">Close</button>
        </div>
        <div className="h-[calc(100%-3rem)] overflow-y-auto p-3">
          <Comments postId={(post as any)._id} />
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/10 md:bg-transparent md:pointer-events-none"
          onClick={closeComments}
          aria-hidden="true"
        />
      )}
    </div>
  );
}