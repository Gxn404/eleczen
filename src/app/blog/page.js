import Link from "next/link";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  let posts = [];
  try {
    // In server components, use absolute URL or fetch from DB directly if preferred.
    // Since we are in the same Next.js app, we can import the logic or just fetch.
    // For simplicity and consistency with the "use crud" request, let's assume we fetch from the API.
    // However, fetching from localhost in server component needs full URL.
    // A better pattern for server components is to call the DB logic directly.
    // But to demonstrate "using the API", we will use the API route if possible, or fallback to DB logic.
    // Let's use the DB logic directly here to avoid localhost URL issues during build/runtime without base URL.
    // Wait, the user asked to "use newly added crud". The CRUD is in API routes.
    // To use API routes from Server Component, we need the base URL.
    // Alternatively, we can make this a Client Component to use relative fetch, but SEO is better with Server Component.
    // Let's stick to Server Component and use the DB logic (which is what the API uses) OR try to fetch if we had a BASE_URL.
    // Given the context, I'll update it to use the `Post` model directly, which shares the logic with the API.

    // Actually, let's try to use the API route logic by importing the handler? No, that's messy.
    // Let's use the Mongoose model directly as it's the "backend" for the API.

    // IMPORT DB CONNECT AND POST MODEL
    const { default: dbConnect } = await import("@/lib/db");
    const { default: Post } = await import("@/models/Post");

    await dbConnect();
    const rawPosts = await Post.find({ published: true })
      .populate("author", "name image")
      .sort({ createdAt: -1 });

    posts = JSON.parse(JSON.stringify(rawPosts)); // Serialize for props
  } catch (error) {
    console.error("Error fetching posts:", error);
  }

  const featuredPost = posts?.[0];
  const regularPosts = posts?.slice(1) || [];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Community <span className="text-neon-pink">Blog</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Insights, tutorials, and deep dives into the world of electronics.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-20">
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-[21/9]">
                <div className="absolute inset-0">
                  {featuredPost.cover_image ? (
                    <img
                      src={featuredPost.cover_image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <div className="flex flex-wrap gap-3 mb-4">
                    {featuredPost.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-neon-pink/20 text-neon-pink border border-neon-pink/30 text-sm font-medium backdrop-blur-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-neon-pink transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-lg text-gray-300 max-w-3xl mb-6 line-clamp-2">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-gray-400 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                        {featuredPost.author?.image && (
                          <img src={featuredPost.author.image} alt={featuredPost.author.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span>{featuredPost.author?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(featuredPost.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post._id} className="group flex flex-col h-full">
              <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-neon-pink/50 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <span className="text-4xl">⚡</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-black/50 text-white text-xs font-medium backdrop-blur-md border border-white/10">
                      {post.tags?.[0] || "Article"}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      5 min read
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-neon-pink transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-800 overflow-hidden">
                        {post.author?.image && (
                          <img src={post.author.image} alt={post.author.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span className="text-xs text-gray-400 font-medium">
                        {post.author?.name}
                      </span>
                    </div>
                    <span className="text-neon-pink text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
