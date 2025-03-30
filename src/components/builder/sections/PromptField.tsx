"use client";
import { TextArea } from "@/components/ui";
import { SendHorizontal } from "lucide-react";
import { useState } from "react";

const PromptField = function () {
  const [prompt, setPrompt] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      console.log("success");
    }
  };
  return (
    <div className="flex-1 border bg-gray-800 border-gray-700 rounded-2xl">
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
          className=" bg-blue-500  hover:bg-blue-600 px-2 py-2 rounded-lg transition-colors"
        >
          <SendHorizontal />
        </button>
      </div>
    </div>
  );
};

export { PromptField };
