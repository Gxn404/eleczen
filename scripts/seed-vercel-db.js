const { db } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function seed() {
    const client = await db.connect();

    try {
        // Create table
        await client.sql`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        cover_image TEXT,
        author_name TEXT,
        author_image TEXT,
        tags TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
        console.log('Created "posts" table');

        // Seed data
        const posts = [
            {
                slug: 'understanding-mosfets',
                title: 'Understanding MOSFETs in Power Electronics',
                content: `
# Understanding MOSFETs

MOSFETs (Metal-Oxide-Semiconductor Field-Effect Transistors) are fundamental components in modern electronics...

## Key Characteristics
- High input impedance
- Fast switching speed
- Voltage controlled

## Applications
1. Power supplies
2. Motor controllers
3. Digital logic
        `,
                excerpt: 'A comprehensive guide to working with MOSFETs in power circuits.',
                cover_image: 'https://images.unsplash.com/photo-1555664424-778a69022365?q=80&w=2000&auto=format&fit=crop',
                author_name: 'Dr. Electro',
                author_image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Electro',
                tags: ['Electronics', 'Components', 'Power']
            },
            {
                slug: 'esp32-getting-started',
                title: 'Getting Started with ESP32 Development',
                content: `
# ESP32 Development Guide

The ESP32 is a powerful microcontroller with integrated Wi-Fi and Bluetooth...

## Features
- Dual-core processor
- Rich peripheral set
- Low power consumption

## First Project: Blinking LED
\`\`\`cpp
void setup() {
  pinMode(2, OUTPUT);
}

void loop() {
  digitalWrite(2, HIGH);
  delay(1000);
  digitalWrite(2, LOW);
  delay(1000);
}
\`\`\`
        `,
                excerpt: 'Learn how to set up your environment and write your first ESP32 program.',
                cover_image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?q=80&w=2000&auto=format&fit=crop',
                author_name: 'Sarah Circuits',
                author_image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
                tags: ['ESP32', 'IoT', 'Arduino']
            }
        ];

        for (const post of posts) {
            await client.sql`
        INSERT INTO posts (slug, title, content, excerpt, cover_image, author_name, author_image, tags)
        VALUES (${post.slug}, ${post.title}, ${post.content}, ${post.excerpt}, ${post.cover_image}, ${post.author_name}, ${post.author_image}, ${post.tags})
        ON CONFLICT (slug) DO NOTHING;
      `;
        }
        console.log(`Seeded ${posts.length} posts`);

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await client.end();
    }
}

seed();
