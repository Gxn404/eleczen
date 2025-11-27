"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Cpu, Loader2 } from "lucide-react";

export default function AdminComponentsPage() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComponents();
  }, []);

  async function fetchComponents() {
    try {
      const res = await fetch("/api/encyclopedia");
      const data = await res.json();
      if (data.success) {
        setComponents(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch components", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteComponent(id) {
    if (!confirm("Are you sure you want to delete this component?")) return;

    try {
      const res = await fetch(`/api/encyclopedia/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setComponents(components.filter((c) => c._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete component", error);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-neon-green" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Cpu className="text-neon-green" /> Components
        </h1>
        <Link href="/admin/components/new">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-green text-black font-bold hover:bg-neon-green/90 transition-all">
            <Plus className="w-4 h-4" /> Add Component
          </button>
        </Link>
      </div>

      <div className="glass-panel rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-400 text-sm uppercase">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {components.map((comp) => (
              <tr key={comp._id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-white font-medium">{comp.name}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300">
                    {comp.category}
                  </span>
                </td>
                <td className="p-4 text-gray-400 max-w-md truncate">
                  {comp.description}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-neon-green transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteComponent(comp._id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {components.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">
                  No components found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
