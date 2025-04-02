import React, { useEffect, useState } from "react";
import { SendHorizontal, Plus, X, Check } from "lucide-react";
import { generateAPIRequest } from "@/types/api-request";
import { generate_endpoint } from "@/api/generate/generate";
import { find_components_endpoint } from "@/api/library/library";
import { Component } from "./InternalComponents";
import { FileNode, Step, StepStatus, StepType } from "@/types";
import { flattenFileNodes } from "@/lib/utils/parsing";
import { Loader } from "@/components/ui/loader/loader";

let request: generateAPIRequest = {
  query_text: "",
  conversation: [],
  codebase: [],
  forcedComponents: [],
  enableAISelection: true,
};

interface PromptFieldProps {
  fileNode: FileNode[];
  onNewSteps: (steps: Step[]) => void;
}

const PromptField = function ({ fileNode, onNewSteps }: PromptFieldProps) {
  const [prompt, setPrompt] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [enableAI, setEnableAI] = useState(true);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [forcedComponents, setForcedComponents] = useState<Component[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleComponent = (id: string) => {
    const newSelected = new Set(selectedComponents);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedComponents(Array.from(newSelected));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const flattenedFiles = flattenFileNodes(fileNode);
      request = {
        ...request,
        query_text: prompt,
        forcedComponents: selectedComponents,
        enableAISelection: enableAI,
        codebase: flattenedFiles,
      };

      const generateData = await generate_endpoint(request);
      const newSteps = generateData.generated_code.steps.map(step => ({
        ...step,
        status: step.status || StepStatus.COMPLETED,
        type: step.type as StepType,
      }));

      onNewSteps(newSteps);
      
      request = {
        ...request,
        forcedComponents: [],
        codebase: flattenedFiles,
        conversation: generateData.conversation,
      };

      setPrompt(""); // Clear the prompt after successful submission
    } catch (error) {
      console.log("error in generating data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const components = await find_components_endpoint();
        setForcedComponents(components);
      } catch (error) {
        console.log("error in fetching forced components", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex-1 border bg-slate-900 border-gray-700 rounded-2xl">
      {isOpen && (
        <div className="absolute left-1/3 ml-60 mb-12 w-68 bg-gradient-to-r from-slate-950 to-slate-900 transition-all duration-200 animate-in fade-in rounded-lg shadow-xl border bottom-6 border-gray-200 p-4 z-50">
          <h3 className="text-lg font-semibold mb-3 text-white flex justify-around">
            Select Components
          </h3>

          <div className="space-y-2">
            {forcedComponents.map((component) => (
              <label
                key={component.componentPath}
                className="flex items-center space-x-3 p-2 hover:bg-slate-800/50 rounded-md cursor-pointer transition-all group"
              >
                <div
                  className={`relative w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                    selectedComponents.includes(component.componentPath)
                      ? "border-green-500 bg-green-600"
                      : "border-gray-400 group-hover:border-gray-300"
                  }`}
                  onClick={() => toggleComponent(component.componentPath)}
                >
                  {selectedComponents.includes(component.componentPath) && (
                    <Check size={14} className="text-white" />
                  )}
                </div>
                <span className="text-white text-sm flex-1">
                  {component.componentPath.split("/").pop()}
                </span>
              </label>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white">
                Enable AI Choices
              </h4>
              <button
                onClick={() => setEnableAI(!enableAI)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                  enableAI ? "bg-blue-500" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                    enableAI ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt and see the magic happen:"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          className="w-full h-28 px-4 py-3 bg-slate-900 border border-b-0 border-gray-700 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </form>

      <div className="flex bg-slate-900 justify-end p-2 rounded-b-2xl">
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-500 hover:bg-blue-600 px-2 py-2 m-2 rounded-lg transition-colors duration-200 text-white"
          aria-label={
            isOpen ? "Close component selector" : "Open component selector"
          }
        >
          {isOpen ? <X size={20} /> : <Plus size={20} />}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 px-2 py-2 m-2 rounded-lg transition-colors duration-200 text-white"
        >
          {isLoading ? <Loader size="sm" /> : <SendHorizontal size={20} />}
        </button>
      </div>
    </div>
  );
};

export { PromptField };
