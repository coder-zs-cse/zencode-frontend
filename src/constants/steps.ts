import { StepType } from '@/types/steps';
import { Step } from '@/types/steps';
import { StepStatus} from "@/types";


export const PROGRESS_STEPS: Step[] = [
  { id:0,
    type: StepType.CreateFile,
    title: "Creating new component",
    description: "Creating Header.tsx component",
    status: StepStatus.COMPLETED
  },
  {
    id:0,
    type: StepType.RunScript,
    title: "Installing dependencies",
    description: "npm install @headlessui/react",
    status: StepStatus.IN_PROGRESS
  },
  {
    id:0,
    type: StepType.EditFile,
    title: "Updating component",
    description: "Adding navigation links to Header.tsx",
    status: StepStatus.PENDING
  },
  {
    id:0,
    type: StepType.CreateFolder,
    title: "Project Folder",
    description: "Creating Directory",
    status: StepStatus.PENDING
  },
  {
    id:0,
    type: StepType.TextDisplay,
    title: "Text Description",
    description: "All changes have been applied successfully!",
    status: StepStatus.PENDING
  },
  {
    id:0,
    type: StepType.DeleteFile,
    title: "Deleted Readme.md",
    description: "removed readme file!",
    status: StepStatus.PENDING
  }
];
