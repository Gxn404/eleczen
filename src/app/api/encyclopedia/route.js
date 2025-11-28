import { NextResponse } from "next/server";
import { getComponents } from "@/lib/component-api";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    const components = await getComponents({ search, category });

    // Return array directly to match blog pattern or wrap in object if preferred
    // The client expects { success: true, data: [...] } based on previous code, 
    // but let's stick to simple array for consistency with new blog API if possible.
    // However, the client code I saw expects `data.success`. I'll update client to handle array or object.
    // Actually, let's just return the array directly like the blog API.

    return NextResponse.json(components);
  } catch (error) {
    console.error("Error fetching components:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
