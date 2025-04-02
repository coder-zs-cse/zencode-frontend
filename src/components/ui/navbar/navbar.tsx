/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import { Share} from "lucide-react";
import { Step } from "@/types";
import { exportToZip } from "@/lib/utils/exportFolder";
import { find_user_endpoint } from "@/api";
import { userAPIResponse } from '../../../types/api-response';
import { SuccessPopup } from "../success-popup/sucess-popup";

interface NavbarProps {
  template: Step[];
}

const indexingValues = {
  IN_PROGRESS: "IN_PROGRESS",
  NOT_STARTED: "NOT_STARTED",
  COMPLETED: "COMPLETED",
};
function IndexingIndicator(userResponse : {indexingStatus:string | undefined}) {
  return (
    <div className="flex items-center gap-2">
      {userResponse.indexingStatus === indexingValues.NOT_STARTED ? (
        <>
          <div className="w-2 h-2 rounded-full bg-blue-800"></div>
          <span className="text-sm text-blue-800">Indexing not started</span>
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
      ) : (
        ""
      )}
    </div>
  );
}

export function Navbar({ template }: NavbarProps) {
  const [userResponse, setUserData] = useState<userAPIResponse | null>(null);
  const [successPopup, setSuccessPopup] = useState(false);

  const fetchData = async () => {
    try {
      const userData = await find_user_endpoint();
      if (userData) {
        setUserData(userData);
        console.log("User Details", userData);
      }
    } catch (error) {
      console.error("Error calling endpoints:", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    let interval: NodeJS.Timeout | null = null;

    // Only set up interval if status is IN_PROGRESS
    if (userResponse?.indexingStatus === indexingValues.IN_PROGRESS) {
      interval = setInterval(fetchData, 10000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [userResponse?.indexingStatus]); // Dependency on indexingStatus

  const handleExport = async () => {
    const status = await exportToZip({ template });
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
              <IndexingIndicator indexingStatus = {userResponse?.indexingStatus}/>
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
