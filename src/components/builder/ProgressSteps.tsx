import React from 'react';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';

export enum StepStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface Step {
  title: string;
  status: StepStatus;
}

interface ProgressStepsProps {
  steps: Step[];
}

export default function ProgressSteps({ 
  steps, 
}: ProgressStepsProps) {
  
  const getStatusIcon = (status: StepStatus) => {
    switch (status) {
      case StepStatus.COMPLETED:
        return <CheckCircle size={18} className="text-green-400" />;
      case StepStatus.IN_PROGRESS:
        return <Loader2 size={18} className="text-blue-400 animate-spin" />;
      case StepStatus.PENDING:
        return <Clock size={18} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: StepStatus) => {
    
    switch (status) {
      case StepStatus.COMPLETED:
        return 'bg-green-800/30 hover:bg-green-800/50 border-green-500';
      case StepStatus.IN_PROGRESS:
        return 'bg-blue-800/30 hover:bg-blue-800/50 border-blue-500';
      case StepStatus.PENDING:
        return 'bg-gray-700 hover:bg-gray-600';
    }
  };

  return (
    <div className="w-64 bg-gray-800 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Progress</h2>
      <div className="space-y-3">
        {steps.map((step, index) => {
          
          return (
            <div
              key={index}
              className={`
                p-3 rounded-lg transition-all duration-200 ease-in-out
                ${getStatusColor(step.status)}
                ${step.status === StepStatus.COMPLETED || step.status === StepStatus.IN_PROGRESS ? 'border border-opacity-50' : ''}
                flex items-center gap-2 cursor-pointer
              `}
            >
              {getStatusIcon(step.status)}
              <span className={`
                ${step.status === StepStatus.COMPLETED ? 'text-green-100' : ''}
                ${step.status === StepStatus.IN_PROGRESS ? 'text-blue-100 font-medium' : ''}
                ${step.status === StepStatus.PENDING ? 'text-gray-300' : ''}
              `}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 