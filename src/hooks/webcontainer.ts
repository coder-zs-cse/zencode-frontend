import { useEffect, useState } from "react";
import { WebContainer } from '@webcontainer/api';
import { FileNode } from "@/types";

// Store the WebContainer instance at module level
let webcontainerInstance: WebContainer | null = null;

const createMountStructure = (files: FileNode[]): Record<string, any> => {
    const mountStructure: Record<string, any> = {};

    const processFile = (file: FileNode, isRootFolder: boolean) => {  
        if (file.type === 'folder') {
            // For folders, create a directory entry
            mountStructure[file.name] = {
                directory: file.children ? 
                    Object.fromEntries(
                        file.children.map(child => [child.name, processFile(child, false)])
                    ) 
                    : {}
            };
        } else if (file.type === 'file') {
            if (isRootFolder) {
                mountStructure[file.name] = {
                    file: {
                        contents: file.content || ''
                    }
                };
            } else {
                // For files, create a file entry with contents
                return {
                    file: {
                        contents: file.content || ''
                    }
                };
            }
        }

        return mountStructure[file.name];
    };

    // Process each top-level file/folder
    files.forEach(file => processFile(file, true));

    return mountStructure;
};

interface WebContainerState {
    container: WebContainer | null;
    url: string;
    status: string;
    error: string | null;
}

export function useWebContainer(fileNode?: FileNode[]) {
    const [state, setState] = useState<WebContainerState>({
        container: null,
        url: "",
        status: "Initializing...",
        error: null
    });

    // Initialize WebContainer only once
    useEffect(() => {
        async function main() {
            if (!webcontainerInstance) {
                try {
                    console.log('Booting WebContainer...');
                    webcontainerInstance = await WebContainer.boot();
                    console.log('WebContainer booted successfully');
                    setState(prev => ({ ...prev, container: webcontainerInstance }));
                } catch (err) {
                    console.error('Failed to boot WebContainer:', err);
                    setState(prev => ({ 
                        ...prev, 
                        error: err instanceof Error ? err.message : 'Failed to initialize WebContainer' 
                    }));
                }
            } else {
                console.log('Using existing WebContainer instance');
                setState(prev => ({ ...prev, container: webcontainerInstance }));
            }
        }
        main();
    }, []);

    // Handle file changes and server initialization
    useEffect(() => {
        async function setupServer() {
            if (!state.container || !fileNode) return;

            try {
                // Mount new files
                console.log('Mounting files...');
                setState(prev => ({ ...prev, status: "Mounting files..." }));
                const mountStructure = createMountStructure(fileNode);
                await state.container.mount(mountStructure);
                console.log('Files mounted successfully');

                // Install dependencies
                console.log('Starting npm install...');
                setState(prev => ({ ...prev, status: "Installing dependencies..." }));
                const installProcess = await state.container.spawn('npm', ['install']);
                
                // Log all npm install output
                installProcess.output.pipeTo(new WritableStream({
                    write(text: string) {
                        console.log('npm install:', text.trim());
                        if (text.includes("added")) {
                            setState(prev => ({ ...prev, status: text.trim() }));
                        }
                    }
                }));

                const installExit = await installProcess.exit;
                if (installExit !== 0) {
                    throw new Error('Installation failed');
                }
                console.log('npm install completed successfully');

                // Start dev server
                console.log('Starting development server...');
                setState(prev => ({ ...prev, status: "Starting development server..." }));
                const devProcess = await state.container.spawn('npm', ['run', 'dev']);

                // Log dev server output
                devProcess.output.pipeTo(new WritableStream({
                    write(text: string) {
                        console.log('dev server:', text.trim());
                    }
                }));

                // Listen for server ready event
                state.container.on('server-ready', (port, url) => {
                    console.log(`Server ready on port ${port}: ${url}`);
                    setState(prev => ({ 
                        ...prev, 
                        status: "Server ready!", 
                        url 
                    }));
                });

                // Cleanup function to kill the dev server when files change
                return () => {
                    console.log('Cleaning up dev server...');
                    devProcess.kill();
                };
            } catch (err) {
                console.error('Error during server setup:', err);
                setState(prev => ({ 
                    ...prev, 
                    error: err instanceof Error ? err.message : 'An unexpected error occurred',
                    status: "Failed to start preview"
                }));
            }
        }

        setupServer();
    }, [fileNode]);

    return state;
}
