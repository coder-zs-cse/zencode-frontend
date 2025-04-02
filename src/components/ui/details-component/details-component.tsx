import React from "react";
import { X, CheckCircle, XCircle } from "lucide-react";

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
    <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div
        className="bg-slate-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-slate-950 to-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-slate-100">
              {component.componentName}
            </h2>
            {component.indexingStatus ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 animate-in zoom-in duration-200" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 animate-in zoom-in duration-200" />
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-800/80 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                Component Path
              </h3>
              {component.componentPath ? (
                <p className="text-slate-300 font-mono text-sm bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                  {component.componentPath}
                </p>
              ) : (
                <p className="text-white font-mono text-sm bg-red-400 p-2 rounded-lg text-center border border-slate-700">
                  {"Component Path Not Added"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                Import Path
              </h3>
              {component.importPath ? (
                <code className="block bg-slate-800/50 p-2 rounded-lg font-mono text-sm text-slate-300 border border-slate-700">
                  {component.importPath}
                </code>
              ) : (
                <code className="block  p-2 rounded-lg font-mono text-sm bg-red-400 text-white text-center border border-slate-700">
                  {"Import Path Not Added"}
                </code>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              Description
            </h3>
            {component.description ? (
              <p className="text-slate-300 leading-relaxed">
                {component.description}
              </p>
            ) : (
              <p className="bg-red-400 p-2 rounded-lg text-center text-white leading-relaxed">
                {"Description not added"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              Use Case
            </h3>
            {component.useCase ? (
              <p className="text-slate-300 leading-relaxed">
                {component.useCase}
              </p>
            ) : (
              <p className="bg-red-400 p-2 rounded-lg text-center text-white leading-relaxed">
                {"Usecase not added"}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              Code Samples
            </h3>
            <div className="space-y-3">
              {component.codeSamples?.map((sample, index) => (
                <pre
                  key={index}
                  className="bg-slate-800/50 p-4 rounded-lg overflow-x-auto border border-slate-700"
                >
                  <code className="text-sm font-mono text-slate-300">
                    {sample}
                  </code>
                </pre>
              ))}
              {component.codeSamples.length == 0 ? (
                <div className="px-54 py-2 bg-red-400 text-white text-sm text-center font-semibold border border-slate-700">
                  <span>{"CodeSamples not added"}</span>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              Dependencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {component.dependencies?.map((dep, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm font-medium border border-slate-700"
                >
                  {dep}
                </span>
              ))}
              {component.dependencies.length == 0 ? (
                <div className="px-54 py-2 bg-red-400 rounded-lg text-white text-md text-center font-medium border border-slate-700">
                  <span>{"Dependencies not added"}</span>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
