export interface generateAPIRequest {
  query_text: string;
  conversation: ChatMessage[];
  codebase: FileNode[];
  forcedComponents: string[];
  enableAISelection: boolean;
}

export interface trainingAPIRequest {
  github_url: string;
  access_token: string;
}

export interface FileNode {
  fileName: string;
  filePath: string;
  fileContent: string;
}

interface ChatMessage {
  role: string;
  content: string;
}
