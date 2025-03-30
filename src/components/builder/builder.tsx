"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { template_endpoint } from "@/api";
import { PROGRESS_STEPS } from "@/constants";
import {
  CodeEditor,
  FileExplorer,
  PreviewFrame,
  ProgressSteps,
  PromptField,
} from "@/components/builder/sections";
import { Navbar, CapsuleToggle } from "@/components/ui";
import { buildFileNodeTree } from "@/lib/utils";
import { useWebContainer } from "@/hooks/webcontainer";
import {
  FileNode,
  Step,
  StepType,
  StepStatus,
  templateAPIResponse,
} from "@/types";
import { Sidebar } from "../ui/sidebar/sidebar";
import { InternalComponents } from "./sections/InternalComponents";
import { Settings } from "./sections/Settings";

export default function Builder() {
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(true);
  const query = searchParams.get("query");
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [fileNode, setFileNode] = useState<FileNode[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentPage, setCurrentPage] = useState<
    "code-editor" | "components" | "settings"
  >("code-editor");
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor");
  const webcontainerState = useWebContainer(fileNode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const templateData: templateAPIResponse = await template_endpoint();
        if (templateData) {
          console.log("Here is ", templateData);
          const updatedSteps = templateData.template.map((step) => ({
            ...step,
            status: StepStatus.PENDING,
            type: step.type as StepType,
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

  return (
    <div className="h-screen">
      <Navbar template={steps as Step[]} />
      <div className="h-screen bg-gray-100 flex">
        <Sidebar
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded(!isExpanded)}
          onNavigate={setCurrentPage}
          currentPage={currentPage}
        />
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col h-screen">
            {currentPage === "code-editor" ? (
              <div className="flex-1 bg-gray-900 text-white flex overflow-hidden">
                <div className="h-screen flex flex-col w-[40%]">
                  <div className="flex h-[70%] overflow-hidden">
                    <ProgressSteps
                      steps={steps.length > 0 ? steps : PROGRESS_STEPS}
                    />
                    <FileExplorer
                      FileNode={fileNode}
                      onFileSelect={setSelectedFile}
                      selectedFile={selectedFile}
                    />
                  </div>
                  <div className="h-24 mt-2 pb-4 pt-2">
                    <PromptField components = {steps as Step[]} />
                  </div>
                </div>
                <div className="flex-1 h-full overflow-hidden">
                  <div className="p-2">
                    <div className="flex justify-between items-center">
                      <CapsuleToggle
                        tabs={["editor", "preview"]}
                        activeTab={activeView}
                        onChange={setActiveView}
                      />
                      <p className="text-sm text-gray-600">
                        Currently viewing:{" "}
                        <span className="font-semibold">{activeView}</span>
                      </p>
                    </div>
                  </div>
                  <div className="h-[calc(100%-3rem)] overflow-hidden">
                    <div className="text-xl text-gray-800 h-full">
                      {activeView === "editor" ? (
                        <CodeEditor selectedFile={selectedFile} />
                      ) : (
                        <PreviewFrame webContainer={webcontainerState} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : currentPage === "components" ? (
              <InternalComponents />
            ) : (
              <Settings />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
