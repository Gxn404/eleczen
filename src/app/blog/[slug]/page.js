import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

// Server Component for SEO and initial data
async function getPost(slug) {
  await dbConnect();
  const post = await Post.findOne({ slug }).populate("author", "name image");
  if (!post) return null;
  return JSON.parse(JSON.stringify(post)); // Serialize for client
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160) + "...",
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160) + "...",
      type: "article",
      publishedTime: post.createdAt,
      authors: [post.author?.name || "ElecZen Author"],
      tags: post.tags,
      images: [
        {
          url: post.coverImage || "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.content.substring(0, 160) + "...",
      images: [post.coverImage || "/og-image.jpg"],
    },
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.coverImage || "https://eleczen.com/og-image.jpg",
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author?.name || "ElecZen Author",
    },
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <JsonLd data={jsonLd} />
      <article className="max-w-4xl mx-auto glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        <div className="relative h-64 md:h-96 w-full">
          {post.coverImage
            ? <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            : <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <span className="text-6xl">⚡</span>
              </div>}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex gap-2 mb-4">
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-neon-blue/20 text-neon-blue border border-neon-blue/30 text-sm font-medium backdrop-blur-md"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                  {post.author?.image
                    ? <img src={post.author.image} alt={post.author.name} />
                    : <div className="w-full h-full flex items-center justify-center bg-neon-purple/20 text-neon-purple font-bold">
                        {post.author?.name?.[0] || "A"}
                      </div>}
                </div>
                <span className="font-medium">
                  {post.author?.name || "Anonymous"}
                </span>
              </div>
              <span>•</span>
              <time>{new Date(post.createdAt).toLocaleDateString()}</time>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 prose prose-invert prose-lg max-w-none">
          {/* Simple rendering for now. In real app, use a Markdown renderer */}
          <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
            {post.content}
          </div>
        </div>
      </article>
    </div>
  );
}
