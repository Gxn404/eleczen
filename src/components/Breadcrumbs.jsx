"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs({ customCrumbs, className = "" }) {
    const pathname = usePathname();

    // If custom crumbs are provided, use them
    // Otherwise, generate from pathname
    let crumbs = customCrumbs;

    if (!crumbs) {
        const segments = pathname.split("/").filter((segment) => segment !== "");
        crumbs = segments.map((segment, index) => {
            const href = `/${segments.slice(0, index + 1).join("/")}`;
            // Capitalize and replace hyphens
            const label = segment
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());
            return { label, href };
        });
    }

    return (
        <nav aria-label="Breadcrumb" className={`flex ${className}`}>
            <ol className="flex items-center space-x-2">
                <li>
                    <Link
                        href="/"
                        className="text-gray-400 hover:text-white transition-colors flex items-center"
                    >
                        <Home className="w-4 h-4" />
                        <span className="sr-only">Home</span>
                    </Link>
                </li>
                {crumbs.map((crumb, index) => {
                    const isLast = index === crumbs.length - 1;
                    return (
                        <li key={crumb.href} className="flex items-center">
                            <ChevronRight className="w-4 h-4 text-gray-600 mx-1" />
                            {isLast ? (
                                <span
                                    className="text-neon-blue font-medium truncate max-w-[200px] md:max-w-xs"
                                    aria-current="page"
                                >
                                    {crumb.label}
                                </span>
                            ) : (
                                <Link
                                    href={crumb.href}
                                    className="text-gray-400 hover:text-white transition-colors truncate max-w-[150px]"
                                >
                                    {crumb.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
