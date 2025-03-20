import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FileCode } from 'lucide-react';
import { FileNode } from '@/types';

interface FileExplorerProps {
  FileNode: FileNode[];
  onFileSelect: (file: FileNode) => void;
  selectedFile: FileNode | null;
}

const FileExplorer = function ({ 
  FileNode, 
  onFileSelect, 
  selectedFile 
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/']));

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const sortItems = (items: FileNode[]) => {
    return [...items].sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'folder' ? -1 : 1;
    });
  };
  const renderFileTree = (items: FileNode[], path = '') => {
    const sortedFileItems = sortItems(items);
    
    return sortedFileItems.map((item) => {
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
            selectedFile?.path === currentPath ? 'bg-gray-700' : ''
          }`}
          onClick={() => onFileSelect(item)}
        >
          <FileCode size={16} className="text-blue-400" />
          <span>{item.name}</span>
        </div>
      );
    });
  };

  return (
    <div className="w-64 bg-gray-800 border-x border-gray-700 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Files</h2>
        {renderFileTree(FileNode)}
      </div>
    </div>
  );
} 

export { FileExplorer }