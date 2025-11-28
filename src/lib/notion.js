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
            // Removed specific filter to be more generic or assume the user's DB matches
            // If this is a new DB, it might not have "Published" property.
            // Let's keep it safe and just query everything for now, or check if we should filter.
            // Given the user gave a new DB ID, let's assume it might be empty or different.
            // For safety, I'll comment out the filter for now or make it optional.
        });

        return response.results.map((post) => {
            return {
                _id: post.id,
                title: post.properties.Name?.title[0]?.plain_text || "Untitled",
                // Handle missing properties gracefully
                createdAt: post.created_time,
                updatedAt: post.last_edited_time,
            };
        });
    } catch (error) {
        console.error("Error fetching Notion posts:", error);
        return [];
    }
};
