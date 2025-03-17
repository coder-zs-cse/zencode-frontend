import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  selectedFile: string | null;
  fileContent?: string;
  readOnly?: boolean;
  onChange?: (value: string | undefined) => void;
}

export default function CodeEditor({ 
  selectedFile, 
  fileContent = "// Select a file to edit", 
  readOnly = true,
  onChange
}: CodeEditorProps) {
  return (
    <div className="flex-1 bg-gray-900">
      {selectedFile ? (
        <Editor
          height="100vh"
          defaultLanguage="typescript"
          theme="vs-dark"
          value={fileContent}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            readOnly,
          }}
          onChange={onChange}
        />
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400">
          Select a file to start editing
        </div>
      )}
    </div>
  );
} 