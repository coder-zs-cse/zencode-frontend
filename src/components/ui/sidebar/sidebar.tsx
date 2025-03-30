import React from "react";
import { Menu, Code, Layout, Settings } from "lucide-react";

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: (page: "code-editor" | "components" | "settings") => void;
  currentPage: string;
}

export function Sidebar({ isExpanded, onToggle, onNavigate }: SidebarProps) {
  return (
    <div
      className={` bg-[#0A1A2F] border-b  border-[#1E3A5F] shadow-lg transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      <button
        onClick={onToggle}
        className="p-4 hover:bg-[#1E3A5F] transition-colors"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      <div className="flex-1 py-4">
        <button
          className="w-full p-4 flex items-center gap-3 hover:bg-[#1E3A5F] transition-colors"
          onClick={() => onNavigate("code-editor")}
        >
          <Code className="w-6 h-6 text-white" />
          {isExpanded && <span className="text-white">Code Editor</span>}
        </button>
        <button
          className="w-full p-4 flex items-center gap-3 hover:bg-[#1E3A5F] transition-colors"
          onClick={() => onNavigate("components")}
        >
          <Layout className="w-6 h-6 text-white" />
          {isExpanded && <span className="text-white">Library</span>}
        </button>
        <button
          className="w-full p-4 flex items-center gap-3 hover:bg-[#1E3A5F] transition-colors"
          onClick={() => onNavigate("settings")}
        >
          <Settings className="w-6 h-6 text-white" />
          {isExpanded && <span className="text-white">Settings </span>}
        </button>
      </div>
    </div>
  );
}
