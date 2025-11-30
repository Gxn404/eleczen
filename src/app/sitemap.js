import { createStaticClient } from "@/utils/supabase/static";

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
        '/projects',
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

    try {
        const supabase = createStaticClient();
        const { data: posts } = await supabase.from('posts').select('slug, updated_at');

        if (posts) {
            blogRoutes = posts.map((post) => ({
                url: `${baseUrl}/blog/${post.slug}`,
                lastModified: new Date(post.updated_at),
                changeFrequency: 'weekly',
                priority: 0.8,
            }));
        }
    } catch (error) {
        console.warn("Could not fetch dynamic routes for sitemap:", error.message);
    }

    return [...routes, ...blogRoutes];
}
