import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../supabase/supabase-admin';
import { parseSpice } from '@/lib/parser/spice';
import { parseEZC } from '@/lib/eleczen-dsl/parser';
import { parseEZL } from '@/lib/eleczen-dsl/library-parser';

export async function POST(request) {
    try {
        const { filePath, originalName, size, type, componentName, libraryName } = await request.json();

        if (!filePath) {
            return NextResponse.json({ error: 'Missing filePath' }, { status: 400 });
        }

        // 1. Download file from Storage
        const { data: fileData, error: downloadError } = await supabaseAdmin.storage
            .from('libraries')
            .download(filePath);

        if (downloadError) {
            console.error('Download error:', downloadError);
            return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
        }

        const textContent = await fileData.text();

        // 2. Process based on type
        let libraryType = 'spice';
        let componentCount = 0;
        let metadata = {};
        let indexItems = [];

        if (type === 'ezc') {
            libraryType = 'ezc';
            componentCount = 1;
            try {
                const component = parseEZC(textContent);
                metadata = {
                    name: component.name,
                    kind: component.kind,
                    category: component.category,
                    version: component.version
                };

                indexItems.push({
                    name: component.name,
                    type: component.kind || 'component',
                    source_file: originalName,
                    search_blob: `${component.name} ${component.kind} ${component.category} ${originalName}`
                });

            } catch (e) {
                console.error('EZC Parse error:', e);
                return NextResponse.json({ error: 'Failed to parse EZC content' }, { status: 400 });
            }

        } else if (type === 'ezl') {
            libraryType = 'ezl';
            try {
                const library = parseEZL(textContent);
                componentCount = library.includes ? library.includes.length : 0;
                metadata = {
                    name: library.name,
                    version: library.version,
                    description: library.description,
                    categories: library.categories
                };
            } catch (e) {
                console.error('EZL Parse error:', e);
                return NextResponse.json({ error: 'Failed to parse EZL content' }, { status: 400 });
            }

        } else {
            // Default to SPICE
            libraryType = 'spice';
            let parsed;
            try {
                parsed = parseSpice(textContent);
            } catch (e) {
                console.error('Parse error:', e);
                return NextResponse.json({ error: 'Failed to parse file content' }, { status: 400 });
            }

            const { models, subckts, globals } = parsed;
            componentCount = models.length + subckts.length;
            metadata = {
                modelCount: models.length,
                subcktCount: subckts.length,
                globalCount: globals.length
            };

            // Index Models
            models.forEach(m => {
                indexItems.push({
                    name: m.name,
                    type: m.type,
                    parameters: m.params,
                    source_file: originalName,
                    search_blob: `${m.name} ${m.type} ${originalName}`
                });
            });

            // Index Subcircuits
            subckts.forEach(s => {
                indexItems.push({
                    name: s.name,
                    type: 'subckt',
                    pins: s.nodes,
                    source_file: originalName,
                    search_blob: `${s.name} subckt ${originalName}`
                });
            });
        }

        // 3. Create Library Record
        const { data: libRecord, error: dbError } = await supabaseAdmin
            .from('component_libraries')
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

    } catch (error) {
        console.error('Upload handler error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
