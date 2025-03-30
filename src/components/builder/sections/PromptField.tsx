"use client";
import { TextArea } from "@/components/ui";
import { Step } from "@/types";
import { SendHorizontal, Plus, X } from "lucide-react";
import { useState } from "react";

interface PromptProps {
  components: Step[];
}

const PromptField = function ({ components }: PromptProps) {
  const [prompt, setPrompt] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(
    new Set()
  );

  const toggleComponent = (id: string) => {
    const newSelected = new Set(selectedComponents);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedComponents(newSelected);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      console.log("success");
    }
  };
  return (
    <div className="flex-1 border bg-gray-800 border-gray-700 rounded-2xl">
      {isOpen && (
        <div className="absolute left-1/3 ml-60 mb-12 w-68 bg-white rounded-lg shadow-xl border  bottom-6 border-gray-200 p-4 z-50">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 flex justify-around">
            Select Components
          </h3>

          <div className="space-y-2">
            {components.map((component) => (
              <label
                key={component.id}
                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedComponents.has(component.title)}
                  onChange={() => toggleComponent(component.title)}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">
                  {component.path.split("/").pop()}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Selected: {selectedComponents.size} component(s)
            </p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <TextArea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt and see the magic happen:"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e);
            }
          }}
        />
      </form>
      <div className="flex justify-end p-2">
        <button
          type="button"
          onClick={handleSubmit}
          className=" bg-blue-500 hover:bg-blue-600 px-2 py-2 m-2 rounded-lg transition-colors"
        >
          <SendHorizontal />
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-500 hover:bg-blue-600  px-2 py-2 m-2 rounded-lg  transition-colors"
          aria-label={
            isOpen ? "Close component selector" : "Open component selector"
          }
        >
          {isOpen ? <X /> : <Plus />}
        </button>
      </div>
    </div>
  );
};

export { PromptField };
