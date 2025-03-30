interface generateAPIRequest {
    queryText: string;
    conversation: ChatMessage[];
    codebase: FileNode[];
    forcedComponents: string[];
  }
  
  interface FileNode {
    fileName: string;
    filePath: string;
    fileContent: string;
  }
  
  interface ChatMessage {
    role: string;
    content: string;
  }
  