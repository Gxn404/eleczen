'use client';

import { useState, useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { Code, Book, Zap, Shield, Database, FileCode } from 'lucide-react';

export default function ApiDoc() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="text-neon-blue text-xl">Loading API Documentation...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-neon-blue/10 rounded-lg border border-neon-blue/20">
                                <Code className="w-6 h-6 text-neon-blue" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    ElecZen <span className="text-neon-blue">API</span>
                                </h1>
                                <p className="text-sm text-gray-400">v2.0.0 - Comprehensive API Documentation</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <a
                                href="/"
                                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                            >
                                Home
                            </a>
                            <a
                                href="/design"
                                className="px-4 py-2 bg-neon-blue/10 text-neon-blue border border-neon-blue/20 rounded-lg text-sm font-bold hover:bg-neon-blue hover:text-black transition-all"
                            >
                                Try Simulator
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Quick Links Banner */}
            <div className="bg-black/60 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { icon: Zap, label: 'Circuits', color: 'yellow' },
                            { icon: Database, label: 'Components', color: 'blue' },
                            { icon: FileCode, label: 'Library', color: 'green' },
                            { icon: Book, label: 'Blog', color: 'purple' },
                            { icon: Shield, label: 'Auth', color: 'red' },
                            { icon: Code, label: 'Admin', color: 'orange' }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-neon-blue/50 transition-all cursor-pointer group"
                            >
                                <item.icon className="w-5 h-5 text-gray-400 group-hover:text-neon-blue transition-colors" />
                                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-neon-blue/10 to-transparent border border-neon-blue/20 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-neon-blue/20 rounded-lg">
                                <Shield className="w-5 h-5 text-neon-blue" />
                            </div>
                            <h3 className="font-bold text-white">Authentication</h3>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Secure JWT-based authentication. Include your token in the Authorization header for protected endpoints.
                        </p>
                        <div className="mt-4 p-3 bg-black/40 rounded-lg border border-white/10">
                            <code className="text-xs text-neon-blue font-mono">
                                Authorization: Bearer &lt;token&gt;
                            </code>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                                <Zap className="w-5 h-5 text-green-500" />
                            </div>
                            <h3 className="font-bold text-white">Rate Limits</h3>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            100 requests per minute for authenticated users. 20 requests per minute for anonymous users.
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                            <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                                <div className="h-full w-3/4 bg-gradient-to-r from-green-500 to-green-400"></div>
                            </div>
                            <span>75/100</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <Database className="w-5 h-5 text-purple-500" />
                            </div>
                            <h3 className="font-bold text-white">Response Format</h3>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            All responses are in JSON format with consistent error handling and status codes.
                        </p>
                        <div className="mt-4 flex gap-2">
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30">200 OK</span>
                            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/30">400 Error</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Swagger UI Container */}
            <div className="max-w-7xl mx-auto px-6 pb-12">
                <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
                    <div className="swagger-container custom-swagger">
                        <SwaggerUI url="/api/swagger" />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-black/40 mt-12">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-400">
                            © 2024 ElecZen. Built with Next.js and Supabase.
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="/docs" className="text-sm text-gray-400 hover:text-neon-blue transition-colors">
                                Documentation
                            </a>
                            <a href="/support" className="text-sm text-gray-400 hover:text-neon-blue transition-colors">
                                Support
                            </a>
                            <a href="/changelog" className="text-sm text-gray-400 hover:text-neon-blue transition-colors">
                                Changelog
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Custom Swagger Styles */}
            <style jsx global>{`
                .custom-swagger {
                    background: transparent !important;
                }
                
                .custom-swagger .swagger-ui {
                    filter: invert(1) hue-rotate(180deg);
                }
                
                .custom-swagger .swagger-ui .opblock-tag {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .custom-swagger .swagger-ui .opblock {
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    margin-bottom: 16px;
                }
                
                .custom-swagger .swagger-ui .opblock.opblock-get {
                    border-left: 4px solid #00f3ff;
                }
                
                .custom-swagger .swagger-ui .opblock.opblock-post {
                    border-left: 4px solid #10b981;
                }
                
                .custom-swagger .swagger-ui .opblock.opblock-put {
                    border-left: 4px solid #f59e0b;
                }
                
                .custom-swagger .swagger-ui .opblock.opblock-delete {
                    border-left: 4px solid #ef4444;
                }
                
                .custom-swagger .swagger-ui .info {
                    background: transparent;
                }
                
                .custom-swagger .swagger-ui .scheme-container {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 16px;
                }
            `}</style>
        </div>
    );
}
