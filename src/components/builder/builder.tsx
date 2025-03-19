"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { chat_endpoint, template_endpoint } from "@/api";
import { PROGRESS_STEPS, INITIAL_FILE_STRUCTURE } from "@/constants";
import ProgressSteps from "./sections/ProgressSteps";
import FileExplorer from "./sections/FileExplorer";
import CodeEditor from "./sections/CodeEditor";
import { FileStructure, Step, templateAPIResponse } from "@/types";
import { parseXml } from "@/lib/utils/xml";
import PromptField from "./sections/PromptField";
import { Navbar } from "../ui/navbar/navbar";
import "../../../app/globals.css";

function CapsuleToggle({ active, onChange }: { 
  active: 'editor' | 'preview';
  onChange: (value: 'editor' | 'preview') => void;
}) {
  return (
    <div className="inline-flex bg-blue-900 p-1 rounded-full">
      <button
        className={`px-4 py-2 rounded-full transition-all ${
          active === 'editor'
            ? 'bg-cyan-50 text-blue-900 shadow-sm'
            : 'text-cyan-50 hover:text-white'
        }`}
        onClick={() => onChange('editor')}
      >
        Editor
      </button>
      <button
        className={`px-4 py-2 rounded-full transition-all ${
          active === 'preview'
            ? 'bg-cyan-50 text-blue-900 shadow-sm'
            : 'text-cyan-50 hover:text-white'
        }`}
        onClick={() => onChange('preview')}
      >
        Preview
      </button>
    </div>
  );
}

export default function Builder() {
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
        console.log("data: ", templateData);
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
  const [activeView, setActiveView] = useState<'editor' | 'preview'>('editor');
  return (
    <div>

       {/* Navbar Component */}
      <Navbar/>
    <div className="h-screen bg-gray-900 text-white flex">
      {/* Steps sidebar */}
      <div className="h-screen">
        <div className="flex  h-5/6">
          <ProgressSteps steps={steps.length > 0 ? steps : PROGRESS_STEPS} />

          {/* File structure */}
          <FileExplorer
            fileStructure={fileStructure}
            onFileSelect={setSelectedFile}
            selectedFile={selectedFile}
            />

        </div>
        <div className="h-1/6 mt-2 pb-4 pt-2">
          <PromptField />
        </div>
      </div>
      
      <div className="w-screen">
      <div className="h-[10%]  p-4">
        <div className="flex justify-between items-center">
          <CapsuleToggle active={activeView} onChange={setActiveView} />
          <p className="text-sm text-gray-600 ">
            Currently viewing: <span className="font-semibold">{activeView}</span>
          </p>
        </div>
      </div>
      <div className="h-[90%]">
        <div className="h-full">
          <div className="text-xl text-gray-800">
            {activeView === 'editor' ?  <CodeEditor selectedFile={selectedFile} /> : 'Preview Content'}
          </div>
        </div>
      </div>
    </div>
     
    </div>
 </div>
  );
}
