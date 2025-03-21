import { useEffect, useState } from "react";
import { WebContainer } from '@webcontainer/api';

// Store the WebContainer instance at module level
let webcontainerInstance: WebContainer | null = null;

export function useWebContainer() {
    const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);

    async function main() {
        if (!webcontainerInstance) {
            webcontainerInstance = await WebContainer.boot();
        }
        setWebcontainer(webcontainerInstance);
    }

    useEffect(() => {
        main();
    }, [])

    return webcontainer;
}
