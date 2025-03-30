import { WebContainer } from "@webcontainer/api";
import React from "react";

interface PreviewFrameProps {
  webContainer: {
    container: WebContainer | null;
    url: string;
    status: string;
    error: string | null;
  };
}

const PreviewFrame = function ({ webContainer }: PreviewFrameProps) {
  const { url, status, error } = webContainer;

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
      {!url && (
        <div className="text-center">
          <p className="mb-2">{status}</p>
        </div>
      )}
      {url && <iframe width={"100%"} height={"100%"} src={url} />}
    </div>
  );
};

export { PreviewFrame };
