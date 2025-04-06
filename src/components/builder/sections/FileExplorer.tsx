import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Check,
  File,
  FileText,
  FileCode,
  Folder,
  FileJson,
} from "lucide-react";
import { FileNode } from "@/types";

interface FileExplorerProps {
  FileNode: FileNode[];
  onFileSelect: (file: FileNode) => void;
  selectedFile: FileNode | null;
  showCheckboxes?: boolean;
  selectedFiles: string[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<string[]>>;
}

const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "html":
      return <FileCode size={16} className="text-orange-500" />;
    case "css":
      return <FileCode size={16} className="text-blue-400" />;
    case "js":
    case "jsx":
      return <FileCode size={16} className="text-yellow-400" />;
    case "json":
      return <FileJson size={16} className="text-yellow-600" />;
    case "txt":
    case "md":
    case "doc":
    case "docx":
      return <FileText size={16} className="text-white" />;
    case "ts":
    case "tsx":
      return <FileCode size={16} className="text-blue-700" />;
    case "py":
    case "java":
    case "cpp":
    case "c":
    case "h":
    case "xml":
      return <FileCode size={16} className="text-white" />;
    default:
      return <File size={16} className="text-white" />;
  }
};

const FileExplorer = function ({
  FileNode,
  onFileSelect,
  selectedFile,
  showCheckboxes = true,
  selectedFiles,
  setSelectedFiles,
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["/"])
  );

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const toggleFile = (path: string) => {
    setSelectedFiles((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(path)) {
        newSelected.delete(path);
      } else {
        newSelected.add(path);
      }
      const result = Array.from(newSelected);
      console.log("Selected files:", result);
      return result;
    });
  };

  const sortItems = (items: FileNode[]) => {
    return [...items].sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === "folder" ? -1 : 1;
    });
  };

  const renderFileNode = (node: FileNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedFile?.path === node.path;
    const isFileSelected = selectedFiles.includes(node.path);

    return (
      <div key={node.path} className="space-y-1">
        <div
          className={`flex items-center gap-2 p-1 rounded-md hover:bg-slate-800/50 cursor-pointer ${
            isSelected ? "bg-slate-800/50" : ""
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          {node.type === "folder" ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleFolder(node.path)}
                className="text-slate-400 hover:text-slate-200"
              >
                {isExpanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
              <Folder size={16} className="text-yellow-500" />
            </div>
          ) : (
            <div className="w-4" />
          )}
          {showCheckboxes && node.type === "file" ? (
            <div
              className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                isFileSelected
                  ? "border-green-500 bg-green-600"
                  : "border-gray-400 hover:border-gray-300"
              }`}
              onClick={() => toggleFile(node.path)}
            >
              {isFileSelected && <Check size={12} className="text-white" />}
            </div>
          ) : (
            node.type === "file" && (
              <div className="w-4 h-4 flex items-center justify-center">
                {getFileIcon(node.name)}
              </div>
            )
          )}
          <span
            className={`text-sm ${
              node.type === "folder"
                ? "text-slate-300 font-medium"
                : "text-slate-400"
            }`}
            onClick={() => node.type === "file" && onFileSelect(node)}
          >
            {node.name}
          </span>
        </div>
        {node.type === "folder" && isExpanded && node.children && (
          <div className="space-y-1">
            {sortItems(node.children).map((child) =>
              renderFileNode(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full p-4 overflow-y-auto w-[50%]">
      <h2 className="text-xl font-bold mb-4">File Explorer</h2>
      <div className="h-full overflow-y-auto p-2">
        {sortItems(FileNode).map((node) => renderFileNode(node))}
      </div>
    </div>
  );
};

export { FileExplorer };
