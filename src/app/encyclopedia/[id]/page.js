import { ArrowLeft, Cpu, Layers, Zap } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Component from "@/models/Component";

export const dynamic = 'force-dynamic';

async function getComponent(id) {
  await dbConnect();
  try {
    const component = await Component.findById(id);
    if (!component) return null;
    return JSON.parse(JSON.stringify(component));
  } catch (e) {
    return null;
  }
}

export default async function ComponentDetail({ params }) {
  const { id } = await params;
  const component = await getComponent(id);

  if (!component) {
    notFound();
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/encyclopedia"
          className="inline-flex items-center text-gray-400 hover:text-neon-green mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Encyclopedia
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-panel rounded-2xl p-8 border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Cpu className="h-64 w-64 text-white" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-3 py-1 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/20 text-sm font-medium">
                    {component.category}
                  </span>
                  <span className="text-gray-500 text-sm">
                    ID: {component._id}
                  </span>
                </div>

                <h1 className="text-4xl font-bold text-white mb-6">
                  {component.name}
                </h1>

                <div className="prose prose-invert max-w-none text-gray-300">
                  <p className="text-lg leading-relaxed">
                    {component.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="glass-panel rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Layers className="mr-2 h-6 w-6 text-neon-blue" />{" "}
                Specifications
              </h2>

              {component.specifications &&
                Object.keys(component.specifications).length > 0
                ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(component.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center p-4 rounded-lg bg-white/5 border border-white/5"
                      >
                        <span className="text-gray-400 font-medium">
                          {key}
                        </span>
                        <span className="text-white font-mono">{value}</span>
                      </div>
                    ),
                  )}
                </div>
                : <p className="text-gray-500 italic">
                  No detailed specifications available.
                </p>}
            </div>
          </div>

          {/* Right Column: Symbol/Visuals */}
          <div className="space-y-8">
            <div className="glass-panel rounded-2xl p-8 border border-white/10 flex flex-col items-center justify-center min-h-[300px]">
              <h2 className="text-xl font-bold text-gray-400 mb-8 w-full text-left flex items-center">
                <Zap className="mr-2 h-5 w-5" /> Symbol
              </h2>

              {component.symbol
                ? <img
                  src={component.symbol}
                  alt={`${component.name} symbol`}
                  className="max-w-full max-h-64 filter invert opacity-90"
                />
                : <div className="w-48 h-48 rounded-full bg-gradient-to-b from-gray-800 to-black flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  <span className="text-gray-600 text-sm">
                    No Symbol Image
                  </span>
                </div>}
            </div>

            {/* Actions or Related */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
              <button className="w-full py-3 px-4 rounded-xl bg-neon-blue/10 text-neon-blue border border-neon-blue/20 hover:bg-neon-blue/20 transition-all duration-300 font-medium mb-3">
                Add to Circuit Design
              </button>
              <button className="w-full py-3 px-4 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-all duration-300 font-medium">
                Download Datasheet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
