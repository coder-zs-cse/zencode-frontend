import { Step, FileNode, FileNodeType    } from "@/types";

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
