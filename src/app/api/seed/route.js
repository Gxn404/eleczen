import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Component from "@/models/Component";
import Post from "@/models/Post";

export const dynamic = "force-dynamic";

export async function GET() {
  await dbConnect();

  try {
    // Seed Posts
    const postCount = await Post.countDocuments();
    if (postCount === 0) {
      await Post.create([
        {
          title: "Getting Started with Circuit Simulation",
          slug: "getting-started-circuit-simulation",
          content:
            "Circuit simulation is an essential tool for modern electronics design...",
          excerpt:
            "Learn the basics of simulating electronic circuits before you build them.",
          author: "659664a25d76450e887e7e2f", // Placeholder ID
          tags: ["Tutorial", "Simulation", "Basics"],
          coverImage:
            "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1000&q=80",
        },
        {
          title: "Understanding Op-Amps",
          slug: "understanding-op-amps",
          content:
            "Operational Amplifiers are the building blocks of analog electronics...",
          excerpt:
            "A deep dive into the most versatile component in analog design.",
          author: "659664a25d76450e887e7e2f",
          tags: ["Analog", "Components", "Theory"],
          coverImage:
            "https://images.unsplash.com/photo-1555664424-778a69022365?auto=format&fit=crop&w=1000&q=80",
        },
      ]);
    }

    // Seed Components
    const compCount = await Component.countDocuments();
    if (compCount === 0) {
      await Component.create([
        {
          name: "NE555 Timer",
          category: "IC",
          description:
            "The 555 timer IC is an integrated circuit (chip) used in a variety of timer, delay, pulse generation, and oscillator applications.",
          specifications: {
            "Supply Voltage": "4.5V to 15V",
            "Output Current": "200mA",
            "Max Frequency": "500kHz",
          },
        },
        {
          name: "2N2222",
          category: "Transistor",
          description:
            "The 2N2222 is a common NPN bipolar junction transistor (BJT) used for general purpose low-power amplifying or switching applications.",
          specifications: {
            Type: "NPN",
            "Vce Max": "40V",
            "Ic Max": "800mA",
          },
        },
        {
          name: "10k Resistor",
          category: "Resistor",
          description:
            "A standard 10k Ohm resistor used for pull-ups, voltage dividers, and current limiting.",
          specifications: {
            Resistance: "10k Ohm",
            Tolerance: "5%",
            "Power Rating": "0.25W",
          },
        },
      ]);
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
