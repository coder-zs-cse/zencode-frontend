"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {  template_endpoint } from "@/api";
import { PROGRESS_STEPS, INITIAL_FILE_STRUCTURE } from "@/constants";
import { CodeEditor,FileExplorer, PreviewFrame, ProgressSteps, PromptField } from '@/components/builder/sections';
import { Navbar, CapsuleToggle } from "@/components/ui";
import { buildFileNodeTree } from "@/lib/utils";
import { useWebContainer } from "@/hooks/webcontainer";
import { FileNode, Step, StepType, StepStatus, templateAPIResponse } from "@/types";
 
export default function Builder() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [FileNode, setFileNode] = useState<FileNode[]>(INITIAL_FILE_STRUCTURE);
  const [steps, setSteps] = useState<Step[]>([]);
  const webcontainer = useWebContainer();

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
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar/>
      <div className="flex-1 bg-gray-900 text-white flex overflow-hidden">
        {/* Steps sidebar */}
        <div className="h-full flex flex-col w-[40%]">
          <div className="flex flex-1 overflow-hidden">
            <ProgressSteps steps={steps.length > 0 ? steps : PROGRESS_STEPS} />
            <FileExplorer
              FileNode={FileNode}
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
            />
          </div>
          <div className="h-24 mt-2 pb-4 pt-2">
            <PromptField />
          </div>
        </div>
        
        <div className="flex-1 h-full overflow-hidden">
          <div className="p-2">
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
          <div className="h-[calc(100%-3rem)] overflow-hidden">
              <div className="text-xl text-gray-800 h-full">
              {activeView === 'editor' ? (
                  <CodeEditor selectedFile={selectedFile} />
                ) : (
                  webcontainer && <PreviewFrame files={[]} webContainer={webcontainer} />
                )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
