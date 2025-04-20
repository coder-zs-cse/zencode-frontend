import React from 'react';
import Editor from '@monaco-editor/react';
import { FileNode } from '@/types';

interface CodeEditorProps {
  selectedFile: FileNode | null;
  readOnly?: boolean;
  onChange?: (value: string | undefined) => void;
}

const CodeEditor = function ({ 
  selectedFile, 
  readOnly = true,
  onChange
}: CodeEditorProps) {
  return (
    <div className="flex-1 ">
      
      {selectedFile ? (
        <Editor
          height="90vh"
          defaultLanguage="typescript"
          theme="vs-dark"
          value={selectedFile.content}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            readOnly: false
          }}
          
          onChange={onChange}
        />
      ) : (
        <div className="flex items-center justify-center text-gray-400">
          Select a file to start editing
        </div>
      )}
    </div>
  );
} 

export { CodeEditor }