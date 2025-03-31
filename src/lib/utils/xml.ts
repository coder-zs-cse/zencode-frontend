import { Step } from "@/types";
import { StepStatus, StepType } from "@/types/steps";
/*
 * Parse input XML and convert it into steps.
 * Eg: Input - 
 * <ZenCodeArtifact id=\"project-import\" title=\"Project Files\">
 *  <ZenCodeAction type=\"file\" filePath=\"eslint.config.js\">
 *      import js from '@eslint/js';\nimport globals from 'globals';\n
 *  </ZenCodeAction>
 * <ZenCodeAction type="shell">
 *      node index.js
 * </ZenCodeAction>
 * </ZenCodeArtifact>
 * 
 * Output - 
 * [{
 *      title: "Project Files",
 *      status: "Pending"
 * }, {
 *      title: "Create eslint.config.js",
 *      type: StepType.CreateFile,
 *      code: "import js from '@eslint/js';\nimport globals from 'globals';\n"
 * }, {
 *      title: "Run command",
 *      code: "node index.js",
 *      type: StepType.RunScript
 * }]
 * 
 * The input can have strings in the middle they need to be ignored
 */
export function parseXml(response: string): Step[] {
    // Extract the XML content between <ZenCodeArtifact> tags
    const xmlMatch = response.match(/<ZenCodeArtifact[^>]*>([\s\S]*?)<\/ZenCodeArtifact>/);
    
    if (!xmlMatch) {
      return [];
    }
  
    const xmlContent = xmlMatch[1];
    const steps: Step[] = [];
    let stepId = 1;
  
    // Extract artifact title
    const titleMatch = response.match(/title="([^"]*)"/);
    const artifactTitle = titleMatch ? titleMatch[1] : 'Project Files';
  
    // Add initial artifact step
    steps.push({
      id: stepId++,
      path: "",
      title: artifactTitle,
      description: '',
      type: StepType.CreateFolder,
      status: StepStatus.PENDING
    });
  
    // Regular expression to find ZenCodeAction elements
    const actionRegex = /<ZenCodeAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/ZenCodeAction>/g;
    
    let match;
    while ((match = actionRegex.exec(xmlContent)) !== null) {
      const [, type, filePath, content] = match;
  
      if (type === 'file') {
        // File creation step
        steps.push({
          id: stepId++,
          title: `Create ${filePath || 'file'}`,
          description: '',
          type: StepType.CreateFile,
          status: StepStatus.PENDING,
          content: content.trim(),
          path: filePath
        });
      } else if (type === 'shell') {
        // Shell command step
        steps.push({
          id: stepId++,
          title: 'Run command',
          path: filePath,
          description: '',
          type: StepType.RunScript,
          status: StepStatus.PENDING,
          content: content.trim()
        });
      }
    }
  
    return steps;
  }