/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import { Share} from "lucide-react";
import { Step, FileNode } from "@/types";
import { exportToZip } from "@/lib/utils/exportFolder";
import { find_user_endpoint } from "@/api";
import { userAPIResponse } from '../../../types/api-response';
import { SuccessPopup } from "../success-popup/sucess-popup";

interface NavbarProps {
  fileNode: FileNode[];
}

const indexingValues = {
  IN_PROGRESS: "IN_PROGRESS",
  NOT_STARTED: "NOT_STARTED",
  COMPLETED: "COMPLETED",
  ERROR: "ERROR"
};
function IndexingIndicator(userResponse : {indexingStatus:string | undefined}) {
  return (
    <div className="flex items-center gap-2">
      {userResponse.indexingStatus === indexingValues.NOT_STARTED ? (
        <>
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <span className="text-sm text-white">Indexing not started</span>
        </>
      ) : userResponse.indexingStatus == indexingValues.IN_PROGRESS ? (
        <>
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-[blink_1.5s_ease-in-out_infinite]"></div>
          <span className="text-sm text-yellow-400">Indexing in progress</span>
        </>
      ) : userResponse.indexingStatus == indexingValues.COMPLETED ? (
        <>
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span className="text-sm text-green-400">Indexing completed</span>
        </>
      ) : userResponse.indexingStatus == indexingValues.ERROR ? (
        <>
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          <span className="text-sm text-red-400">Indexing error</span>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export function Navbar({ fileNode }: NavbarProps) {
  const [githubData, setGithubData] = useState<userAPIResponse | null>(null);
  const [successPopup, setSuccessPopup] = useState(false);

  const fetchGithubData = async () => {
    try {
      const repoData = await find_user_endpoint();
      if (repoData) {
        setGithubData(repoData);
        console.log("GitHub Repository Details:", repoData);
      }
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
    }
  };

  useEffect(() => {
    // Initial fetch of GitHub repository data
    fetchGithubData();

    let interval: NodeJS.Timeout | null = null;

    // Only set up interval if indexing is IN_PROGRESS
    if (githubData?.indexingStatus === indexingValues.IN_PROGRESS || githubData?.indexingStatus === indexingValues.NOT_STARTED) {
      interval = setInterval(fetchGithubData, 10000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [githubData?.indexingStatus]); // Dependency on indexingStatus

  const handleExport = async () => {
    const status = await exportToZip({ fileNode });
    setSuccessPopup(status);
    setTimeout(() => setSuccessPopup(false), 4000);
  };
  return (
    <>
      <nav className="bg-[#0A1A2F] border-b border-[#1E3A5F] px-4 h-[8%] flex flex-col justify-between items-center">
          <div className="flex justify-between mx-2 w-full h-full">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white tracking-tight mr-8">
                ZenCode AI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <IndexingIndicator indexingStatus={githubData?.indexingStatus}/>
              <button
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#1E3A5F] rounded-md hover:bg-[#2A4A7F] transition-colors gap-2"
                title="Export"
                onClick={handleExport}
              >
                <Share size={18} />
                Export
              </button>
            </div>
        </div>
      </nav>

      {successPopup && <SuccessPopup />}
    </>
  );
}
