"use client";

import Link from "next/link";
import { Zap, Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl mt-20 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-neon-blue/20 flex items-center justify-center border border-neon-blue/50 shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                <Zap className="w-5 h-5 text-neon-blue" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                ElecZen
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              The ultimate platform for electronics engineers. Design, simulate,
              and discover components with AI-powered tools.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/encyclopedia"
                  className="hover:text-neon-blue transition-colors"
                >
                  Encyclopedia
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  className="hover:text-neon-blue transition-colors"
                >
                  Tools & Calculators
                </Link>
              </li>
              <li>
                <Link
                  href="/showcase"
                  className="hover:text-neon-blue transition-colors"
                >
                  Community Showcase
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-neon-blue transition-colors"
                >
                  Engineering Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/about"
                  className="hover:text-neon-blue transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-neon-blue transition-colors"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-neon-blue transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-neon-blue transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold mb-4">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest tools and tutorials delivered to your inbox.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue w-full"
              />
              <button className="p-2 rounded-lg bg-neon-blue text-black hover:bg-white transition-colors">
                <Mail className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ElecZen. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
