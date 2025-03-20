import { FileNode, FileNodeType } from "@/types";



export const INITIAL_FILE_STRUCTURE: FileNode[] = [
  {
    name: 'src',
    type: FileNodeType.folder,
    path: 'src',
    children: [
      {
        name: 'components',
        type: FileNodeType.folder,
        path: 'src/components',
        children: [
          {
            name: 'Header.tsx',
            type: FileNodeType.file,
            content: '// Header component code here',
            path: 'src/components/Header.tsx'
          },
          {
            name: 'Footer.tsx',
            type: FileNodeType.file,
            content: '// Footer component code here',
            path: 'src/components/Footer.tsx'
          }
        ]
      },
      {
        name: 'App.tsx',
        type: FileNodeType.file,
        content: '// App component code here',
        path: 'src/App.tsx'
      }
    ]
  },
  {
    name: 'public',
    type: FileNodeType.folder,
    path: 'public',
    children: [
      {
        name: 'index.html',
        type: FileNodeType.file,
        content: '<!-- HTML template -->',
        path: 'public/index.html'
      }
    ]
  },
  {
    name: 'next.config.js',
    type: FileNodeType.file,
    content: "next config file",
    path: 'next.config.js'
  }
]; 