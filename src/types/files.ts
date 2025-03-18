export interface FileStructure {
  name: string;
  type: "file" | "folder";
  children?: FileStructure[];
  content?: string;
  path: string;
}

export enum FileStructureType {
  CreateFile,
  CreateFolder,
  EditFile,
  DeleteFile,
  RunScript,
}
