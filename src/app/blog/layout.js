export const metadata = {
  title: "Electronics Blog & Tutorials | ElecZen",
  description:
    "Learn from community experts. Read tutorials, project breakdowns, and deep dives into electronics theory.",
  openGraph: {
    title: "Electronics Blog & Tutorials | ElecZen",
    description:
      "Learn from community experts. Read tutorials, project breakdowns, and deep dives into electronics theory.",
    url: "https://eleczen.app/blog",
    siteName: "ElecZen",
    images: ["/eleczen_512.png"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Electronics Blog & Tutorials | ElecZen",
    description:
      "Learn from community experts. Read tutorials, project breakdowns, and deep dives into electronics theory.",
    images: ["/eleczen_512.png"],
  },
};

export default function BlogLayout({ children }) {
  return children;
}
