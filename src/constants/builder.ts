export interface FileStructure {
  name: string;
  type: 'file' | 'folder';
  children?: FileStructure[];
  content?: string;
}

export const PROGRESS_STEPS = [
  'Analyzing requirements...',
  'Generating file structure...',
  'Creating components...',
  'Implementing styles...',
  'Setting up routing...',
  'Adding functionality...',
  'Optimizing performance...',
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