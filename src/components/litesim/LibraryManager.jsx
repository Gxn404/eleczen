"use client";
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { generateEZC } from '@/lib/eleczen-dsl/generator';

const LibraryManager = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('browse'); // browse, upload
    const [libraries, setLibraries] = useState([]);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [currentFileIndex, setCurrentFileIndex] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const abortControllerRef = useRef(null);

    useEffect(() => {
        if (isOpen && activeTab === 'browse') {
            fetchLibraries();
        }
    }, [isOpen, activeTab]);

    const fetchLibraries = async () => {
        const { data, error } = await supabase
            .from('component_libraries')
            .select('*')
            .order('uploaded_at', { ascending: false });

        if (data) setLibraries(data);
        if (error) {
            console.error('Error fetching libraries:', error);
        }
    };

    const handleFileSelect = (e) => {
        setUploadFiles(Array.from(e.target.files));
        setUploadProgress(0);
        setUploadStatus('');
    };

    const handleCancel = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setUploadStatus('Cancelled');
            setIsUploading(false);
        }
    };

    const checkCancelled = () => {
        if (abortControllerRef.current?.signal.aborted) {
            throw new Error('Cancelled by user');
        }
    };

    const handleUpload = async () => {
        setIsUploading(true);
        setUploadStatus('Starting...');
        setUploadProgress(0);
        setCurrentFileIndex(0);

        abortControllerRef.current = new AbortController();

        try {
            // Import ComponentProcessor dynamically
            const { ComponentProcessor } = await import('@/lib/processing/ComponentProcessor');
            const processor = new ComponentProcessor();

            const totalFiles = uploadFiles.length;

            for (let i = 0; i < totalFiles; i++) {
                const file = uploadFiles[i];
                setCurrentFileIndex(i + 1);
                checkCancelled();

                if (file.name.endsWith('.zip')) {
                    setUploadStatus(`Reading ${file.name}...`);
                    const JSZip = (await import('jszip')).default;
                    const zip = new JSZip();
                    const contents = await zip.loadAsync(file);

                    checkCancelled();

                    const filesToProcess = [];
                    const entries = Object.entries(contents.files);

                    // 1. Extract
                    setUploadStatus(`Extracting ${file.name}...`);
                    for (const [relativePath, zipEntry] of entries) {
                        if (zipEntry.dir || relativePath.startsWith('__MACOSX')) continue;

                        const fileName = relativePath.split('/').pop();
                        if (fileName.endsWith('.kicad_sym') || fileName.endsWith('.sub') || fileName.endsWith('.mod') || fileName.endsWith('.cir')) {
                            const text = await zipEntry.async('string');
                            filesToProcess.push({ name: fileName, content: text });
                        }
                    }

                    checkCancelled();

                    // 2. Process
                    setUploadStatus(`Processing ${filesToProcess.length} files in ${file.name}...`);
                    const libraryName = file.name.replace('.zip', '');
                    const { components, ezl } = processor.processLibrary(filesToProcess, libraryName);

                    // 3. Upload
                    await uploadProcessedFiles(components, ezl, libraryName, (progress) => {
                        // Map 0-100 of this file to the overall progress
                        // Each file gets 1/totalFiles share of the progress bar
                        const fileShare = 100 / totalFiles;
                        const currentBase = (i * fileShare);
                        const actualProgress = currentBase + (progress * (fileShare / 100));
                        setUploadProgress(Math.round(actualProgress));
                    });

                } else if (file.name.endsWith('.ezc') || file.name.endsWith('.ezl')) {
                    setUploadStatus(`Uploading ${file.name}...`);
                    const path = `UserUploads/${file.name}`;

                    const { data, error } = await supabase.storage
                        .from('libraries')
                        .upload(path, file, { upsert: true });

                    if (error) throw error;

                    await fetch('/api/library/upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            filePath: data.path,
                            originalName: file.name,
                            size: file.size,
                            type: file.name.endsWith('.ezc') ? 'ezc' : 'ezl',
                            componentName: file.name.replace('.ezc', ''),
                            libraryName: 'UserUploads'
                        })
                    });

                    // Update progress
                    const currentProgress = ((i + 1) / totalFiles) * 100;
                    setUploadProgress(Math.round(currentProgress));

                } else {
                    // Single source file
                    setUploadStatus(`Processing ${file.name}...`);
                    const text = await file.text();
                    const filesToProcess = [{ name: file.name, content: text }];
                    const libraryName = file.name.split('.')[0];

                    const { components, ezl } = processor.processLibrary(filesToProcess, libraryName);

                    await uploadProcessedFiles(components, ezl, libraryName, (progress) => {
                        const fileShare = 100 / totalFiles;
                        const currentBase = (i * fileShare);
                        const actualProgress = currentBase + (progress * (fileShare / 100));
                        setUploadProgress(Math.round(actualProgress));
                    });
                }
            }

            setUploadStatus('Upload complete!');
            setUploadProgress(100);
            fetchLibraries();
        } catch (err) {
            if (err.message === 'Cancelled by user') {
                setUploadStatus('Upload cancelled');
            } else {
                console.error(err);
                setUploadStatus(`Error: ${err.message}`);
            }
        } finally {
            setIsUploading(false);
            abortControllerRef.current = null;
        }
    };

    const uploadProcessedFiles = async (components, ezl, libraryName, onProgress) => {
        const totalItems = (components.length * 2) + 1; // EZC + EZL per component + Main EZL
        let processed = 0;

        const updateProgress = () => {
            processed++;
            if (onProgress) onProgress((processed / totalItems) * 100);
        };

        // 1. Upload Component Files (EZC + Component-level EZL)
        const BATCH_SIZE = 5;
        for (let i = 0; i < components.length; i += BATCH_SIZE) {
            checkCancelled();
            const batch = components.slice(i, i + BATCH_SIZE);

            await Promise.all(batch.map(async (comp) => {
                try {
                    // 1.1 Upload EZC
                    setUploadStatus(`Uploading ${comp.name}.ezc...`);
                    // ComponentProcessor now returns { name, component } where component is the object
                    const ezcString = generateEZC(comp.component);
                    const ezcBlob = new Blob([ezcString], { type: 'text/plain' });
                    const ezcPath = `${libraryName}/${comp.name}/${comp.name}.ezc`;

                    const { data: ezcData, error: ezcError } = await supabase.storage
                        .from('libraries')
                        .upload(ezcPath, ezcBlob, { cacheControl: '3600', upsert: true });

                    if (ezcError) throw ezcError;

                    // Index EZC
                    await fetch('/api/library/upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            filePath: ezcData.path,
                            originalName: `${comp.name}.ezc`,
                            size: ezcBlob.size,
                            componentName: comp.name,
                            libraryName: libraryName,
                            type: 'ezc'
                        })
                    });
                    updateProgress();

                    // 1.2 Generate and Upload Component-level EZL
                    const compEzlContent = `library "${comp.name}"
    version "1.0.0"
    description "Auto-generated library for ${comp.name}"
    include "${comp.name}.ezc"
end`;
                    setUploadStatus(`Uploading ${comp.name}.ezl...`);
                    const compEzlBlob = new Blob([compEzlContent], { type: 'text/plain' });
                    const compEzlPath = `${libraryName}/${comp.name}/${comp.name}.ezl`;

                    const { data: compEzlData, error: compEzlError } = await supabase.storage
                        .from('libraries')
                        .upload(compEzlPath, compEzlBlob, { cacheControl: '3600', upsert: true });

                    if (compEzlError) throw compEzlError;

                    await fetch('/api/library/upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            filePath: compEzlData.path,
                            originalName: `${comp.name}.ezl`,
                            size: compEzlBlob.size,
                            libraryName: comp.name,
                            type: 'ezl'
                        })
                    });
                    updateProgress();

                } catch (err) {
                    console.error(`Error uploading component ${comp.name}:`, err);
                }
            }));
        }

        // 2. Upload Main Library EZL (Index)
        checkCancelled();
        setUploadStatus(`Finalizing library ${libraryName}...`);

        const ezlBlob = new Blob([ezl], { type: 'text/plain' });
        const ezlPath = `${libraryName}/${libraryName}.ezl`;

        const { data: ezlData, error: ezlError } = await supabase.storage
            .from('libraries')
            .upload(ezlPath, ezlBlob, {
                cacheControl: '3600',
                upsert: true
            });

        if (!ezlError) {
            await fetch('/api/library/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filePath: ezlData.path,
                    originalName: `${libraryName}.ezl`,
                    size: ezlBlob.size,
                    libraryName: libraryName,
                    type: 'ezl'
                })
            });
        }
        updateProgress();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 w-[800px] h-[600px] rounded-xl flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-cyan-400">Library Manager</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-800">
                    <button
                        onClick={() => setActiveTab('browse')}
                        className={`px-6 py-3 text-sm font-medium ${activeTab === 'browse' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        Installed Libraries
                    </button>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`px-6 py-3 text-sm font-medium ${activeTab === 'upload' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        Upload New
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    {activeTab === 'browse' ? (
                        <div className="space-y-4">
                            {libraries.map(lib => (
                                <div key={lib.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-gray-200">{lib.file_path.split('/').pop()}</div>
                                        <div className="text-xs text-gray-500">
                                            {lib.library_type.toUpperCase()} • {new Date(lib.uploaded_at).toLocaleDateString()} • {lib.component_count} components
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className={`px-2 py-1 rounded text-xs ${lib.status === 'ok' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                            {lib.status}
                                        </span>
                                        <button className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                                    </div>
                                </div>
                            ))}
                            {libraries.length === 0 && (
                                <div className="text-center text-gray-500 py-10">No libraries installed.</div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="border-2 border-dashed border-gray-700 rounded-xl p-10 text-center hover:border-cyan-500/50 transition-colors">
                                <input
                                    type="file"
                                    multiple
                                    accept=".kicad_sym,.mod,.sub,.cir,.zip,.ezc,.ezl"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="lib-upload"
                                    disabled={isUploading}
                                />
                                <label htmlFor="lib-upload" className={`cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <div className="text-4xl mb-4">📂</div>
                                    <div className="text-lg text-gray-300">Click to select library files</div>
                                    <div className="text-sm text-gray-500 mt-2">Supports .kicad_sym, .mod, .sub, .zip</div>
                                </label>
                            </div>

                            {uploadFiles.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm text-gray-400">
                                        <span>Selected {uploadFiles.length} files</span>
                                        {isUploading && <span>Processing file {currentFileIndex} of {uploadFiles.length}</span>}
                                    </div>

                                    {/* Progress Bar */}
                                    {(isUploading || uploadProgress > 0) && (
                                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                                            <div
                                                className="bg-cyan-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                                                style={{ width: `${uploadProgress}%` }}
                                            ></div>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        {!isUploading ? (
                                            <button
                                                onClick={handleUpload}
                                                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded font-medium disabled:opacity-50"
                                                disabled={uploadFiles.length === 0}
                                            >
                                                Start Upload
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleCancel}
                                                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded font-medium"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>

                                    {uploadStatus && (
                                        <div className={`text-center text-sm ${uploadStatus.includes('Error') || uploadStatus.includes('Cancelled') ? 'text-red-400' : 'text-cyan-400'}`}>
                                            {uploadStatus}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LibraryManager;
