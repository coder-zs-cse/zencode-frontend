'use client'

import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { ChevronRight, ChevronDown, Folder, FileCode } from 'lucide-react';
import { useSearchParams } from "next/navigation";
import { chat_endpoint } from '@/api';
import { PROGRESS_STEPS, INITIAL_FILE_STRUCTURE, FileStructure } from '@/constants';

export default function Builder() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/']));

  const [fileStructure] = useState<FileStructure[]>(INITIAL_FILE_STRUCTURE);

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

  const renderFileTree = (items: FileStructure[], path = '') => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("okay")
        await chat_endpoint();
      } catch (error) {
        console.error("Error calling chat endpoint:", error);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <div className="h-screen bg-gray-900 text-white flex">
      {/* Steps sidebar */}
      <div className="w-64 bg-gray-800 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Progress</h2>
        <div className="space-y-2">
          {PROGRESS_STEPS.map((step, index) => (
            <div
              key={index}
              className={`p-2 rounded ${
                index === 2 ? 'bg-blue-500' : 'bg-gray-700'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* File structure */}
      <div className="w-64 bg-gray-800 border-x border-gray-700 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Files</h2>
          {renderFileTree(fileStructure)}
        </div>
      </div>

      {/* Code editor */}
      <div className="flex-1 bg-gray-900">
        {selectedFile ? (
          <Editor
            height="100vh"
            defaultLanguage="typescript"
            theme="vs-dark"
            value="// Select a file to edit"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              readOnly: true,
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a file to start editing
          </div>
        )}
      </div>
    </div>
  );
}