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

    // Initialize WebContainer
    useEffect(() => {
        async function main() {
            if (!webcontainerInstance) {
                try {
                    webcontainerInstance = await WebContainer.boot();
                    setState(prev => ({ ...prev, container: webcontainerInstance }));
                } catch (err) {
                    setState(prev => ({ 
                        ...prev, 
                        error: err instanceof Error ? err.message : 'Failed to initialize WebContainer' 
                    }));
                }
            } else {
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
                setState(prev => ({ ...prev, status: "Mounting files..." }));
                const mountStructure = createMountStructure(fileNode);
                await state.container.mount(mountStructure);

                // Install dependencies
                setState(prev => ({ ...prev, status: "Installing dependencies..." }));
                const installProcess = await state.container.spawn('npm', ['install']);
                
                installProcess.output.pipeTo(new WritableStream({
                    write(text: string) {
                        if (text.includes("added")) {
                            setState(prev => ({ ...prev, status: text.trim() }));
                        }
                    }
                }));

                const installExit = await installProcess.exit;
                if (installExit !== 0) {
                    throw new Error('Installation failed');
                }

                // Start dev server
                setState(prev => ({ ...prev, status: "Starting development server..." }));
                await state.container.spawn('npm', ['run', 'dev']);

                // Listen for server ready event
                state.container.on('server-ready', (port, url) => {
                    setState(prev => ({ 
                        ...prev, 
                        status: "Server ready!", 
                        url 
                    }));
                });
            } catch (err) {
                setState(prev => ({ 
                    ...prev, 
                    error: err instanceof Error ? err.message : 'An unexpected error occurred',
                    status: "Failed to start preview"
                }));
            }
        }

        setupServer();
    }, [state.container, fileNode]);

    return state;
}
