import { NextResponse } from "next/server";
import { getComponents } from "@/lib/component-api";

/**
 * @swagger
 * /api/encyclopedia:
 *   get:
 *     tags:
 *       - Encyclopedia
 *     summary: Search electronics encyclopedia
 *     description: Search for electronic components and concepts in the knowledge base
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query
 *         example: "resistor"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [passive, active, digital, analog, power, sensors]
 *         description: Filter by category
 *         example: "passive"
 *     responses:
 *       200:
 *         description: List of encyclopedia entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                     example: "Resistor"
 *                   description:
 *                     type: string
 *                     example: "A passive two-terminal electrical component..."
 *                   category:
 *                     type: string
 *                     example: "passive"
 *                   image:
 *                     type: string
 *                     format: uri
 *                   content:
 *                     type: string
 *                     description: Detailed content in markdown
 *       500:
 *         $ref: '#/components/responses/NotFoundError'
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    const components = await getComponents({ search, category });

    return NextResponse.json(components);
  } catch (error) {
    console.error("Error fetching components:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
