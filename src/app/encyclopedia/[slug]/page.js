import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, ExternalLink, Zap } from "lucide-react";
import dbConnect from "@/lib/db";
import Component from "@/models/Component";
import Breadcrumbs from "@/components/Breadcrumbs";

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
        <div className="min-h-screen p-8 max-w-7xl mx-auto">
            <Breadcrumbs
                className="mb-8"
                customCrumbs={[
                    { label: "Encyclopedia", href: "/encyclopedia" },
                    { label: component.name, href: "#" }
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Zap className="w-64 h-64 text-neon-green" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="px-3 py-1 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/20 text-sm font-mono">
                                    {component.category}
                                </span>
                                {component.tags?.map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 neon-text-subtle">
                                {component.name}
                            </h1>

                            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                                {component.description}
                            </p>
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="glass-panel p-8 rounded-2xl border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <ActivityIcon className="w-6 h-6 text-neon-blue" />
                            Specifications
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {component.specifications && Object.entries(component.specifications).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center p-4 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                    <span className="text-gray-400 font-medium">{key}</span>
                                    <span className="text-white font-mono">{value}</span>
                                </div>
                            ))}
                            {(!component.specifications || Object.keys(component.specifications).length === 0) && (
                                <div className="col-span-full text-center py-8 text-gray-500">
                                    No specifications available.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Actions */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4">Resources</h3>
                        <div className="space-y-3">
                            {component.datasheetUrl ? (
                                <a
                                    href={component.datasheetUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-neon-green text-black font-bold hover:bg-white transition-all shadow-[0_0_20px_rgba(10,255,10,0.3)]"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Datasheet
                                </a>
                            ) : (
                                <button disabled className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gray-800 text-gray-500 font-bold cursor-not-allowed">
                                    Datasheet Unavailable
                                </button>
                            )}

                            <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/10">
                                <ExternalLink className="w-5 h-5" />
                                Find Distributors
                            </button>
                        </div>
                    </div>

                    {/* Pinout / Image */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4">Pinout / Diagram</h3>
                        <div className="aspect-square rounded-xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 relative group">
                            {component.pinoutImage ? (
                                <img
                                    src={component.pinoutImage}
                                    alt={`${component.name} pinout`}
                                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <div className="text-center p-6">
                                    <Zap className="w-16 h-16 text-gray-700 mx-auto mb-2" />
                                    <span className="text-gray-500 text-sm">No image available</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
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
