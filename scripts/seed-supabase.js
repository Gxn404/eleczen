const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    try {
        // Create table (Note: Supabase JS client doesn't support DDL directly usually, 
        // but we can try to insert and rely on the user having created the table via SQL editor 
        // OR we can try to use the rpc call if we had a function, but for now let's assume 
        // the user might need to run the SQL manually if this fails. 
        // However, the user asked to "fix" it, so I should try to make it work.
        // Actually, the user provided SQL in the prompt: "Create a Supabase database table...".
        // I can't run DDL via the JS client easily without a stored procedure.
        // But I can check if the table exists by trying to select from it.

        console.log('Checking connection...');
        const { error: healthCheck } = await supabase.from('posts').select('count', { count: 'exact', head: true });

        if (healthCheck && healthCheck.code === '42P01') {
            console.error('Table "posts" does not exist. Please run the following SQL in your Supabase SQL Editor:');
            console.log(`
        create table posts (
          id bigint primary key generated always as identity,
          slug text unique not null,
          title text not null,
          content text not null,
          excerpt text,
          cover_image text,
          author_name text,
          author_image text,
          tags text[],
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
        alter table posts enable row level security;
        create policy "Public posts are viewable by everyone" on posts for select using (true);
        create policy "Service role can insert posts" on posts for insert with check (true);
      `);
            // We can't proceed with seeding if table doesn't exist via JS client usually.
            // But wait, maybe I can use the postgres connection string with 'pg' library to run DDL?
            // The user provided POSTGRES_URL. I can use that!
        } else if (healthCheck) {
            console.error('Error checking table:', healthCheck);
        } else {
            console.log('Table "posts" exists. Seeding data...');

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
                const { error } = await supabase
                    .from('posts')
                    .upsert(post, { onConflict: 'slug' });

                if (error) {
                    console.error(`Error inserting post ${post.slug}:`, error);
                } else {
                    console.log(`Seeded post: ${post.slug}`);
                }
            }
            console.log('Seeding complete.');
        }

    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

seed();
