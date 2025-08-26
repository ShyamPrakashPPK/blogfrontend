export default function Footer() {
    return (
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-neutral-600 flex flex-col sm:flex-row items-center justify-between">
          <p>© {new Date().getFullYear()} Faircode Blogs</p>
          <p className="mt-2 sm:mt-0">Built with Next.js + Axios</p>
        </div>
      </footer>
    );
  }
  