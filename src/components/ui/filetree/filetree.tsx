import React from 'react';
import { ChevronRight, ChevronDown, Folder, FileCode } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

interface FileTreeProps {
  items: FileNode[];
  expandedFolders: Set<string>;
  toggleFolder: (path: string) => void;
  selectedFile: string | null;
  setSelectedFile: (file: string | null) => void;
}

export const FileTree: React.FC<FileTreeProps> = ({ items, expandedFolders, toggleFolder, selectedFile, setSelectedFile }) => {
  const renderFileTree = (items: FileNode[], path = '') => {
    return items.map((item) => {
      const currentPath = `${path}/${item.name}`;
      
      if (item.type === 'folder') {
        const isExpanded = expandedFolders.has(currentPath);
        return (
          <div key={currentPath}>
            <div
              className="flex items-center gap-2 py-1 px-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => toggleFolder(currentPath)}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Folder size={16} className="text-yellow-400" />
              <span>{item.name}</span>
            </div>
            {isExpanded && item.children && (
              <div className="ml-4">
                {renderFileTree(item.children, currentPath)}
              </div>
            )}
          </div>
        );
      }

      return (
        <div
          key={currentPath}
          className={`flex items-center gap-2 py-1 px-2 hover:bg-gray-700 cursor-pointer ${
            selectedFile === currentPath ? 'bg-gray-700' : ''
          }`}
          onClick={() => setSelectedFile(currentPath)}
        >
          <FileCode size={16} className="text-blue-400" />
          <span>{item.name}</span>
        </div>
      );
    });
  };

  return <div>{renderFileTree(items)}</div>;
};