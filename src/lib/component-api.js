import dbConnect from "../../api/src/app/lib/db";
import Component from "../../api/src/app/lib/models/Component";

export async function getComponents(query = {}) {
    await dbConnect();

    // Build filter based on query
    const filter = {};
    if (query.search) {
        filter.$or = [
            { name: { $regex: query.search, $options: "i" } },
            { description: { $regex: query.search, $options: "i" } },
            { category: { $regex: query.search, $options: "i" } },
        ];
    }
    if (query.category) {
        filter.category = query.category;
    }

    const components = await Component.find(filter).sort({ name: 1 });
    return JSON.parse(JSON.stringify(components));
}

export async function getComponentBySlug(slug) {
    await dbConnect();
    const component = await Component.findOne({ slug });

    if (component) {
        return JSON.parse(JSON.stringify(component));
    }

    // Fallback: Here we could call an external API like Octopart
    // For now, return null
    return null;
}

export async function getCategories() {
    await dbConnect();
    const categories = await Component.distinct("category");
    return categories.sort();
}
