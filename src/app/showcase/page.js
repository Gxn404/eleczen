'use client';

import { useState } from 'react';
import { Heart, MessageSquare, Share2, Eye } from 'lucide-react';

const PROJECTS = [
    {
        id: 1,
        title: "Arduino Weather Station",
        author: "Alex Chen",
        image: "https://images.unsplash.com/photo-1555664424-778a69022365?w=800&auto=format&fit=crop&q=60",
        likes: 124,
        views: 1205,
        tags: ["Arduino", "IoT", "Sensors"]
    },
    {
        id: 2,
        title: "DIY Bluetooth Speaker",
        author: "Sarah Jones",
        image: "https://images.unsplash.com/photo-1558403194-611308249627?w=800&auto=format&fit=crop&q=60",
        likes: 89,
        views: 850,
        tags: ["Audio", "Bluetooth", "PCB"]
    },
    {
        id: 3,
        title: "Solar Charge Controller",
        author: "Mike Ross",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=60",
        likes: 256,
        views: 3400,
        tags: ["Power", "Solar", "MPPT"]
    },
    {
        id: 4,
        title: "Home Automation Hub",
        author: "Emily White",
        image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&auto=format&fit=crop&q=60",
        likes: 167,
        views: 1900,
        tags: ["ESP32", "Home Assistant", "WiFi"]
    }
];

export default function ShowcasePage() {
    const [projects, setProjects] = useState(PROJECTS);

    const handleLike = (id) => {
        setProjects(projects.map(p =>
            p.id === id ? { ...p, likes: p.likes + 1 } : p
        ));
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Community <span className="text-neon-pink">Showcase</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                        Discover amazing projects built by the ElecZen community.
                    </p>
                    <button className="px-8 py-3 rounded-xl bg-neon-pink text-black font-bold hover:bg-white transition-all shadow-[0_0_20px_rgba(255,0,128,0.3)]">
                        Submit Your Project
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div key={project.id} className="glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-neon-pink/30 transition-all group">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <div className="flex gap-2">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 rounded-md bg-neon-pink/20 text-neon-pink text-xs font-bold backdrop-blur-sm border border-neon-pink/20">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-pink transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-4">by {project.author}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handleLike(project.id)}
                                            className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Heart className="w-4 h-4" />
                                            <span className="text-xs">{project.likes}</span>
                                        </button>
                                        <div className="flex items-center gap-1 text-gray-400">
                                            <Eye className="w-4 h-4" />
                                            <span className="text-xs">{project.views}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="text-gray-400 hover:text-white transition-colors">
                                            <MessageSquare className="w-4 h-4" />
                                        </button>
                                        <button className="text-gray-400 hover:text-white transition-colors">
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
