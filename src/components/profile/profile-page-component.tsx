'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import api from '@/lib/axios';
import type { Paginated, Post, User } from '@/lib/types';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

type UsersResponse = { users: Array<User> };
type PostsResponse = Paginated<Post>;

// Separate component for handling edit mode with useSearchParams
function EditModeHandler({ me, router }: { me: User; router: any }) {
  const sp = useSearchParams();
  const editMode = sp.get('edit');

  if (editMode === 'info') {
    return <EditInfo onDone={() => router.push('/profile')} initial={{ name: me.name, email: me.email }} />;
  }
  
  if (editMode === 'password') {
    return <ChangePassword onDone={() => router.push('/profile')} />;
  }
  
  return null;
}

export default function ProfilePage() {
  const [me, setMe] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>('');
  const router = useRouter();

  const isAdmin = useMemo(() => me?.role === 'admin', [me]);

  useEffect(() => {
    const load = async () => {
      setErr('');
      try {
        // 1) current user
        const meRes = await api.get<{ user: User }>('/auth/me');
        const current = meRes.data.user;
        setMe(current);

        // 2) own posts
        const pRes = await api.get<PostsResponse>('/posts', {
          params: { author: current.id, page: 1, limit: 50 },
        });
        setPosts(pRes.data.posts);

        // 3) admin-only datasets
        if (current.role === 'admin') {
          const [usersRes, allPRes] = await Promise.all([
            api.get<UsersResponse>('/users'),
            api.get<PostsResponse>('/posts', { params: { page: 1, limit: 50 } }),
          ]);
          setUsers(usersRes.data.users);
          setAllPosts(allPRes.data.posts);
        }
      } catch (e: any) {
        setErr('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
    // re-run when the router changes (e.g., after edit/save navigation)
  }, [router]);

  const onDeleteOwnPost = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await api.delete(`/posts/${id}`);
    setPosts(prev => prev.filter(p => p._id !== id));
    // if admin view also present, reflect there too
    setAllPosts(prev => prev.filter(p => p._id !== id));
  };

  // Admin handlers
  const onDeleteUser = async (id: string) => {
    if (!confirm('Delete this user? This may delete or orphan their posts depending on backend rules.')) return;
    await api.delete(`/users/${id}`);
    setUsers(prev => prev.filter(u => u.id !== id));
    setAllPosts(prev =>
      prev.filter(p =>
        typeof p.author === 'string'
          ? p.author !== id
          : (p.author?._id || '') !== id
      )
    );
  };

  const onAdminDeletePost = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await api.delete(`/posts/${id}`);
    setAllPosts(prev => prev.filter(p => p._id !== id));
    // if it was also in own posts, reflect there
    setPosts(prev => prev.filter(p => p._id !== id));
  };

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-8">Loading...</div>;
  if (!me) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <section>
        <h2 className="text-xl font-semibold">Profile</h2>
        <div className="mt-3 rounded border bg-white p-4">
          <div className='flex gap-4 items-center'>
            <div>
              <Image className='w-10 h-10 rounded-full' src={`/avatar/${me.avatar}.jpeg`} alt={me.name} width={100} height={100} />
            </div>
            <div>
              <p><span className="font-medium">Name:</span> {me.name}</p>
              <p><span className="font-medium">Email:</span> {me.email}</p>
            </div>
          </div>
          <p className="mt-1 text-xs uppercase tracking-wide"><span className="font-medium">Role:</span> {me.role}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/profile/posts/new" className="rounded bg-neutral-900 text-white px-3 py-2">New Post</Link>
            <Link href="/profile?edit=info" className="rounded border px-3 py-2">Edit Info</Link>
            <Link href="/profile?edit=password" className="rounded border px-3 py-2">Change Password</Link>
          </div>
        </div>

        {/* Wrap the edit mode handler in Suspense */}
        <Suspense fallback={<div className="mt-4 text-sm text-neutral-600">Loading edit form...</div>}>
          <EditModeHandler me={me} router={router} />
        </Suspense>
      </section>

      <section>
        <h2 className="text-xl font-semibold">My Posts</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <div key={p._id} className="rounded-lg border bg-white">
              <Image className='w-full h-[200px] object-cover rounded-t' src={p.thumbnailUrl || ''} alt={p.title} width={100} height={100} />
              <div className='p-4'>
                <h3 className="font-semibold">{p.title}</h3>
                <h4 className='text-sm text-neutral-600'>CreatedAt: {p.createdAt.split('T')[0]}</h4>
                <div className="mt-3 flex items-center gap-3">
                  <Link href={`/blog/${p._id}`} className="text-blue-600 hover:underline">View</Link>
                  <Link href={`/profile/posts/${p._id}/edit`} className="text-neutral-700 hover:underline">Edit</Link>
                  <button onClick={() => onDeleteOwnPost(p._id)} className="text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="text-sm text-neutral-600">No posts yet.</div>
          )}
        </div>
      </section>

      {isAdmin && (
        <section>
          <h2 className="text-xl font-semibold">Admin Tools</h2>

          <div className="mt-6">
            <h3 className="font-semibold">All Users</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((u) => (
                <div key={u.id} className="rounded border bg-white p-4">
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-neutral-600">{u.email}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide">{u.role}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() => onDeleteUser(u.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                    {/* Optional future: role toggle, view details, etc. */}
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <div className="text-sm text-neutral-600">No users.</div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold">All Posts</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allPosts.map((p) => (
                <div key={p._id} className="rounded border bg-white p-4">
                  <h4 className="font-semibold">{p.title}</h4>
                  <p className="text-sm text-neutral-600">
                    {typeof p.author === 'string' ? p.author : p.author.name}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <Link href={`/blog/${p._id}`} className="text-blue-600 hover:underline">View</Link>
                    <button
                      onClick={() => onAdminDeletePost(p._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {allPosts.length === 0 && (
                <div className="text-sm text-neutral-600">No posts.</div>
              )}
            </div>
          </div>
        </section>
      )}

      {err && (
        <p className="text-sm text-red-600">{err}</p>
      )}
    </div>
  );
}

function EditInfo({ onDone, initial }: { onDone: () => void; initial: { name: string; email: string } }) {
  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [err, setErr] = useState('');
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setErr('');
    try {
      await api.patch('/users/me', { name, email });
      onDone();
    } catch (e: any) {
      setErr('Update failed');
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-4 max-w-md rounded border bg-white p-4 space-y-3">
      <h3 className="font-semibold">Edit Info</h3>
      <input className="w-full rounded border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="w-full rounded border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button disabled={pending} className="rounded bg-neutral-900 text-white px-3 py-2 disabled:opacity-50">
        {pending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}

function ChangePassword({ onDone }: { onDone: () => void }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [err, setErr] = useState('');
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setErr('');
    try {
      await api.post('/users/me/change-password', { currentPassword, newPassword });
      onDone();
    } catch (e: any) {
      setErr('Password change failed');
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-4 max-w-md rounded border bg-white p-4 space-y-3">
      <h3 className="font-semibold">Change Password</h3>
      <input
        className="w-full rounded border px-3 py-2"
        type="password"
        placeholder="Current password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <input
        className="w-full rounded border px-3 py-2"
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button disabled={pending} className="rounded bg-neutral-900 text-white px-3 py-2 disabled:opacity-50">
        {pending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
