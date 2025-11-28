import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export const getPublishedPosts = async () => {
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
        console.warn("Notion API Key or Database ID not found.");
        return [];
    }

    try {
        const response = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
            filter: {
                property: "Published",
                checkbox: {
                    equals: true,
                },
            },
            sorts: [
                {
                    property: "Date",
                    direction: "descending",
                },
            ],
        });

        return response.results.map((post) => {
            return {
                _id: post.id, // Use Notion ID as _id
                title: post.properties.Name.title[0]?.plain_text || "Untitled",
                slug: post.properties.Slug.rich_text[0]?.plain_text || post.id,
                excerpt: post.properties.Excerpt?.rich_text[0]?.plain_text || "",
                coverImage: post.cover?.external?.url || post.cover?.file?.url || null,
                tags: post.properties.Tags?.multi_select?.map((tag) => tag.name) || [],
                createdAt: post.created_time,
                updatedAt: post.last_edited_time,
                author: {
                    name: post.properties.Author?.people[0]?.name || "ElecZen Team",
                    image: post.properties.Author?.people[0]?.avatar_url || null,
                },
                source: "notion",
            };
        });
    } catch (error) {
        console.error("Error fetching Notion posts:", error);
        return [];
    }
};

export const getPostBySlug = async (slug) => {
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
        return null;
    }

    try {
        const response = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
            filter: {
                property: "Slug",
                rich_text: {
                    equals: slug,
                },
            },
        });

        const page = response.results[0];

        if (!page) return null;

        const mdblocks = await n2m.pageToMarkdown(page.id);
        const mdString = n2m.toMarkdownString(mdblocks);

        return {
            _id: page.id,
            title: page.properties.Name.title[0]?.plain_text || "Untitled",
            slug: page.properties.Slug.rich_text[0]?.plain_text || page.id,
            content: mdString.parent, // The markdown content
            excerpt: page.properties.Excerpt?.rich_text[0]?.plain_text || "",
            coverImage: page.cover?.external?.url || page.cover?.file?.url || null,
            tags: page.properties.Tags?.multi_select?.map((tag) => tag.name) || [],
            createdAt: page.created_time,
            updatedAt: page.last_edited_time,
            author: {
                name: page.properties.Author?.people[0]?.name || "ElecZen Team",
                image: page.properties.Author?.people[0]?.avatar_url || null,
            },
            source: "notion",
        };
    } catch (error) {
        console.error("Error fetching Notion post by slug:", error);
        return null;
    }
};
