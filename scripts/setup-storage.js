import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function setupStorage() {
    console.log('Setting up storage buckets...');

    const bucketName = 'libraries';

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
        console.error('Error listing buckets:', listError);
        return;
    }

    const bucketExists = buckets.find(b => b.name === bucketName);

    if (bucketExists) {
        console.log(`Bucket "${bucketName}" already exists.`);
    } else {
        console.log(`Creating bucket "${bucketName}"...`);
        const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
            public: false,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ['text/plain', 'application/octet-stream', 'application/zip']
        });

        if (createError) {
            console.error(`Error creating bucket "${bucketName}":`, createError);
        } else {
            console.log(`Bucket "${bucketName}" created successfully.`);
        }
    }
}

setupStorage();
