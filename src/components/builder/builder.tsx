"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { template_endpoint } from "@/api";

import {
  CodeEditor,
  FileExplorer,
  PreviewFrame,
  ProgressSteps,
  PromptField,
} from "@/components/builder/sections";
import { Navbar, CapsuleToggle } from "@/components/ui";
import { buildFileNodeTree, applyStepsToCodebase } from "@/lib/utils/parsing";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const query = searchParams.get("query");
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [fileNode, setFileNode] = useState<FileNode[]>([]);
  const [stepSets, setStepSets] = useState<Step[][]>([]);
  const [currentPage, setCurrentPage] = useState<
    "code-editor" | "components" | "settings"
  >("code-editor");
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor");
  const webcontainerState = useWebContainer(fileNode);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const templateData: templateAPIResponse = await template_endpoint();
        if (templateData) {
          console.log("Here is ", templateData);
          const updatedSteps = templateData.template.map((step) => ({
            ...step,
            status: StepStatus.COMPLETED,
            type: step.type as StepType,
          }));
          setStepSets([[...updatedSteps]]);
          setFileNode(buildFileNodeTree(updatedSteps));
        }
      } catch (error) {
        console.error("Error calling endpoints:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  function onFileClick(file: FileNode) {
    setActiveView("editor");
    setSelectedFile(file);
  }

  const addNewSteps = (newSteps: Step[]) => {
    setStepSets((prevSets) => [...prevSets, newSteps]);
    setFileNode((currentFiles) => applyStepsToCodebase(currentFiles, newSteps));
  };

  // Function to filter file nodes based on visible steps
  const getFilteredFileNodes = (nodes: FileNode[]): FileNode[] => {
    return nodes
      .map((node) => {
        if (node.type === "folder") {
          const filteredChildren = node.children
            ? getFilteredFileNodes(node.children)
            : [];
          return {
            ...node,
            children:
              filteredChildren.length > 0 ? filteredChildren : undefined,
          };
        }
        return node;
      })
      .filter((node) => {
        if (node.type === "folder") {
          return node.children && node.children.length > 0;
        }
        // For files, check if they correspond to any visible step
        return Object.entries(visibleSteps).some(([key, isVisible]) => {
          if (!isVisible) return false;
          const [setIndex, stepIndex] = key.split("-").map(Number);
          const step = stepSets[setIndex]?.[stepIndex];
          return step?.path === node.path;
        });
      });
  };

  return (
    <div className="h-screen">
      <Navbar fileNode={fileNode} />
      <div className="h-[92%] bg-gray-100 flex">
        <Sidebar
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded(!isExpanded)}
          onNavigate={setCurrentPage}
          currentPage={currentPage}
        />
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col h-full ">
            {currentPage === "code-editor" ? (
              <div className="flex-1 bg-gradient-to-r from-slate-950 to-slate-900 transition-all duration-200 animate-in fade-in text-white flex overflow-hidden">
                <div className="flex-1 flex flex-col space-between w-[40%]">
                  <div className="flex h-[80%] overflow-hidden w-full">
                    <ProgressSteps
                      stepSets={stepSets}
                      onVisibleStepsChange={setVisibleSteps}
                      isLoading={isLoading}
                    />
                    <FileExplorer
                      FileNode={getFilteredFileNodes(fileNode)}
                      onFileSelect={onFileClick}
                      selectedFile={selectedFile}
                      showCheckboxes={showCheckboxes}
                      selectedFiles={selectedFiles}
                      setSelectedFiles={setSelectedFiles}
                      isLoading={isLoading}
                    />
                  </div>
                  <div className="h-[20%]">
                    <PromptField
                      fileNode={fileNode}
                      onNewSteps={(steps) => {
                        addNewSteps(steps);
                      }}
                      showCheckboxes={showCheckboxes}
                      setCheckboxes={setShowCheckboxes}
                      selectedFiles={selectedFiles}
                    />
                  </div>
                </div>
                <div className="flex-1  overflow-hidden">
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
                  <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className="flex-1 text-xl text-gray-800 ">
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
