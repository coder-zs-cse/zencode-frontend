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
  onEdit: () => void;
}

export function ComponentCard({ component, onClick, onEdit }: ComponentCardProps) {
  return (
    <div className=" bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 animate-in fade-in">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-100">{component.componentName}</h3>
            {component.indexingStatus ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400" />
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Component Path</h4>
            <p className="text-slate-300 text-sm line-clamp-2 bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              {component.componentPath}
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Description</h4>
            <p className="text-slate-300 text-sm line-clamp-2 bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              {component.description.substring(0.20)+"..."}
            </p>
          </div>
        </div>
<div className='flex'>

        <button
          onClick={onClick}
          className="w-1/2 mt-2 m-2 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 px-4 rounded-lg transition-colors duration-200 font-medium group"
          >
          View Details
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={onEdit}
          className="w-1/2 mt-2 m-2 flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-700 text-slate-200 py-2.5 px-4 rounded-lg transition-colors duration-200 font-medium group"
          >
          Edit Details
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
          </div>
      </div>
    </div>
  );
}