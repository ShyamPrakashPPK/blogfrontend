'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Post } from '@/lib/types';
import { stripHtml } from '@/lib/utils';
import Image from 'next/image';

export default function Carousel({ items }: { items: Post[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % Math.max(1, items.length)), 3000);
    return () => clearInterval(id);
  }, [items.length]);
  if (!items.length) return null;

  const current = items[index];
  const author = typeof current.author === 'string'
    ? { name: current.author, avatar: '1' }
    : (current.author ?? { name: 'Unknown', avatar: '1' });

  return (
    <div className="relative w-full overflow-hidden rounded-lg border bg-white">
      <div className='flex '>
        <div className='w-1/2'>
          {current.thumbnailUrl ? (
            <Image
              className='w-full h-[40vh] object-cover'
              src={current.thumbnailUrl}
              alt={current.title}
              width={800}
              height={400}
            />
          ) : (
            <div className='w-full h-[40vh] bg-neutral-100' />
          )}
        </div>
        <div className='w-1/2'>
          <div className='flex items-center gap-2 p-4'>
            <Image
              className='w-10 h-10 rounded-full'
              src={`/avatar/${author.avatar || '1'}.jpeg`}
              alt={author.name || 'default'}
              width={40}
              height={40}
            />
            <div>
              <p className='text-sm font-medium'>{author.name}</p>
              <p className='text-xs text-neutral-600'>{current.createdAt.split('T')[0]}</p>
            </div>
          </div>
          <div className="px-4">
            <h3 className="text-lg font-semibold">{current.title}</h3>
            <p className="mt-2 line-clamp-6 text-sm text-neutral-600">
              {stripHtml(current.content).slice(0, 600)}...
            </p>
            <div className="mt-4">
              <Link href={`/blog/${current._id}`} className="text-blue-600 hover:underline">View blog</Link>
            </div>
          </div>
          <div className="absolute bottom-2 right-2 flex gap-1">
            {items.map((_, i) => (
              <span key={i} className={`h-2 w-2 rounded-full ${i === index ? 'bg-neutral-800' : 'bg-neutral-300'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}