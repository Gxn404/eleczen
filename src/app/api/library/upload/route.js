import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../supabase/supabase-admin';


/**
 * @swagger
 * /api/library/upload:
 *   post:
 *     tags:
 *       - Library
 *     summary: Process and index uploaded component library
 *     description: |
 *       Processes an uploaded component library file (EZC, EZL, or SVG) that has been uploaded to Supabase Storage.
 *       Parses the file content, extracts component metadata, and creates database indexes for searchability.
 *       
 *       **Supported file types:**
 *       - `.ezc` - ElecZen Component definition files
 *       - `.ezl` - ElecZen Library index files  
 *       - `.svg` - Component symbol preview images
 *       
 *       **Process flow:**
 *       1. File is uploaded to Supabase Storage by client
 *       2. Client calls this endpoint with file metadata
 *       3. API fetches file from storage via public URL
 *       4. Parses file content based on type
 *       5. Creates database records in `libraries` and `library_index`
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - filePath
 *               - originalName
 *               - type
 *             properties:
 *               filePath:
 *                 type: string
 *                 description: Path to file in Supabase Storage (relative to 'libraries' bucket)
 *                 example: "components/NE555/NE555.ezc"
 *               originalName:
 *                 type: string
 *                 description: Original filename
 *                 example: "NE555.ezc"
 *               size:
 *                 type: integer
 *                 description: File size in bytes
 *                 example: 2048
 *               type:
 *                 type: string
 *                 enum: [ezc, ezl, svg]
 *                 description: File type
 *                 example: "ezc"
 *               componentName:
 *                 type: string
 *                 description: Component name (for EZC files)
 *                 example: "NE555"
 *               libraryName:
 *                 type: string
 *                 description: Library name
 *                 example: "NE555"
 *           examples:
 *             ezcFile:
 *               summary: EZC Component File
 *               value:
 *                 filePath: "components/NE555/NE555.ezc"
 *                 originalName: "NE555.ezc"
 *                 size: 2048
 *                 type: "ezc"
 *                 componentName: "NE555"
 *                 libraryName: "NE555"
 *             ezlFile:
 *               summary: EZL Library Index
 *               value:
 *                 filePath: "components/NE555/NE555.ezl"
 *                 originalName: "NE555.ezl"
 *                 size: 1024
 *                 type: "ezl"
 *                 libraryName: "NE555"
 *     responses:
 *       200:
 *         description: File processed and indexed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 libraryId:
 *                   type: string
 *                   format: uuid
 *                   description: Created library record ID
 *                 count:
 *                   type: integer
 *                   description: Number of components indexed
 *                   example: 1
 *             examples:
 *               success:
 *                 summary: Successful upload
 *                 value:
 *                   success: true
 *                   libraryId: "550e8400-e29b-41d4-a716-446655440000"
 *                   count: 1
 *       400:
 *         description: Bad request - missing required parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Missing filePath"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Failed to fetch file"
 *               details: "File not found in storage"
 */
export async function POST(request) {
    try {
        const { filePath, originalName, size, type, componentName, libraryName } = await request.json();

        if (!filePath) {
            return NextResponse.json({ error: 'Missing filePath' }, { status: 400 });
        }

        // 1. Get public URL and fetch file content (streaming with cache)
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('libraries')
            .getPublicUrl(filePath);

        const response = await fetch(publicUrl);

        if (!response.ok) {
            console.error('Fetch error:', response.status);
            return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
        }

        const textContent = await response.text();

        // 2. Process based on type
        let libraryType = 'processed';
        let componentCount = 0;
        let metadata = {};
        let indexItems = [];

        if (type === 'ezc') {
            // This is a processed EZC file - extract component info
            libraryType = 'ezc';

            // Try to extract component name from the EZC content
            // EZC format: component "name" { ... }
            const componentMatch = textContent.match(/component\s+"([^"]+)"/);
            const kindMatch = textContent.match(/kind\s+"([^"]+)"/);
            const categoryMatch = textContent.match(/category\s+"([^"]+)"/);

            if (componentMatch) {
                const compName = componentMatch[1];
                componentCount = 1;

                metadata = {
                    componentName: compName,
                    kind: kindMatch ? kindMatch[1] : 'component',
                    category: categoryMatch ? categoryMatch[1] : 'Uncategorized',
                    libraryName: libraryName || componentName,
                    fileType: 'ezc'
                };

                indexItems.push({
                    name: compName,
                    type: kindMatch ? kindMatch[1] : 'component',
                    source_file: originalName,
                    search_blob: `${compName} ${libraryName || ''} ${categoryMatch ? categoryMatch[1] : ''} ${originalName}`
                });
            } else {
                // Fallback if we can't parse
                componentCount = 1;
                metadata = {
                    componentName: componentName || libraryName,
                    fileType: 'ezc'
                };

                if (componentName) {
                    indexItems.push({
                        name: componentName,
                        type: 'component',
                        source_file: originalName,
                        search_blob: `${componentName} ${libraryName || ''} ${originalName}`
                    });
                }
            }

        } else if (type === 'ezl') {
            // This is a library index file
            libraryType = 'ezl';

            // Parse EZL to extract component names from index
            // Format: index { "comp1" : "category1" "comp2" : "category2" }
            const indexMatch = textContent.match(/index\s*\{([^}]+)\}/s);
            const libraryNameMatch = textContent.match(/library\s+"([^"]+)"/);

            if (indexMatch) {
                const indexContent = indexMatch[1];
                const componentMatches = [...indexContent.matchAll(/"([^"]+)"\s*:\s*"([^"]+)"/g)];

                componentCount = componentMatches.length;
                const components = [];

                componentMatches.forEach(match => {
                    const compName = match[1];
                    const category = match[2];
                    components.push(compName);

                    indexItems.push({
                        name: compName,
                        type: 'component',
                        category: category,
                        source_file: originalName,
                        search_blob: `${compName} ${libraryName || ''} ${category} ${originalName}`
                    });
                });

                metadata = {
                    libraryName: libraryNameMatch ? libraryNameMatch[1] : (libraryName || 'Library'),
                    componentCount,
                    components,
                    fileType: 'ezl'
                };
            } else {
                // No index found
                metadata = {
                    libraryName: libraryNameMatch ? libraryNameMatch[1] : (libraryName || 'Library'),
                    fileType: 'ezl'
                };
            }

        } else if (type === 'svg') {
            // SVG preview file - just store metadata
            libraryType = 'svg';
            componentCount = 0;
            metadata = {
                libraryName: libraryName || componentName,
                fileType: 'svg',
                isPreview: true
            };
            // Don't create index items for SVG files

        } else {
            // Unknown type - just store basic metadata
            libraryType = 'unknown';
            metadata = {
                originalName,
                size,
                fileType: type || 'unknown'
            };
        }

        // 3. Create Library Record (only for non-SVG files)
        if (type !== 'svg') {
            const { data: libRecord, error: dbError } = await supabaseAdmin
                .from('libraries')
                .insert({
                    file_path: filePath,
                    library_type: libraryType,
                    status: 'ok',
                    component_count: componentCount,
                    parsed_metadata: metadata,
                    is_public: false // Default to private
                })
                .select()
                .single();

            if (dbError) {
                console.error('DB Insert error:', dbError);
                return NextResponse.json({ error: 'Failed to create library record' }, { status: 500 });
            }

            // 4. Index Components (if any)
            if (indexItems.length > 0) {
                const itemsWithId = indexItems.map(item => ({
                    ...item,
                    library_id: libRecord.id
                }));

                const { error: indexError } = await supabaseAdmin
                    .from('library_index')
                    .insert(itemsWithId);

                if (indexError) {
                    console.error('Index error:', indexError);
                    // Don't fail the whole request, just warn
                }
            }

            return NextResponse.json({ success: true, libraryId: libRecord.id, count: componentCount });
        } else {
            // For SVG files, just return success
            return NextResponse.json({ success: true, type: 'svg' });
        }

    } catch (error) {
        console.error('Upload handler error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
