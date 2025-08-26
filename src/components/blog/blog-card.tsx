"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Share2 } from "lucide-react";
import type { Post } from "@/lib/types";
import { stripHtml } from "@/lib/utils";

export default function BlogCard({ post }: { post: Post }) {
  const author =
  typeof post.author === "string"
    ? { name: post.author, avatar: "default" } 
    : post.author ?? { name: "Unknown", avatar: "default" };


  return (
    <Card className="w-full max-w-md rounded-xl overflow-hidden shadow-sm ">
      {/* Image Section */}
      <Link href={`/blog/${post._id}`}>
          {post.thumbnailUrl ? (
            <Image
              src={post.thumbnailUrl}
              alt={post.title}
              width={600}
              height={200}
              className="h-48 w-full object-cover"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`h-48 w-full bg-muted ${post.thumbnailUrl ? 'hidden' : ''}`} />
        </Link>

      <CardContent className=" space-y-3">
        {/* Badge */}
        {post.badge && (
          <Badge className="bg-gradient-to-r from-yellow-400 to-red-500 text-white px-2  rounded">
            {post.badge}
          </Badge>
        )}

        {/* Title */}
        <CardTitle className="text-lg font-semibold leading-snug line-clamp-2">
          <Link href={`/blog/${post._id}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-4">
          {stripHtml(post.content).slice(0, 160)}...
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between py-3 border-t">
          {/* Author */}
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <Image
                src={`/avatar/${author.avatar}.jpeg`}
                alt={author.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            </Avatar>
            <span className="text-sm">{author.name}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-red-100 rounded-full"
            >
              <Heart className="h-4 w-4 text-red-500" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-yellow-100 rounded-full"
            >
              <Bookmark className="h-4 w-4 text-yellow-500" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-blue-100 rounded-full"
            >
              <Share2 className="h-4 w-4 text-blue-500" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
