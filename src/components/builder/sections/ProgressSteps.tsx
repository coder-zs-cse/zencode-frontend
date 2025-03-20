"use client";
import React, { Component, HTMLAttributes } from "react";
import {
  CheckCircle,
  Clock,
  FilePlus,
  FileText,
  FileX,
  Folder,
  Loader2,
  MessageSquare,
  Terminal,
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
  steps: Step[];
}
export default function ProgressSteps({ steps }: ProgressStepsProps) {
  const getStatusIcon = (status: StepStatus = StepStatus.PENDING) => {
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
      case StepType.RunScript:
        return <Terminal className={iconClass} />;
      case StepType.InternalComponentImport:
        return <Component className={iconClass} />;
      default:
        return <MessageSquare className={iconClass} />;
    }
  };

  const StepContent = ({ step }: { step: Step }) => {
    const statusColor = getStatusColor(step.status);
    if (step.description == "") {
      return null;
    }
    switch (step.type) {

      case StepType.RunScript:
        return (
          <pre className="mt-2 p-4 bg-gray-800/50 text-gray-300 rounded-lg overflow-x-auto  border border-gray-700">
            <code>{step.description}</code>
          </pre>
        );
      case StepType.TextDisplay:
        return <p className="mt-2 text-gray-400">{step.description}</p>;
      default:
        return (
          <div className={`mt-2 p-3 rounded-lg border ${statusColor}`}>
            {step.description}
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-gray-800 p-4 overflow-y-auto scrollable-content">
      <h2 className="text-xl font-bold mb-4">Progress</h2>
      <div className="space-y-3">
        <div className="w-full max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-xl shadow-black/20 p-6 border border-gray-700">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
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
                        {getStatusIcon(step.status)}
                      </div>
                    </div>
                    <StepContent step={step} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
