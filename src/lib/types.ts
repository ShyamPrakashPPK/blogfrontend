export type User = { id: string; name: string; email: string; role: 'user' | 'admin', avatar: string };
export type Post = {
    _id: string;
    title: string;
    content: string;
    author: { _id?: string; name: string; email: string; role: string; avatar: string } | string;
    createdAt: string;
    updatedAt: string;
    thumbnailUrl?: string;
    likes?: number;
    bookmarked?: boolean;
    badge?: string;
  };
  
export type Paginated<T> = { page: number; limit: number; total: number; posts: T[] };

export type AuthResponse = { user: User; token: string };

export type Comment = {
  _id: string;
  post: string | Post;
  author: { _id?: string; name: string; email: string; role: string; avatar?: string } | string;
  content: string;
  createdAt: string;
  updatedAt: string;
};
export type PaginatedComments = { page: number; limit: number; total: number; comments: Comment[] };