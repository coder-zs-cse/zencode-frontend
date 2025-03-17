'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams } from "next/navigation";
import { chat_endpoint } from '@/api';
import { PROGRESS_STEPS, INITIAL_FILE_STRUCTURE, FileStructure } from '@/constants';
import ProgressSteps from './ProgressSteps';
import FileExplorer from './FileExplorer';
import CodeEditor from './CodeEditor';

export default function Builder() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileStructure] = useState<FileStructure[]>(INITIAL_FILE_STRUCTURE);
  

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
      <ProgressSteps 
        steps={PROGRESS_STEPS} 
      />

      {/* File structure */}
      <FileExplorer 
        fileStructure={fileStructure} 
        onFileSelect={setSelectedFile} 
        selectedFile={selectedFile} 
      />

      {/* Code editor */}
      <CodeEditor selectedFile={selectedFile} />
    </div>
  );
}