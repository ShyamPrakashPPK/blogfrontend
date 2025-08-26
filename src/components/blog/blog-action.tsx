'use client';

import { useCallback, useState } from 'react';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import api from '@/lib/axios';

export default function BlogAction({
  postId,
  initialLikes = 0,
  onOpenComments,
}: {
  postId: string;
  initialLikes?: number;
  onOpenComments?: () => void;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [liking, setLiking] = useState(false);

  const onLike = useCallback(async () => {
    if (liking) return;
    setLiking(true);
    try {
      const res = await api.post<{ liked: boolean; likes: number }>(`/posts/${postId}/like`);
      setLikes(res.data.likes);
    } catch {} finally {
      setLiking(false);
    }
  }, [postId, liking]);

  const onShare = useCallback(async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) await navigator.share({ url });
      else {
        await navigator.clipboard.writeText(url);
        alert('Link copied!');
      }
    } catch {}
  }, []);

  const goToComments = useCallback(() => {
    if (onOpenComments) onOpenComments();
    else document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [onOpenComments]);

  return (
    <div className="flex items-center gap-3">
      <button onClick={onLike} disabled={liking} className="inline-flex items-center gap-1 text-sm text-neutral-700 hover:text-neutral-900 disabled:opacity-50">
        <Heart className="h-4 w-4 text-red-500" /> {likes}
      </button>
      <button onClick={goToComments} className="inline-flex items-center gap-1 text-sm text-neutral-700 hover:text-neutral-900">
        <MessageSquare className="h-4 w-4" /> Comment
      </button>
      <button onClick={onShare} className="inline-flex items-center gap-1 text-sm text-neutral-700 hover:text-neutral-900">
        <Share2 className="h-4 w-4" /> Share
      </button>
    </div>
  );
}