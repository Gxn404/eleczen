import { CircuitBoard, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/profile");
  }

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto">
      <div className="glass-panel rounded-2xl p-8 md:p-12 border border-white/10">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple p-1 shadow-[0_0_30px_rgba(188,19,254,0.3)]">
            <div className="w-full h-full rounded-full bg-black overflow-hidden relative">
              {session.user.image
                ? <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-full h-full object-cover"
                  />
                : <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white bg-gray-900">
                    {session.user.name?.[0] || "U"}
                  </div>}
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">
              {session.user.name}
            </h1>
            <p className="text-gray-400 text-lg mb-4">{session.user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                Member since {new Date().getFullYear()}
              </span>
              <span className="px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-sm text-neon-blue">
                Pro Plan
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            <Link href="/settings">
              <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white">
                <Settings className="w-4 h-4" /> Settings
              </button>
            </Link>
            <form
              action={async () => {
                "use server";
                const { signOut } = await import("@/auth");
                await signOut();
              }}
            >
              <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <CircuitBoard className="text-neon-green" /> Saved Circuits
            </h2>

            {/* Placeholder for saved circuits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-neon-green/30 transition-all cursor-pointer group"
                >
                  <div className="h-32 bg-black/50 rounded-lg mb-3 flex items-center justify-center border border-white/5">
                    <CircuitBoard className="text-gray-700 group-hover:text-neon-green transition-colors" />
                  </div>
                  <h3 className="font-bold text-white mb-1">
                    Untitled Circuit {i}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Last edited 2 days ago
                  </p>
                </div>
              ))}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 border-dashed flex flex-col items-center justify-center text-gray-500 hover:text-neon-blue hover:border-neon-blue/30 transition-all cursor-pointer h-full min-h-[200px]">
                <span className="text-4xl mb-2">+</span>
                <span>Create New Circuit</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Stats</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Circuits Created</span>
                <span className="text-xl font-bold text-white">12</span>
              </div>
              <div className="w-full h-px bg-white/10" />
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Components Used</span>
                <span className="text-xl font-bold text-white">145</span>
              </div>
              <div className="w-full h-px bg-white/10" />
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Community Posts</span>
                <span className="text-xl font-bold text-white">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
