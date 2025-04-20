import React from "react";

export const INDEXING_STATUS = {
  IN_PROGRESS: "IN_PROGRESS",
  NOT_STARTED: "NOT_STARTED",
  COMPLETED: "COMPLETED",
} as const;

type IndexingStatus = (typeof INDEXING_STATUS)[keyof typeof INDEXING_STATUS];

interface IndexingIndicatorProps {
  indexingStatus?: IndexingStatus;
}

export function IndexingIndicator({ indexingStatus }: IndexingIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {indexingStatus === INDEXING_STATUS.NOT_STARTED ? (
        <>
          <div className="w-2 h-2 rounded-full bg-blue-800"></div>
          <span className="text-sm text-blue-800">Indexing not started</span>
        </>
      ) : indexingStatus === INDEXING_STATUS.IN_PROGRESS ? (
        <>
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-[blink_1.5s_ease-in-out_infinite]"></div>
          <span className="text-sm text-yellow-400">Indexing in progress</span>
        </>
      ) : indexingStatus === INDEXING_STATUS.COMPLETED ? (
        <>
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span className="text-sm text-green-400">Indexing completed</span>
        </>
      ) : null}
    </div>
  );
}
