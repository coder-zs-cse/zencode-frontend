export enum FileNodeType {
  file = "file",
  folder = "folder",
}
export interface FileNode {
  name: string;
  type: FileNodeType;
  children?: FileNode[];
  content: string;
  path: string;
}

export enum FileNodeType {
  CreateFile,
  CreateFolder,
  EditFile,
  DeleteFile,
  RunScript,
}
