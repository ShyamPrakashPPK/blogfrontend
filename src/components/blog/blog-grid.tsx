import type { Post } from '@/lib/types';
import BlogCard from './blog-card';

export default function BlogGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => <BlogCard key={p._id} post={p} />)}
    </div>
  );
}
