"use client";
import React, { Component, HTMLAttributes, useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  FilePlus,
  FileText,
  FileX,
  Folder,
  Loader2,
} from "lucide-react";
import { Step } from "@/types";
import { StepType } from "../../../types/steps";

export enum StepStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface StepObject {
  title: string;
  status: StepStatus;
}

interface ProgressStepsProps {
  stepSets: Step[][];
  onVisibleStepsChange?: (visibleSteps: { [key: string]: boolean }) => void;
}

const ProgressSteps = function ({
  stepSets,
  onVisibleStepsChange,
}: ProgressStepsProps) {
  const [loadingSteps, setLoadingSteps] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [visibleSteps, setVisibleSteps] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    // Reset visibility when stepSets change
    setVisibleSteps({});

    // Show steps sequentially
    let currentIndex = 0;
    const totalSteps = stepSets.reduce((acc, steps) => acc + steps.length, 0);

    const showNextStep = () => {
      if (currentIndex >= totalSteps) return;

      let stepCount = 0;
      stepSets.forEach((steps, setIndex) => {
        steps.forEach((step, index) => {
          if (stepCount === currentIndex) {
            const stepKey = `${setIndex}-${index}`;
            setVisibleSteps((prev) => {
              const newVisibleSteps = { ...prev, [stepKey]: true };
              onVisibleStepsChange?.(newVisibleSteps);
              return newVisibleSteps;
            });
            setLoadingSteps((prev) => ({ ...prev, [stepKey]: true }));

            setTimeout(() => {
              setLoadingSteps((prev) => ({ ...prev, [stepKey]: false }));
            }, 1000);
          }
          stepCount++;
        });
      });

      currentIndex++;
      setTimeout(showNextStep, 1000);
    };

    showNextStep();
  }, [stepSets, onVisibleStepsChange]);

  const getStatusIcon = (
    status: StepStatus = StepStatus.PENDING,
    stepKey: string
  ) => {
    if (loadingSteps[stepKey]) {
      return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
    }
    switch (status) {
      case StepStatus.COMPLETED:
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case StepStatus.IN_PROGRESS:
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
      case StepStatus.PENDING:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: StepStatus = StepStatus.PENDING) => {
    switch (status) {
      case StepStatus.COMPLETED:
        return "bg-green-900/30 text-green-400 border-green-700";
      case StepStatus.IN_PROGRESS:
        return "bg-blue-900/30 text-blue-400 border-blue-700";
      case StepStatus.PENDING:
        return "bg-gray-800 text-gray-400 border-gray-700";
    }
  };

  const StepIcon = ({ type }: { type: StepType }) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case StepType.CreateFile:
        return <FilePlus className={iconClass} />;
      case StepType.CreateFolder:
        return <Folder className={iconClass} />;
      case StepType.DeleteFile:
        return <FileX className={iconClass} />;
      case StepType.EditFile:
        return <FileText className={iconClass} />;
      case StepType.InternalComponentImport:
        return <Component className={iconClass} />;
      default:
      // return <MessageSquare className={iconClass} />;
    }
  };

  return (
    <div className="h-full p-4 overflow-y-auto scrollable-content w-[50%]">
      <h2 className="text-xl font-bold mb-4">Progress</h2>
      <div className="space-y-6">
        {stepSets.map((steps, setIndex) => (
          <div
            key={setIndex}
            className="w-full max-w-3xl mx-auto bg-slate-900 rounded-xl shadow-xl shadow-black/20 p-6 border border-gray-700"
          >
            {setIndex > 0 && (
              <div className="mb-4 pb-4 border-b border-gray-700">
                <span className="text-sm text-gray-400">
                  Step Set {setIndex + 1}
                </span>
              </div>
            )}
            <div className="space-y-6">
              {steps.map((step, index) => {
                const stepKey = `${setIndex}-${index}`;
                if (!visibleSteps[stepKey]) return null;

                return (
                  <div key={index} className="relative">
                    {step.type === StepType.TextDisplay ? (
                      <div className="ml-4">
                        <p className="text-white">{step.content}</p>
                      </div>
                    ) : (
                      <div className="flex items-start gap-4">
                        {/* Timeline line */}
                        {index < steps.length - 1 && (
                          <div
                            className={`absolute top-10 left-5 w-0.5 h-full -ml-0.5 ${
                              step.status === StepStatus.COMPLETED
                                ? "bg-green-900/50"
                                : step.status === StepStatus.IN_PROGRESS
                                ? "bg-blue-900/50"
                                : "bg-gray-700"
                            }`}
                          />
                        )}

                        {/* Icon */}
                        <div className="relative z-10">
                          <div
                            className={`p-2 rounded-lg ${getStatusColor(
                              step.status
                            )}`}
                          >
                            <StepIcon type={step.type} />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-200">
                              {step.title || step.type}
                            </h3>
                            <div className="flex items-center">
                              {getStatusIcon(step.status, stepKey)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { ProgressSteps };
