export enum StepStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum StepType {
  CreateFile, // title is Creating FilePath, content is present, path is present
  CreateFolder, // title is Creating FolderPath, content is empty, path is present
  EditFile, // title is Editing FileName, content is present, path is present
  DeleteFile, // title is Deleting FileName, content is empty, path is present
  RunScript,
  TextDisplay, //title is empty, content has text, path is empty
  InternalComponentImport, // title is importing internal component, content has the code, path is prese
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
