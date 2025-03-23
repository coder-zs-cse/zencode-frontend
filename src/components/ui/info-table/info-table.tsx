import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { Step } from '@/types';

interface FileInfoProps{
    files:Step[]
}
interface PopupProps {
  files: Step[];
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ files, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full mx-4" onClick={e => e.stopPropagation()}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {files.map((file) => (
              <tr key={file.path.split('/').pop()}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{file.path.split('/').pop()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.path}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button 
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </div>
);

const FileTable: React.FC<FileInfoProps> = ({files}) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
        <button
          onClick={() => setShowPopup(true)}
          className=" px-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Info size={15} />
        </button>
      {showPopup && (
        <Popup
          files={files}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
};

export default FileTable;