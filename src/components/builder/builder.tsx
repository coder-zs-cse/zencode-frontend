'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams } from "next/navigation";
import { chat_endpoint, template_endpoint } from '@/api';
import { PROGRESS_STEPS, INITIAL_FILE_STRUCTURE } from '@/constants';
import ProgressSteps from './sections/ProgressSteps';
import FileExplorer from './sections/FileExplorer';
import CodeEditor from './sections/CodeEditor';
import { FileStructure, Step, templateAPIResponse } from '@/types';
import { parseXml } from '@/lib/utils/xml';

export default function Builder () {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [selectedFile, setSelectedFile] = useState<FileStructure | null>(null);
  const [fileStructure] = useState<FileStructure[]>(INITIAL_FILE_STRUCTURE);
  const [steps, setSteps] = useState<Step[]>([]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching template data");
        const templateData: templateAPIResponse = await template_endpoint();
        console.log("data: ",templateData)
        if (templateData) {
          const parsedSteps = parseXml(templateData.template);
          setSteps(parsedSteps);
        }
      } catch (error) {
        console.error("Error calling endpoints:", error);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <div className="h-screen bg-gray-900 text-white flex">
      {/* Steps sidebar */}
      <ProgressSteps 
        steps={steps.length > 0 ? steps : PROGRESS_STEPS} 
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