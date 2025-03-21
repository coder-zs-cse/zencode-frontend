import React, { useState } from "react";
import { CheckCircle, Settings, Share, X } from "lucide-react";
import { Step } from "@/types";
import { exportToZip } from "@/lib/utils/exportFolder";
import { SuccessPopup } from "../success-popup/sucess-popup";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavbarProps {
  template: Step[];
}

function IndexingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-yellow-400 animate-[blink_1.5s_ease-in-out_infinite]"></div>
      <span className="text-sm text-yellow-400">Indexing in progress</span>
    </div>
  );
}

function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [repoUrl, setRepoUrl] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [showInternalConfig, setShowInternalConfig] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">
                Configure Internal Components
              </span>
              <span className="text-xs text-gray-500">
                Enable to configure GitHub repository settings
              </span>
            </div>
            <button
              onClick={() => setShowInternalConfig(!showInternalConfig)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                showInternalConfig ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showInternalConfig ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {showInternalConfig && (
            <>
              <div className="space-y-2">
                <label
                  htmlFor="repoUrl"
                  className="block text-sm font-medium text-gray-700"
                >
                  GitHub Repository URL
                </label>
                <input
                  id="repoUrl"
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 text-black focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://github.com/username/repo"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="authToken"
                  className="block text-sm font-medium text-gray-700"
                >
                  GitHub Authorization Token (optional)
                </label>
                <input
                  id="authToken"
                  type="password"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 text-black focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ghp_xxxxxxxxxxxx"
                />
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Handle save logic here
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export function Navbar({ template }: NavbarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const handleExport = async () => {
    const status = await exportToZip({ template });
    setSuccessPopup(status);
    setTimeout(() => setSuccessPopup(false), 4000);
  };
  return (
    <>
      <nav className="bg-[#0A1A2F] border-b border-[#1E3A5F]">
        <div className=" mx-2">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white tracking-tight mr-8">
                ZenCode AI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <IndexingIndicator />
              <button
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#1E3A5F] rounded-md hover:bg-[#2A4A7F] transition-colors gap-2"
                title="Export"
                onClick={handleExport}
              >
                <Share size={18} />
                Export
              </button>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-gray-300 hover:text-white rounded-md hover:bg-[#1E3A5F] transition-colors"
                title="Settings"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      {successPopup && <SuccessPopup />}
    </>
  );
}
