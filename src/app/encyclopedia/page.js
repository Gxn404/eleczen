import Breadcrumbs from "@/components/Breadcrumbs";
import EncyclopediaClient from "./EncyclopediaClient";

export default function EncyclopediaListing() {
  return (
    <div className="min-h-screen">
      {/* Breadcrumbs can optionally be moved inside Client Component if desired, but keeping here is fine or inside layout */}
      {/* Assuming the client component handles the layout now including padding */}
      <EncyclopediaClient />
    </div>
  );
}
