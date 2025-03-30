import { Step } from "./steps";

export interface templateAPIResponse{
    template: Step[]
}

enum IndexingStatus  {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    ERROR = 'ERROR',
    COMPLETED = 'COMPLETED'
  };
export interface userAPIResponse{
    id: string,
    indexingStatus:IndexingStatus,
}

export interface generateAPIResponse{
    output:Step[]
}