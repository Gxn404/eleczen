export const metadata = {
  title: "Component Encyclopedia | ElecZen",
  description:
    "Search thousands of electronic components, view pinouts, specifications, and find alternatives in our comprehensive database.",
  openGraph: {
    title: "Component Encyclopedia | ElecZen",
    description:
      "Search thousands of electronic components, view pinouts, specifications, and find alternatives in our comprehensive database.",
    url: "https://eleczen.app/encyclopedia",
    siteName: "ElecZen",
    images: ["/eleczen_512.png"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Component Encyclopedia | ElecZen",
    description:
      "Search thousands of electronic components, view pinouts, specifications, and find alternatives in our comprehensive database.",
    images: ["/eleczen_512.png"],
  },
};

export default function EncyclopediaLayout({ children }) {
  return children;
}
