import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import Component from "@/models/Component";

export default async function sitemap() {
    // Base URL
    const baseUrl = 'https://eleczen.app';

    // Static Routes
    const routes = [
        '',
        '/login',
        '/signup',
        '/encyclopedia',
        '/tools',
        '/showcase',
        '/blog',
        '/about',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
    }));

    // Dynamic Routes
    let blogRoutes = [];
    let componentRoutes = [];

    try {
        await dbConnect();
        const posts = await Post.find({}).select('slug updatedAt');
        blogRoutes = posts.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        // Dynamic Components (Encyclopedia)
        const components = await Component.find({}).select('_id updatedAt');
        componentRoutes = components.map((comp) => ({
            url: `${baseUrl}/encyclopedia/${comp._id}`,
            lastModified: comp.updatedAt,
            changeFrequency: 'monthly',
            priority: 0.6,
        }));
    } catch (error) {
        console.warn("Could not fetch dynamic routes for sitemap:", error.message);
    }

    return [...routes, ...blogRoutes, ...componentRoutes];
}
