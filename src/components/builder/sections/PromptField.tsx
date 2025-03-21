"use client";

import { TextArea } from "@/components/ui";
import { SendHorizontal } from "lucide-react";
import { useState } from "react";
import { query_endpoint } from "@/api/query/query";
import { PromptRequest } from "@/types/api-request";
interface PromptProps {
  xmlFilesData: string;
}

const PromptField = function ({ xmlFilesData }: PromptProps) {
  const [prompt, setPrompt] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      const request: PromptRequest = { fileData: xmlFilesData, prompt: prompt };
      const response = await query_endpoint(request);
      console.log("success");
    }
  };
  return (
    <div>
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
      <button
        type="button"
        onClick={handleSubmit}
        className=" bg-blue-500 absolute hover:bg-blue-600 text-white rounded-lg flex px-2 py-2 ml-10  justify-evenly bottom-6 left-1/3 transition-colors"
      >
        <SendHorizontal />
      </button>
    </div>
  );
};

export { PromptField };
