import type { Post } from '@/lib/types';
import Carousel from '@/components/ui/carousel';

export default function BlogCarousel({ posts }: { posts: Post[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Latest Blogs</h2>
      </div>
      <Carousel items={posts} />
    </section>
  );
}
