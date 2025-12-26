export const metadata = {
  title: "Community Showcase | ElecZen",
  description:
    "Explore amazing electronics projects built by the ElecZen community. Share your own creations and get inspired.",
  openGraph: {
    title: "Community Showcase | ElecZen",
    description:
      "Explore amazing electronics projects built by the ElecZen community. Share your own creations and get inspired.",
    url: "https://eleczen.app/projects",
    siteName: "ElecZen",
    images: ["/eleczen_512.png"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Community Showcase | ElecZen",
    description:
      "Explore amazing electronics projects built by the ElecZen community. Share your own creations and get inspired.",
    images: ["/eleczen_512.png"],
  },
};

export default function ShowcaseLayout({ children }) {
  return children;
}
