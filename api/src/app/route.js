import { NextResponse } from 'next/server';

export async function GET() {
    const dashboard = {
        service: "ElecZen API",
        version: "1.0.0",
        status: "operational",
        timestamp: new Date().toISOString(),
        metadata: {
            description: "Core API services for ElecZen Circuit Simulator",
            maintainer: "ElecZen Team",
            license: "MIT",
            icon: "/eleczen.svg",
            logo: "/eleczen_512.png"
        },
        documentation: {
            swagger: "/swagger",
            redoc: "eleczen.app/docs" // assuming exists or placeholder
        },
        endpoints: {
            auth: "/auth",
            admin: "/admin",
            circuits: "/circuits",
            components: "/components",
            library: "/library"
        },
        stats: {
            uptime: "99.9%",
            requests_today: 0, // Mocked for now
            system_load: "low"
        }
    };

    return NextResponse.json(dashboard, { status: 200 });
}
