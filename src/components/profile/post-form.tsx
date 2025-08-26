"use client";

import { useState } from "react";
import RichTextEditor from "@/components/blog/rich-text-editor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function PostForm({
  initialTitle,
  initialContent,
  initialBadge,
  initialThumbnail,
  onSubmit,
}: {
  initialTitle?: string;
  initialContent?: string;
  initialBadge?: string;
  initialThumbnail?: string;
  onSubmit: (
    title: string,
    content: string,
    badge: string,
    thumbnailUrl: string
  ) => Promise<void> | void;
}) {
  const [title, setTitle] = useState(initialTitle || "");
  const [content, setContent] = useState(
    initialContent || "<p>Write your post...</p>"
  );
  const [badge, setBadge] = useState(initialBadge || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialThumbnail || "");
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState("");

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-6 space-y-6">
        <form
          className="space-y-6"
          onSubmit={async (e) => {
            e.preventDefault();
            setPending(true);
            setErr("");
            try {
              await onSubmit(title, content, badge, thumbnailUrl);
            } catch (e: any) {
              setErr(e?.message || "Failed");
            } finally {
              setPending(false);
            }
          }}
        >
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Post Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              required
            />
          </div>

          {/* Badge */}
          <div className="space-y-2">
            <Label htmlFor="badge">Badge (optional)</Label>
            <Input
              id="badge"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. Featured, Outstanding"
            />
          </div>

          {/* Thumbnail URL */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail URL (optional)</Label>
            <Input
              id="thumbnail"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://example.com/image.png"
            />
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt="Preview"
                className="h-40 w-full object-cover rounded-md mt-2 border"
              />
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label>Content</Label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          {/* Error */}
          {err && <p className="text-sm text-red-600">{err}</p>}

          {/* Submit */}
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Saving..." : "Save Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
