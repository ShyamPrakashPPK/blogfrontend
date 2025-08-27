import './globals.css';
import { ReactQueryProvider } from '@/lib/queryClient';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';
import { Poppins } from 'next/font/google';
import ToastProvider from '@/components/ui/ToastProvider';
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'Faircode Blogs',
  description: 'Blogs with JWT + Axios',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} min-h-screen bg-white text-neutral-900 flex flex-col`}>
        <ReactQueryProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ToastProvider />
        </ReactQueryProvider>
      </body>
    </html>
  );
}