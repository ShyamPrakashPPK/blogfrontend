import Link from 'next/link';
import api from '@/lib/axios';
import BlogCarousel from '@/components/blog/blog-carousel';
import type { Paginated, Post } from '@/lib/types';

export default async function HomePage() {
  const res = await api.get<Paginated<Post>>('/posts', { params: { page: 1, limit: 5 } });
  const latest = res.data;

  return (
    <div>
      <section
        className="relative bg-neutral-900 text-white"
        style={{
          backgroundImage: "url('/banner/8247.jpg')", // replace with your actual image name
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-3xl sm:text-4xl font-bold">Discover insightful blogs</h1>
          <p className="mt-3 text-neutral-300">Read the latest posts from our community.</p>
          <div className="mt-6">
            <Link
              href="/all-blogs"
              className="inline-block rounded bg-white text-neutral-900 px-4 py-2 font-medium hover:bg-neutral-100 transition-all duration-300 hover:text-neutral-900 hover:scale-105"
            >
              View all
            </Link>
          </div>
        </div>
      </section>

      <div className="my-8">
        <BlogCarousel posts={latest.posts} />
      </div>
    </div>
  );
}
