import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock, User, Sparkles } from "lucide-react";
import { supabase } from "../../../supabase/supabase";

export const revalidate = 60; // Revalidate every 60 seconds

async function getPosts() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, slug, title, excerpt, cover_image, author_name, author_image, tags, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error.message);
    return [];
  }
  return posts;
}

export default async function BlogPage() {
  const posts = await getPosts();

  const featuredPost = posts?.[0];
  const regularPosts = posts?.slice(1) || [];

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 relative bg-black overflow-hidden selection:bg-neon-pink/30 selection:text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neon-blue/20 rounded-full blur-[128px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neon-pink text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
            <Sparkles className="w-3 h-3" />
            <span>Community Insights</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight animate-fade-in-up delay-100">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-purple-400 to-neon-blue">ElecZen</span> Blog
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in-up delay-200 leading-relaxed">
            Deep dives into circuit design, simulation techniques, and the future of electronics engineering.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-24 animate-fade-in-up delay-300">
            <Link href={`/blog/${featuredPost.slug}`} className="group block relative">
              <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm aspect-[21/10]">
                {/* Image */}
                <div className="absolute inset-0">
                  {featuredPost.cover_image ? (
                    <Image
                      src={featuredPost.cover_image}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                      <span className="text-6xl">⚡</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16 flex flex-col items-start gap-6">
                  <div className="flex flex-wrap gap-3">
                    {featuredPost.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold border border-white/20 uppercase tracking-wider group-hover:border-neon-pink/50 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-4 max-w-4xl">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight group-hover:text-neon-pink transition-colors duration-300">
                      {featuredPost.title}
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 line-clamp-2 md:line-clamp-3 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 text-sm font-medium text-white/80 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neon-pink/20 border border-neon-pink/30 flex items-center justify-center overflow-hidden relative">
                        {featuredPost.author_image ? (
                          <Image src={featuredPost.author_image} alt={featuredPost.author_name || 'Author'} fill className="object-cover" />
                        ) : (
                          <User className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-neon-pink" />
                        )}
                      </div>
                      <span className="text-white">{featuredPost.author_name || 'ElecZen Team'}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/30" />
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neon-blue" />
                      <span>{new Date(featuredPost.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/30" />
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-neon-purple" />
                      <span>{featuredPost.read_time || '5 min'} read</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post, idx) => (
            <Link href={`/blog/${post.slug}`} key={post.id || idx} className="group flex flex-col h-full animate-fade-in-up" style={{ animationDelay: `${400 + (idx * 100)}ms` }}>
              <div className="glass-panel h-full flex flex-col rounded-3xl overflow-hidden border border-white/5 bg-white/5 hover:bg-white/10 hover:border-neon-pink/30 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(255,0,128,0.15)] transition-all duration-500 relative">

                {/* Image Area */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  {post.cover_image ? (
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <span className="text-4xl opacity-50">⚡</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-neon-blue text-[10px] font-bold border border-white/10 uppercase tracking-wider">
                      {post.tags?.[0] || "Article"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1 relative">
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">
                    <span className="text-neon-pink">{new Date(post.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{post.read_time || '5 min'} read</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2 leading-tight group-hover:text-neon-pink transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-8 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center overflow-hidden relative">
                        {post.author_image ? <Image src={post.author_image} alt="" fill className="object-cover" /> : <User className="w-3 h-3 text-gray-400" />}
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{post.author_name || 'ElecZen Team'}</span>
                    </div>
                    <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 group-hover:gap-3 transition-all">
                      Read Article <ArrowRight className="w-3 h-3 text-neon-pink" />
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
