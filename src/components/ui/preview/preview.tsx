import React, { useEffect, useState } from "react";
import { WebContainer } from "@webcontainer/api";
import { FileStructure } from "@/constants";
interface PreviewProps {
  files: FileStructure[];
  webcontainer: WebContainer | undefined;
}

const Preview = ({ files, webcontainer }: PreviewProps) => {
  const [url, setUrl] = useState("");

  async function main() {
    const installProcess = await webcontainer?.spawn("npm", ["install"]);
    installProcess?.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );
    await webcontainer?.spawn("npm", ["run", "dev"]);
  }

  webcontainer?.on("server-ready", (port, url) => {
    console.log(url);
    console.log(port);
    setUrl(url);
  });

  useEffect(() => {
    main();
  });
  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {!url && (
        <div className="text-center">
          <p className="mb-2">Preview will be generated based on the code</p>
          <p className="text-sm">Currently Tracking {files.length} files</p>
        </div>
      )}
      {url && <iframe src={url} />}
    </div>
  );
};

export default Preview;
