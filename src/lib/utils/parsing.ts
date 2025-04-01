import { Step, FileNode, FileNodeType, StepType } from "@/types";

export function buildFileNodeTree(steps: Step[]): FileNode[] {
  // Create the root node
  const root: FileNode = {
    name: "root",
    type: FileNodeType.folder,
    children: [],
    path: "",
    content:""
  };

  // Process each step
  steps.forEach((step) => {
    // Skip if not a file creation step or if path is missing
    if (!step.path) return;

    // Split the path into segments
    const pathSegments = step.path.split("/");
    const fileName = pathSegments.pop() || "";

    // Start from the root node
    let currentNode = root;
    let currentPath = "";

    // Navigate through the path segments to find or create parent folders
    for (const segment of pathSegments) {
      if (!segment) continue; // Skip empty segments

      currentPath = currentPath ? `${currentPath}/${segment}` : segment;

      // Find if folder already exists
      let folderNode = currentNode.children?.find(
        (child) => child.name === segment && child.type === FileNodeType.folder
      );

      // Create folder if it doesn't exist
      if (!folderNode) {
        folderNode = {
          name: segment,
          type: FileNodeType.folder,
          children: [],
          content:"",
          path: currentPath,
        };
        currentNode.children = currentNode.children || [];
        currentNode.children.push(folderNode);
      }

      // Move to the next level
      currentNode = folderNode;
    }

    // Add the file to the current node
    const fileNode: FileNode = {
      name: fileName,
      type: FileNodeType.file,
      content: step.content,
      path: step.path,
    };

    currentNode.children = currentNode.children || [];
    currentNode.children.push(fileNode);
  });

  return root.children || [];
}

export interface FlattenedFile {
  fileName: string;
  fileContent: string;
  filePath: string;
}

export function flattenFileNodes(nodes: FileNode[]): FlattenedFile[] {
  const flattenedFiles: FlattenedFile[] = [];

  function traverse(node: FileNode, parentPath: string = "") {
    const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;

    if (node.type === "file") {
      flattenedFiles.push({
        fileName: node.name,
        fileContent: node.content || "",
        filePath: currentPath,
      });
    }

    if (node.children) {
      node.children.forEach((child) => traverse(child, currentPath));
    }
  }

  nodes.forEach((node) => traverse(node));
  return flattenedFiles;
}

export function applyStepsToCodebase(currentFileNodes: FileNode[], newSteps: Step[]): FileNode[] {
  // Create a map of existing files for quick lookup
  const fileMap = new Map<string, FileNode>();
  
  function addToMap(nodes: FileNode[], parentPath: string = "") {
    nodes.forEach(node => {
      const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
      fileMap.set(currentPath, { ...node });
      
      if (node.children) {
        addToMap(node.children, currentPath);
      }
    });
  }
  
  // Initialize the map with current files
  addToMap(currentFileNodes);
  
  // Process each step and update the map accordingly
  newSteps.forEach(step => {
    switch (step.type) {
      case StepType.CreateFile:
        fileMap.set(step.path, {
          name: step.path.split("/").pop() || "",
          type: FileNodeType.file,
          content: step.content,
          path: step.path
        });
        break;
        
      case StepType.CreateFolder:
        fileMap.set(step.path, {
          name: step.path.split("/").pop() || "",
          type: FileNodeType.folder,
          children: [],
          content: "",
          path: step.path
        });
        break;
        
      case StepType.EditFile:
        if (fileMap.has(step.path)) {
          const existingFile = fileMap.get(step.path)!;
          fileMap.set(step.path, {
            ...existingFile,
            content: step.content
          });
        }
        break;
        
      case StepType.DeleteFile:
        fileMap.delete(step.path);
        break;
    }
  });
  
  // Rebuild the tree structure from the updated map
  const root: FileNode = {
    name: "root",
    type: FileNodeType.folder,
    children: [],
    path: "",
    content: ""
  };
  
  // Sort paths to ensure parent folders are created before children
  const paths = Array.from(fileMap.keys()).sort();
  
  paths.forEach(path => {
    const node = fileMap.get(path)!;
    const pathSegments = path.split("/");
    const fileName = pathSegments.pop() || "";
    let currentNode = root;
    let currentPath = "";
    
    // Create/navigate folder structure
    for (const segment of pathSegments) {
      if (!segment) continue;
      
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      let folderNode = currentNode.children?.find(
        child => child.name === segment && child.type === FileNodeType.folder
      );
      
      if (!folderNode) {
        folderNode = {
          name: segment,
          type: FileNodeType.folder,
          children: [],
          content: "",
          path: currentPath
        };
        currentNode.children = currentNode.children || [];
        currentNode.children.push(folderNode);
      }
      
      currentNode = folderNode;
    }
    
    // Add the file/folder to its parent
    if (node.type === FileNodeType.file) {
      currentNode.children = currentNode.children || [];
      currentNode.children.push({
        name: fileName,
        type: FileNodeType.file,
        content: node.content,
        path: path
      });
    }
  });
  
  return root.children || [];
}
