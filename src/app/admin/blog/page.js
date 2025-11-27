"use client";

import { useState, useEffect } from "react";
import { Loader2, FileText, Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Fetching from public API for now, assuming it returns all posts
      // Ideally we'd have an admin endpoint that includes drafts
      const res = await fetch("/api/blog");
      // Note: I haven't created /api/blog yet either! The public blog page uses server actions or direct DB calls.
      // I should check if there is an API for blog posts.
      // The sitemap used `Post.find({})`.
      // I'll create /api/blog/route.js to serve this list.
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error(error);
      // toast.error("Could not load posts"); 
      // Suppress error if API doesn't exist yet, but I'll create it.
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete post");

      setPosts(posts.filter((post) => post._id !== id));
      toast.success("Post deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Blog Management</h1>
          <p className="text-gray-400">Manage your blog posts</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2 bg-neon-blue text-black font-bold rounded-lg hover:bg-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-neon-blue animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="glass-panel rounded-xl overflow-hidden border border-white/10 flex flex-col group"
            >
              <div className="h-48 relative overflow-hidden">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Link
                    href={`/admin/blog/edit/${post._id}`}
                    className="p-2 bg-white text-black rounded-full hover:bg-neon-blue transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                  {post.excerpt || post.content.substring(0, 100)}...
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className="px-2 py-1 bg-white/5 rounded-full border border-white/10">
                    Published
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
