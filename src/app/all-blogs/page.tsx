import { Suspense } from 'react';
import AllBlogsContent from '@/components/blog/all-blog-component';

// Loading component for the suspense fallback
function AllBlogsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <div className="w-full rounded border px-10 py-2 bg-gray-100 animate-pulse h-10"></div>
        </div>
        <div className="w-32 rounded border px-3 py-2 bg-gray-100 animate-pulse h-10"></div>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
            <div className="bg-gray-200 rounded h-4 mb-2"></div>
            <div className="bg-gray-200 rounded h-4 w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AllBlogsPage() {
  return (
    <Suspense fallback={<AllBlogsLoading />}>
      <AllBlogsContent />
    </Suspense>
  );
}
