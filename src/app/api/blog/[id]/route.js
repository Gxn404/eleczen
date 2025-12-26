import { NextResponse } from "next/server";
import { supabase } from "../../../../../supabase/supabase";
import { auth } from "@/auth";

/**
 * @swagger
 * /api/blog/{id}:
 *   get:
 *     tags:
 *       - Blog
 *     summary: Get a single blog post
 *     description: Retrieve a blog post by ID or slug
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID (numeric) or slug (text)
 *         example: "understanding-op-amps"
 *     responses:
 *       200:
 *         description: Blog post details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/NotFoundError'
 */
export async function GET(request, { params }) {
    try {
        const { id } = await params;

        let query = supabase.from('posts').select('*');

        // Check if id is numeric (for serial ID) or text (slug)
        if (!isNaN(id)) {
            query = query.eq('id', id);
        } else {
            query = query.eq('slug', id);
        }

        const { data: post, error } = await query.single();

        if (error || !post) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ message: "Post not found" }, { status: 404 });
            }
            console.error("Error fetching post:", error);
            return NextResponse.json({ message: error.message }, { status: 500 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/blog/{id}:
 *   put:
 *     tags:
 *       - Blog
 *     summary: Update a blog post
 *     description: Update an existing blog post. Requires authentication.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID or slug
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               content:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               cover_image:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Updated blog post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/NotFoundError'
 */
export async function PUT(request, { params }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        const { slug, title, content, excerpt, cover_image, tags, author_name, author_image } = body;

        const updates = {
            slug, title, content, excerpt, cover_image, tags, author_name, author_image,
            updated_at: new Date().toISOString()
        };

        Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

        let query = supabase.from('posts').update(updates);

        if (!isNaN(id)) {
            query = query.eq('id', id);
        } else {
            query = query.eq('slug', id);
        }

        const { data, error } = await query.select().single();

        if (error) {
            console.error("Error updating post:", error);
            return NextResponse.json({ message: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/blog/{id}:
 *   delete:
 *     tags:
 *       - Blog
 *     summary: Delete a blog post
 *     description: Delete a blog post. Requires authentication and ownership or admin role.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID or slug
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post deleted"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - not the owner
 *       500:
 *         $ref: '#/components/responses/NotFoundError'
 */
export async function DELETE(request, { params }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const isAdmin = session?.user?.role === 'admin';
        const { id } = await params;

        let fetchQuery = supabase.from('posts').select('author_name').maybeSingle();
        if (!isNaN(id)) fetchQuery = fetchQuery.eq('id', id);
        else fetchQuery = fetchQuery.eq('slug', id);

        const { data: postToCheck } = await fetchQuery;

        if (postToCheck) {
            if (!isAdmin && postToCheck.author_name !== (session.user?.name)) {
                return NextResponse.json({ message: "Forbidden" }, { status: 403 });
            }
        }

        let query = supabase.from('posts').delete();
        if (!isNaN(id)) {
            query = query.eq('id', id);
        } else {
            query = query.eq('slug', id);
        }

        const { error } = await query;

        if (error) {
            console.error("Error deleting post:", error);
            return NextResponse.json({ message: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Post deleted" });
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
