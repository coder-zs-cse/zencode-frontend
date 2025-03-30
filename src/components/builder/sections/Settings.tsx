import React, { useState } from "react";

export function Settings() {
  const [repoUrl, setRepoUrl] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [showInternalConfig, setShowInternalConfig] = useState(false);

  return (
    <div className="p-8 bg-gray-900 h-screen overflow-y-auto scrollable-content">
      <h1 className="text-2xl font-semibold text-white mb-6">Settings</h1>
      <div>
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between py-2">
            <div className="flex flex-col">
              <span className="text-xl text-gray-200">Configure Library</span>
              <span className="text-l text-gray-500">
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
                  className="block text-sm font-medium text-gray-200"
                >
                  GitHub Repository URL
                </label>
                <input
                  id="repoUrl"
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://github.com/username/repo"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="authToken"
                  className="block text-sm font-medium text-gray-200"
                >
                  GitHub Authorization Token (optional)
                </label>
                <input
                  id="authToken"
                  type="password"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ghp_xxxxxxxxxxxx"
                />
                <div className="flex justify-end gap-3 p-4 pt-8">
                  <button className="px-8 py-4 text-m font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                   Start Indexing
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
