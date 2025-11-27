"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function NewComponentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    symbol: "",
  });
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const addSpec = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const removeSpec = (index) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert specs array to object map
      const specifications = specs.reduce((acc, curr) => {
        if (curr.key && curr.value) {
          acc[curr.key] = curr.value;
        }
        return acc;
      }, {});

      const componentData = {
        ...formData,
        specifications,
      };

      const res = await fetch("/api/encyclopedia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(componentData),
      });

      if (res.ok) {
        router.push("/admin/components");
        router.refresh();
      } else {
        alert("Failed to create component");
      }
    } catch (error) {
      console.error("Error creating component:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/components"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <h1 className="text-3xl font-bold text-white">Add New Component</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-panel rounded-xl p-8 border border-white/10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Component Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green transition-colors"
                required
              >
                <option value="" className="bg-black">
                  Select Category
                </option>
                <option value="Resistor" className="bg-black">
                  Resistor
                </option>
                <option value="Capacitor" className="bg-black">
                  Capacitor
                </option>
                <option value="Inductor" className="bg-black">
                  Inductor
                </option>
                <option value="Diode" className="bg-black">
                  Diode
                </option>
                <option value="Transistor" className="bg-black">
                  Transistor
                </option>
                <option value="IC" className="bg-black">
                  Integrated Circuit
                </option>
                <option value="Sensor" className="bg-black">
                  Sensor
                </option>
                <option value="Other" className="bg-black">
                  Other
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Symbol URL (Optional)
            </label>
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-400">
                Specifications
              </label>
              <button
                type="button"
                onClick={addSpec}
                className="text-xs flex items-center gap-1 text-neon-green hover:text-white transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Spec
              </button>
            </div>
            <div className="space-y-3">
              {specs.map((spec, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Key (e.g. Voltage)"
                    value={spec.key}
                    onChange={(e) =>
                      handleSpecChange(index, "key", e.target.value)
                    }
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neon-green transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 5V)"
                    value={spec.value}
                    onChange={(e) =>
                      handleSpecChange(index, "value", e.target.value)
                    }
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neon-green transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(index)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-neon-green text-black font-bold hover:bg-neon-green/90 transition-all disabled:opacity-50"
          >
            {loading
              ? <Loader2 className="animate-spin w-5 h-5" />
              : <Save className="w-5 h-5" />}
            Save Component
          </button>
        </div>
      </form>
    </div>
  );
}
