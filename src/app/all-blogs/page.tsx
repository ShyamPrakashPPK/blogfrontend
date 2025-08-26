import Link from "next/link";
import api from "@/lib/axios";
import type { Paginated, Post } from "@/lib/types";
import BlogCard from "@/components/blog/blog-card"; // ✅ import your BlogCard

type Props = { searchParams: { q?: string; page?: string; sort?: "new" | "old" } };

export default async function AllBlogsPage({ searchParams }: Props) {
  const page = Number(searchParams.page || 1);
  const q = searchParams.q || "";
  const sort = searchParams.sort || "new";
  const limit = 9;

  const res = await api.get<Paginated<Post>>("/posts", {
    params: { page, limit, ...(q ? { q } : {}) },
  });
  const data = res.data;

  const posts = [...data.posts].sort((a, b) =>
    sort === "new"
      ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  console.log(posts)

  const totalPages = Math.max(1, Math.ceil(data.total / data.limit));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Search + Sort Form */}
      <form action="/all-blogs" className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by title or content"
          className="w-full rounded border px-3 py-2"
        />
        <select
          name="sort"
          defaultValue={sort}
          className="rounded border px-3 py-2"
        >
          <option value="new">Newest</option>
          <option value="old">Oldest</option>
        </select>
        <button
          type="submit"
          className="rounded bg-neutral-900 text-white px-4 py-2"
        >
          Search
        </button>
      </form>

      {/* Blog Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post._id} post={post} /> 
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-between">
        <Link
          href={`/all-blogs?${new URLSearchParams({
            q,
            sort,
            page: String(Math.max(1, page - 1)),
          })}`}
          className="rounded border px-3 py-2"
        >
          Previous
        </Link>

        <span className="text-sm text-neutral-600">
          Page {data.page} of {totalPages}
        </span>

        <Link
          href={`/all-blogs?${new URLSearchParams({
            q,
            sort,
            page: String(Math.min(totalPages, page + 1)),
          })}`}
          className="rounded border px-3 py-2"
        >
          Next
        </Link>
      </div>
    </div>
  );
}
