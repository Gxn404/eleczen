"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function BlogListing() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        // API returns array directly
        if (Array.isArray(data)) {
          setPosts(data);
        }
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-8 max-w-7xl mx-auto">
        <Breadcrumbs className="mb-6" />
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
          Latest Insights
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="glass-panel h-64 rounded-xl animate-pulse bg-white/5"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <Breadcrumbs className="mb-6" />
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple neon-text">
          Latest Insights
        </h1>
        <p className="text-gray-400 mt-4 md:mt-0 max-w-md text-center md:text-right">
          Explore the latest trends, tutorials, and deep dives into the world of
          electronics and circuit design.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-xl">
          <h2 className="text-2xl text-gray-400">No posts found yet.</h2>
          <p className="text-gray-500 mt-2">Check back soon for updates!</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Featured Post Hero */}
          {featuredPost && (
            <Link href={`/blog/${featuredPost.slug}`} className="block group">
              <article className="glass-panel rounded-2xl overflow-hidden relative grid md:grid-cols-2 gap-0 border border-white/10 hover:border-neon-blue/50 transition-all duration-300">
                <div className="h-64 md:h-auto bg-gray-900 relative overflow-hidden">
                  {featuredPost.coverImage ? (
                    <img
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                      <span className="text-6xl">⚡</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-neon-blue text-black text-xs font-bold uppercase tracking-wider">
                      Featured
                    </span>
                    {featuredPost.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs font-medium border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-neon-blue transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-400 mb-6 line-clamp-3 text-lg">
                    {featuredPost.excerpt ||
                      featuredPost.content.substring(0, 150) + "..."}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-700" />
                      <span>{featuredPost.author?.name || "ElecZen Author"}</span>
                    </div>
                    <span>•</span>
                    <span>{new Date(featuredPost.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </article>
            </Link>
          )}

          {/* Regular Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Link
                href={`/blog/${post.slug}`}
                key={post._id}
                className="group"
              >
                <article className="glass-panel rounded-xl overflow-hidden h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,243,255,0.15)] border border-white/5 hover:border-neon-blue/50 flex flex-col">
                  <div className="h-48 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
                    {/* Placeholder for cover image if none exists */}
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                        <span className="text-4xl">⚡</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex gap-2 mb-3">
                      {post.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-medium px-2 py-1 rounded-full bg-neon-blue/10 text-neon-blue border border-neon-blue/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-white group-hover:text-neon-blue transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                      {post.excerpt || post.content.substring(0, 100) + "..."}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-white/5">
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform">Read more →</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
