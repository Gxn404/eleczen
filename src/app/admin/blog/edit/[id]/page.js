"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function EditBlogPostPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        coverImage: "",
        tags: "",
    });

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            // We can reuse the public API or create a specific admin one.
            // For now, let's assume we can fetch by ID via a new endpoint or reusing existing logic if available.
            // Since we don't have a direct "get by ID" API exposed yet for client, I'll assume we need to add one or use server actions.
            // For simplicity in this task, I'll fetch via the public blog API if possible, or just mock the data fetch if API is missing.
            // Wait, I didn't create a GET /api/blog/[id] route.
            // I'll assume for this task I should have created it or I'll use a server action.
            // Let's try to fetch from the blog list and filter (inefficient but works for small apps) or better, add a route.
            // Actually, I'll add a quick fetch to the existing blog route if I can, or just assume I can fetch it.
            // Let's use a direct fetch to a new endpoint I'll create implicitly or just handle it here.
            // I'll create a simple GET route for this page in the same step if needed, but let's try to hit /api/blog?id={id} if I modify the blog route.
            // I'll just assume I can fetch it for now to scaffold the UI.

            // REALITY CHECK: I need to fetch the post data.
            // I will assume there is an endpoint or I will create a simple one.
            // Let's assume I can fetch `/api/blog/${id}` (I'll need to ensure this route exists or create it).
            // I'll create the route `src/app/api/blog/[id]/route.js` in the next tool call if it doesn't exist.

            const res = await fetch(`/api/blog/${id}`);
            if (!res.ok) throw new Error("Failed to fetch post");
            const post = await res.json();

            setFormData({
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt || "",
                content: post.content,
                coverImage: post.coverImage || "",
                tags: post.tags ? post.tags.join(", ") : "",
            });
        } catch (error) {
            console.error(error);
            toast.error("Could not load post");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/blog/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
                }),
            });

            if (!res.ok) throw new Error("Failed to update post");

            toast.success("Post updated successfully");
            router.push("/admin/blog");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update post");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-neon-blue animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/blog"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-400" />
                </Link>
                <h1 className="text-3xl font-bold text-white">Edit Post</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="glass-panel p-6 rounded-xl border border-white/10 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Slug
                            </label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Tags (comma separated)
                            </label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none"
                                placeholder="electronics, arduino, tutorial"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Excerpt
                        </label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none h-24 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Cover Image URL
                        </label>
                        <input
                            type="text"
                            value={formData.coverImage}
                            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Content (Markdown)
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none h-96 font-mono text-sm"
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-neon-blue text-black font-bold rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)]"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
