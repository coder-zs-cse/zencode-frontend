import { WebContainer } from '@webcontainer/api';
import React, { useEffect, useState } from 'react';

interface PreviewFrameProps {
  webContainer: WebContainer;
}

const PreviewFrame = function({ webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("Initializing...");
  const [error, setError] = useState<string | null>(null);

  async function main() {
    try {
      setStatus("Installing dependencies...");
      const installProcess = await webContainer.spawn('npm', ['install']);

      installProcess.output.pipeTo(new WritableStream({
        write(text: string) {
          // Update status with meaningful installation progress
          if (text.includes("added")) {
            setStatus(text.trim());
          } else if (!text.includes("[")) { // Avoid showing the progress bars
            console.log(text);
          }
        }
      }));

      // Wait for installation to complete
      const installExit = await installProcess.exit;
      if (installExit !== 0) {
        throw new Error('Installation failed');
      }

      setStatus("Starting development server...");
      await webContainer.spawn('npm', ['run', 'dev']);

      webContainer.on('server-ready', (port, url) => {
        console.log("Server ready on port", port);
        setStatus("Server ready!");
        setUrl(url);
      });
    } catch (err) {
      console.error('Error in preview:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setStatus("Failed to start preview");
    }
  }

  useEffect(() => {
    main();
  }, []);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-500">
        <div className="text-center">
          <p className="mb-2">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {!url && <div className="text-center">
        <p className="mb-2">{status}</p>
      </div>}
      {url && <iframe width={"100%"} height={"100%"} src={url} />}
    </div>
  );
} 

export { PreviewFrame }