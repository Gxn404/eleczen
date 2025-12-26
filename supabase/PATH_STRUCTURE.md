# Component Library System - Path Structure

## Storage Structure

### Supabase Storage
- **Bucket**: `libraries`
- **Path Format**: `components/{ComponentName}/{ComponentName}.{extension}`

### Example Paths
```
libraries/components/NE555/NE555.ezc
libraries/components/NE555/NE555.ezl  
libraries/components/NE555/NE555.svg
libraries/components/LM358/LM358.ezc
libraries/components/LM358/LM358.ezl
libraries/components/LM358/LM358.svg
```

## Database Storage

### component_libraries Table
- **file_path**: Stores path relative to bucket (without bucket name)
- Example: `components/NE555/NE555.ezc`

### library_index Table
- **source_file**: Original uploaded filename
- Example: `NE555.kicad_sym` or `NE555.lib`

## Upload Flow

1. **User uploads file** (e.g., `NE555.kicad_sym`)
2. **ComponentProcessor** processes it → generates:
   - `NE555.ezc` (component definition)
   - `NE555.ezl` (library index)
   - `NE555.svg` (symbol preview)
3. **LibraryBrowser** uploads to Supabase:
   - Path: `components/NE555/NE555.ezc`
   - Bucket: `libraries`
   - Full path: `libraries/components/NE555/NE555.ezc`
4. **API** indexes in database:
   - `file_path`: `components/NE555/NE555.ezc`
   - Creates entries in `library_index`

## Load Flow

1. **User opens LibraryBrowser**
2. **Fetches** from `library_index` table
3. **User selects** component (e.g., "NE555")
4. **ComponentLoader** loads:
   - Gets `file_path` from database: `components/NE555/NE555.ezc`
   - Downloads from storage: `libraries/components/NE555/NE555.ezc`
   - Parses EZC content
   - Loads SVG: `libraries/components/NE555/NE555.svg`
5. **Canvas** renders with SVG symbol

## Code References

### Upload Paths (LibraryBrowser.jsx)
```javascript
const ezcPath = `components/${libraryName}/${libraryName}.ezc`;
await supabase.storage.from('libraries').upload(ezcPath, ezcBlob);
```

### Download Paths (component.js)
```javascript
const ezcPath = libraryPath; // Already has 'components/...'
const { data } = await supabase.storage
    .from('libraries')
    .download(ezcPath);
```

### Database Paths (route.js)
```javascript
// filePath comes from LibraryBrowser: 'components/NE555/NE555.ezc'
file_path: filePath  // Stored in database
```

## Important Notes

1. **Bucket name** (`libraries`) is NOT stored in database
2. **Relative paths** are stored in `file_path` column
3. **Bucket name** is specified in code when accessing storage
4. **Component name** is used as folder name for organization
5. **All files** for a component go in the same folder

## Troubleshooting

### File not found error
- Check bucket name is `libraries`
- Verify path format: `components/{name}/{name}.ext`
- Ensure file was uploaded successfully

### Component not loading
- Check `file_path` in database matches storage path
- Verify EZC file exists in storage
- Check SVG file exists (optional but recommended)

### Path mismatch
- Database stores: `components/NE555/NE555.ezc`
- Storage has: `libraries/components/NE555/NE555.ezc`
- Code combines them: `supabase.storage.from('libraries').download(file_path)`
