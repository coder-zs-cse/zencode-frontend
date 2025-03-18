import { FileStructure } from "@/types";



export const INITIAL_FILE_STRUCTURE: FileStructure[] = [
  {
    name: 'src',
    type: 'folder',
    path: 'src',
    children: [
      {
        name: 'components',
        type: 'folder',
        path: 'src/components',
        children: [
          {
            name: 'Header.tsx',
            type: 'file',
            content: '// Header component code here',
            path: 'src/components/Header.tsx'
          },
          {
            name: 'Footer.tsx',
            type: 'file',
            content: '// Footer component code here',
            path: 'src/components/Footer.tsx'
          }
        ]
      },
      {
        name: 'App.tsx',
        type: 'file',
        content: '// App component code here',
        path: 'src/App.tsx'
      }
    ]
  },
  {
    name: 'public',
    type: 'folder',
    path: 'public',
    children: [
      {
        name: 'index.html',
        type: 'file',
        content: '<!-- HTML template -->',
        path: 'public/index.html'
      }
    ]
  },
  {
    name: 'next.config.js',
    type: 'file',
    content: "next config file",
    path: 'next.config.js'
  }
]; 