'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import api from "@/lib/axios";
import type { Paginated, Post } from "@/lib/types";
import BlogCard from "@/components/blog/blog-card";

export default function AllBlogsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [sortBy, setSortBy] = useState<'new' | 'old'>((searchParams.get('sort') as 'new' | 'old') || 'new');
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  const limit = 9;

  // Fetch posts function
  const fetchPosts = async (page: number = currentPage, q: string = searchQuery, sort: 'new' | 'old' = sortBy) => {
    setLoading(true);
    try {
      const res = await api.get<Paginated<Post>>("/posts", {
        params: { page, limit, ...(q ? { q } : {}), sort },
      });
      
      const data = res.data;
      setPosts(data.posts);
      setTotalPages(Math.max(1, Math.ceil(data.total / data.limit)));
      setTotal(data.total);
      
      // Update URL without triggering a page reload
      const newSearchParams = new URLSearchParams();
      if (q) newSearchParams.set('q', q);
      if (page > 1) newSearchParams.set('page', String(page));
      if (sort !== 'new') newSearchParams.set('sort', sort);
      
      const newUrl = `/all-blogs${newSearchParams.toString() ? '?' + newSearchParams.toString() : ''}`;
      router.replace(newUrl, { scroll: false });
      
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setCurrentPage(1);
          fetchPosts(1, query, sortBy);
        }, 300);
      };
    })(),
    [sortBy]
  );

  // Initial load
  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle search input change (debounced)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle search form submission (immediate)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts(1, searchQuery, sortBy);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
    fetchPosts(1, '', sortBy);
  };

  // Handle sort change
  const handleSortChange = (newSort: 'new' | 'old') => {
    setSortBy(newSort);
    setCurrentPage(1);
    fetchPosts(1, searchQuery, newSort);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchPosts(newPage, searchQuery, sortBy);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Search + Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search Bar with Icon */}
        <form onSubmit={handleSearch} className="relative flex-1">
          <input
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by title or content"
            className="w-full rounded border pl-10 pr-10 py-2"
          />
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={18} 
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </form>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value as 'new' | 'old')}
          className="rounded border px-3 py-2"
        >
          <option value="new">Newest</option>
          <option value="old">Oldest</option>
        </select>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="mb-4 text-sm text-gray-600">
          {loading ? 'Searching...' : `Found ${total} result${total !== 1 ? 's' : ''} for "${searchQuery}"`}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
              <div className="bg-gray-200 rounded h-4 mb-2"></div>
              <div className="bg-gray-200 rounded h-4 w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Blog Grid */}
          {posts.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No posts found</p>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="mt-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Clear search and show all posts
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {posts.length > 0 && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="rounded border px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600">
                  Page {currentPage} of {totalPages}
                </span>
                
                {/* Page Numbers for better UX */}
                <div className="hidden sm:flex gap-1 ml-4">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = Math.max(1, currentPage - 2) + i;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-2 py-1 text-sm rounded ${
                          pageNum === currentPage
                            ? 'bg-neutral-900 text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}
                className="rounded border px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
