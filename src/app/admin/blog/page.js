"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, FileText, Loader2 } from "lucide-react";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  }

  async function deletePost(id) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPosts(posts.filter((post) => post._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-neon-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FileText className="text-neon-purple" /> Blog Posts
        </h1>
        <Link href="/admin/blog/new">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-blue text-black font-bold hover:bg-neon-blue/90 transition-all">
            <Plus className="w-4 h-4" /> Create New
          </button>
        </Link>
      </div>

      <div className="glass-panel rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-400 text-sm uppercase">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Author</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {posts.map((post) => (
              <tr key={post._id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-white font-medium">{post.title}</td>
                <td className="p-4 text-gray-400">
                  {post.author?.name || "Unknown"}
                </td>
                <td className="p-4 text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-neon-blue transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deletePost(post._id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">
                  No posts found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
