import { NextResponse } from "next/server";
import { supabase } from "../../../../supabase/supabase";
import { auth } from "@/auth";


/**
 * @swagger
 * /api/blog:
 *   get:
 *     tags:
 *       - Blog
 *     summary: Get all blog posts
 *     description: Retrieve a list of all blog posts, ordered by creation date (newest first)
 *     responses:
 *       200:
 *         description: List of blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BlogPost'
 *       500:
 *         $ref: '#/components/responses/NotFoundError'
 */
export async function GET(request) {
    try {
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching posts:", error);
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}


/**
 * @swagger
 * /api/blog:
 *   post:
 *     tags:
 *       - Blog
 *     summary: Create a new blog post
 *     description: Create a new blog post. Requires authentication.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Understanding Op-Amps"
 *               slug:
 *                 type: string
 *                 example: "understanding-op-amps"
 *               content:
 *                 type: string
 *                 description: Markdown content
 *                 example: "# Introduction\n\nOperational amplifiers..."
 *               excerpt:
 *                 type: string
 *                 example: "A comprehensive guide to op-amps"
 *               cover_image:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/image.jpg"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["electronics", "op-amp", "tutorial"]
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/NotFoundError'
 */
export async function POST(request) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { slug, title, content, excerpt, cover_image, tags } = body;

        // Auto-generate author info from session if not provided
        const author_name = session.user?.name || "ElecZen Team";
        const author_image = session.user?.image || null;

        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    slug,
                    title,
                    content,
                    excerpt,
                    cover_image,
                    tags,
                    author_name,
                    author_image,
                }
            ])
            .select()
            .single();

        if (error) {
            console.error("Error creating post:", error);
            return NextResponse.json({ message: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
