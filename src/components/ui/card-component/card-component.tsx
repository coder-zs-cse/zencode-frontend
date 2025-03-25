import React from 'react';
import { ChevronRight, CheckCircle, XCircle } from 'lucide-react';

export interface Component {
    componentName: string;
    indexingStatus: boolean;
    componentPath: string;
    description: string;
    useCase: string;
    codeSamples: string[];
    dependencies: string[];
    importPath: string;
  }

interface ComponentCardProps {
  component: Component;
  onClick: () => void;
}

export function ComponentCard({ component, onClick }: ComponentCardProps) {
  return (
    <div className="bg-blue-900  rounded-lg shadow-md p-6 max-w-full max-h-full hover:shadow-lg transition-shadow" >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 ">
            <h3 className="text-lg font-semibold ">{component.componentName}</h3>
            {component.indexingStatus ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
          <p className="line-clamp-2 mt-4 p-2">Use Case: {component.useCase.substring(0,30)}...</p>
          <p className="line-clamp-2 mt-4 p-2">Description: {component.description.substring(0,60)}...</p>
        </div>
      </div>
      
      
      <button
        onClick={onClick}
        className="mt-4 flex items-center p-2 bg-amber-300 rounded-lg text-blue-900 hover:bg-amber-200 hover:cursor-pointer transition-colors  font-semibold"
      >
        Read more
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
}