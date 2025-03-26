import React, { useState } from "react";
import { CheckCircle, Settings, Share, X } from "lucide-react";
import { Step } from "@/types";
import { exportToZip } from "@/lib/utils/exportFolder";
import { SuccessPopup } from "../success-popup/sucess-popup";


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



export function Navbar({ template }: NavbarProps) {
  const [successPopup, setSuccessPopup] = useState(false);
  const handleExport = async () => {
    const status = await exportToZip({ template });
    setSuccessPopup(status);
    setTimeout(() => setSuccessPopup(false), 4000);
  };
  return (
    <>
      <nav className="bg-[#0A1A2F] border-b border-[#1E3A5F] px-4">
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

 
            </div>
          </div>
        </div>
      </nav>

      {successPopup && <SuccessPopup />}
    </>
  );
}
