import React from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';

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

interface ComponentDetailProps {
  component: Component;
  onClose: () => void;
}

export function ComponentDetail({ component, onClose }: ComponentDetailProps) {
  return (
    <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-gray-800">{component.componentName}</h2>
              {component.indexingStatus ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800">Component Path</h3>
              <p className="mt-1 text-gray-600">{component.componentPath}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800">Description</h3>
              <p className="mt-1 text-gray-600">{component.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800">Use Case</h3>
              <p className="mt-1 text-gray-600">{component.useCase}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800">Import Path</h3>
              <code className="mt-1 block bg-gray-100 p-2 rounded text-sm">{component.importPath}</code>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800">Code Samples</h3>
              <div className="mt-2 space-y-2">
                {component.codeSamples.map((sample, index) => (
                  <code key={index} className="block bg-gray-100 p-2 rounded text-sm">
                    {sample}
                  </code>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800">Dependencies</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {component.dependencies.map((dep, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}