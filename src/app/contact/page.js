import { Mail, MapPin, Phone, Send } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
    title: "Contact Us | ElecZen",
    description: "Get in touch with the ElecZen team for support, feedback, or inquiries.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Breadcrumbs className="mb-8" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Let's build something <br />
                            <span className="text-neon-blue neon-text">amazing together</span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                            Have a question, suggestion, or just want to say hi? We'd love to hear from you.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                    <Mail className="w-6 h-6 text-neon-blue" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Email Us</h3>
                                    <p className="text-gray-400">support@eleczen.app</p>
                                    <p className="text-gray-400">partnerships@eleczen.app</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                    <MapPin className="w-6 h-6 text-neon-purple" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Location</h3>
                                    <p className="text-gray-400">123 Innovation Drive</p>
                                    <p className="text-gray-400">Tech City, TC 90210</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                    <Phone className="w-6 h-6 text-neon-pink" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Call Us</h3>
                                    <p className="text-gray-400">+1 (555) 123-4567</p>
                                    <p className="text-gray-500 text-sm">Mon-Fri, 9am-6pm EST</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="glass-panel p-8 rounded-2xl border border-white/10">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                                <select className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all">
                                    <option>General Inquiry</option>
                                    <option>Support Request</option>
                                    <option>Partnership</option>
                                    <option>Feedback</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                                <textarea
                                    rows={4}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all resize-none"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 rounded-xl bg-neon-blue text-black font-bold text-lg hover:bg-white transition-all shadow-[0_0_20px_rgba(0,243,255,0.3)] flex items-center justify-center gap-2"
                            >
                                Send Message <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
