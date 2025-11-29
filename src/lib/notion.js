import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export const saveCircuit = async (name, circuitData) => {
    if (!process.env.NOTION_DATABASE_ID) {
        throw new Error("NOTION_DATABASE_ID is not defined");
    }

    try {
        const response = await notion.pages.create({
            parent: { database_id: process.env.NOTION_DATABASE_ID },
            properties: {
                Name: {
                    title: [
                        {
                            text: {
                                content: name,
                            },
                        },
                    ],
                },
                // Assuming a 'Data' text property exists, or we store it in the page content
                // For now, let's store it as a code block in the page content
            },
            children: [
                {
                    object: "block",
                    type: "code",
                    code: {
                        language: "json",
                        rich_text: [
                            {
                                type: "text",
                                text: {
                                    content: JSON.stringify(circuitData, null, 2),
                                },
                            },
                        ],
                    },
                },
            ],
        });
        return response;
    } catch (error) {
        console.error("Error saving circuit to Notion:", error);
        throw error;
    }
};

export const getPublishedPosts = async () => {
    const token = process.env.NOTION_TOKEN;
    if (!token || !process.env.NOTION_DATABASE_ID) {
        console.warn("Notion Token or Database ID not found.");
        return [];
    }

    try {
        const response = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
        });

        return response.results.map((post) => {
            return {
                _id: post.id,
                title: post.properties.Name?.title[0]?.plain_text || "Untitled",
                createdAt: post.created_time,
                updatedAt: post.last_edited_time,
            };
        });
    } catch (error) {
        console.error("Error fetching Notion posts:", error);
        return [];
    }
};

export const getPostBySlug = async (slug) => {
    if (!process.env.NOTION_DATABASE_ID) {
        throw new Error("NOTION_DATABASE_ID is not defined");
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

        if (!response.results.length) {
            return null;
        }

        const page = response.results[0];
        const mdblocks = await n2m.pageToMarkdown(page.id);
        const mdString = n2m.toMarkdownString(mdblocks);

        return {
            _id: page.id,
            title: page.properties.Name?.title[0]?.plain_text || "Untitled",
            slug: page.properties.Slug?.rich_text[0]?.plain_text || slug,
            createdAt: page.created_time,
            updatedAt: page.last_edited_time,
            content: mdString.parent,
            coverImage: page.cover?.external?.url || page.cover?.file?.url || null,
            tags: page.properties.Tags?.multi_select?.map((tag) => tag.name) || [],
            author: {
                name: "ElecZen Author",
                image: null,
            },
        };
    } catch (error) {
        console.error(`Error fetching post by slug ${slug}:`, error);
        return null;
    }
};
