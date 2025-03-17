export interface FileStructure {
  name: string;
  type: 'file' | 'folder';
  children?: FileStructure[];
  content?: string;
}

export enum StepStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface Step {
  title: string;
  status: StepStatus;
}

export const PROGRESS_STEPS: Step[] = [
  {
    title: 'Analyzing requirements...',
    status: StepStatus.COMPLETED,
  },
  {
    title: 'Generating file structure...',
    status: StepStatus.COMPLETED,
  },
  {
    title: 'Creating components...',
    status: StepStatus.COMPLETED,
  },
  {
    title: 'Implementing styles...',
    status: StepStatus.IN_PROGRESS,
  },
  {
    title: 'Setting up routing...',
    status: StepStatus.PENDING,
  },
  {
    title: 'Adding functionality...',
    status: StepStatus.PENDING,
  },
  {
    title: 'Optimizing performance...',
    status: StepStatus.PENDING,
  },
];

export const INITIAL_FILE_STRUCTURE: FileStructure[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'components',
        type: 'folder',
        children: [
          {
            name: 'Header.tsx',
            type: 'file',
            content: '// Header component code here'
          },
          {
            name: 'Footer.tsx',
            type: 'file',
            content: '// Footer component code here'
          }
        ]
      },
      {
        name: 'App.tsx',
        type: 'file',
        content: '// App component code here'
      }
    ]
  },
  {
    name: 'public',
    type: 'folder',
    children: [
      {
        name: 'index.html',
        type: 'file',
        content: '<!-- HTML template -->'
      }
    ]
  }
]; 