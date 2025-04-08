import React from "react";
import { Menu, Code, Layout, Settings, LucideIcon } from "lucide-react";

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: (page: "code-editor" | "components" | "settings") => void;
  currentPage: string;
}

interface NavItem {
  id: "code-editor" | "components" | "settings";
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { id: "code-editor", label: "Code Editor", icon: Code },
  { id: "components", label: "Library", icon: Layout },
  { id: "settings", label: "Settings", icon: Settings },
];

const NavButton: React.FC<{
  item: NavItem;
  isExpanded: boolean;
  onClick: () => void;
}> = ({ item: { icon: Icon, label }, isExpanded, onClick }) => (
  <button
    className="w-full p-4 flex items-center gap-3 hover:bg-[#1E3A5F] transition-colors"
    onClick={onClick}
  >
    <Icon className="w-6 h-6 text-white" />
    {isExpanded && <span className="text-white">{label}</span>}
  </button>
);

export function Sidebar({ isExpanded, onToggle, onNavigate }: SidebarProps) {
  return (
    <div
      className={`bg-[#0A1A2F] border-b border-[#1E3A5F] shadow-lg transition-all duration-300 ${
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
        {navItems.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            isExpanded={isExpanded}
            onClick={() => onNavigate(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
