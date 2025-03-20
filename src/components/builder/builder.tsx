"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {  template_endpoint } from "@/api";
import { PROGRESS_STEPS, INITIAL_FILE_STRUCTURE } from "@/constants";
import ProgressSteps from "./sections/ProgressSteps";
import FileExplorer from "./sections/FileExplorer";
import CodeEditor from "./sections/CodeEditor";
import PromptField from "./sections/PromptField";
import { Navbar, CapsuleToggle } from "../ui";
import { FileNode, Step, StepType, StepStatus, templateAPIResponse } from "@/types";
import { buildFileNodeTree } from "@/lib/utils";
 
export default function Builder() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [FileNode, setFileNode] = useState<FileNode[]>(INITIAL_FILE_STRUCTURE);
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const templateData: templateAPIResponse = await template_endpoint();
        if (templateData) {
          const updatedSteps = templateData.template.map(step => ({
            ...step,
            status: StepStatus.PENDING,
            type: step.type as StepType
          }));
          setSteps(updatedSteps);
          setFileNode(buildFileNodeTree(updatedSteps));
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
      <Navbar/>
      <div className="h-screen bg-gray-900 text-white flex">
        {/* Steps sidebar */}
        <div className="h-screen">
          <div className="flex  h-5/6">
            <ProgressSteps steps={steps.length > 0 ? steps : PROGRESS_STEPS} />
            <FileExplorer
              FileNode={FileNode}
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
            />
          </div>
          <div className="h-1/6 mt-2 pb-4 pt-2">
            <PromptField />
          </div>
        </div>
        
        <div className="w-screen">
          <div className="h-[10%] p-4">
            <div className="flex justify-between items-center">
              <CapsuleToggle
                tabs={['editor', 'preview']}
                activeTab={activeView}
                onChange={setActiveView}
              />
              <p className="text-sm text-gray-600">
                Currently viewing: <span className="font-semibold">{activeView}</span>
              </p>
            </div>
          </div>
          <div className="h-[90%]">
            <div className="h-full">
              <div className="text-xl text-gray-800">
                {activeView === 'editor' ? <CodeEditor selectedFile={selectedFile} /> : 'Preview Content'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
