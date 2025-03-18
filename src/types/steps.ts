export enum StepStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum StepType {
  CreateFile,
  CreateFolder,
  EditFile,
  DeleteFile,
  RunScript,
}

export interface Step {
  id: number;
  title: string;
  description: string;
  type: StepType;
  status: StepStatus;
  code?: string;
  path?: string;
}
