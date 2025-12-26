import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, ExternalLink, Zap } from "lucide-react";
import dbConnect from "@/lib/db";
import Component from "@/models/Component";
import Breadcrumbs from "@/components/Breadcrumbs";
import ComponentDetailClient from "./ComponentDetailClient";

// Server Component
async function getComponent(id) {
    await dbConnect();
    try {
        const component = await Component.findById(id);
        if (!component) return null;
        return JSON.parse(JSON.stringify(component));
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params; // slug here is actually the ID based on file structure, but let's assume it's ID for now
    const component = await getComponent(slug);

    if (!component) {
        return { title: "Component Not Found" };
    }

    return {
        title: `${component.name} Datasheet & Specs | ElecZen`,
        description: component.description,
    };
}

export default async function ComponentPage({ params }) {
    const { slug } = await params; // This is the [slug] param, which is the ID in the link
    const component = await getComponent(slug);

    if (!component) {
        notFound();
    }

    return (
        <div className="min-h-screen">
            <Breadcrumbs
                className="mb-8 p-8 max-w-7xl mx-auto pb-0"
                customCrumbs={[
                    { label: "Encyclopedia", href: "/encyclopedia" },
                    { label: component.name, href: "#" }
                ]}
            />
            <ComponentDetailClient component={component} />
        </div>
    );
}

function ActivityIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    );
}
