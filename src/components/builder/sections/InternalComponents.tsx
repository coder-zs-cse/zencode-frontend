import React, { useEffect, useState } from "react";
import { ComponentCard } from "@/components/ui/card-component/card-component";
import { ComponentDetail } from "@/components/ui/details-component/details-component";
import { find_components_endpoint } from "@/api/library/library";

export interface Component {
  componentName: string;
  indexingStatus: boolean;
  componentPath: string;
  description: string;
  useCase: string;
  codeSamples: string[];
  dependencies: string[];
  importPath: string;
}

const components: Component[] = [
  {
    componentName: "Button",
    indexingStatus: true,
    componentPath: "/src/components/Button",
    description:
      "A versatile button component with multiple variants and sizes",
    useCase: "Used for triggering actions or submitting forms",
    codeSamples: [
      '<Button variant="primary">Click me</Button>',
      '<Button variant="secondary" size="sm">Small Button</Button>',
    ],
    dependencies: ["react", "tailwindcss"],
    importPath: "@/components/Button",
  },
  {
    componentName: "Card",
    indexingStatus: true,
    componentPath: "/src/components/Card",
    description:
      "A flexible card component for displaying content in a contained format",
    useCase: "Displaying grouped information in a visually appealing way",
    codeSamples: ['<Card title="Example">Content goes here</Card>'],
    dependencies: ["react", "tailwindcss"],
    importPath: "@/components/Card",
  },
  {
    componentName: "Input",
    indexingStatus: false,
    componentPath: "/src/components/Input",
    description:
      "An input component with built-in validation and error handling",
    useCase: "Form inputs with validation support",
    codeSamples: ['<Input type="text" placeholder="Enter your name" />'],
    dependencies: ["react", "tailwindcss"],
    importPath: "@/components/Input",
  },
  {
    componentName: "Modal",
    indexingStatus: true,
    componentPath: "/src/components/Modal",
    description: "A modal dialog component with backdrop and animation",
    useCase: "Displaying important information or confirmations",
    codeSamples: [
      "<Modal isOpen={true} onClose={() => {}}>Modal content</Modal>",
    ],
    dependencies: ["react", "tailwindcss"],
    importPath: "@/components/Modal",
  },
  {
    componentName: "Button",
    indexingStatus: true,
    componentPath: "/src/components/Button",
    description:
      "A versatile button component with multiple variants and sizes",
    useCase: "Used for triggering actions or submitting forms",
    codeSamples: [
      '<Button variant="primary">Click me</Button>',
      '<Button variant="secondary" size="sm">Small Button</Button>',
    ],
    dependencies: ["react", "tailwindcss"],
    importPath: "@/components/Button",
  },
  {
    componentName: "Card",
    indexingStatus: true,
    componentPath: "/src/components/Card",
    description:
      "A flexible card component for displaying content in a contained format",
    useCase: "Displaying grouped information in a visually appealing way",
    codeSamples: ['<Card title="Example">Content goes here</Card>'],
    dependencies: ["react", "tailwindcss"],
    importPath: "@/components/Card",
  },
  {
    componentName: "Input",
    indexingStatus: false,
    componentPath: "/src/components/Input",
    description:
      "An input component with built-in validation and error handling",
    useCase: "Form inputs with validation support",
    codeSamples: ['<Input type="text" placeholder="Enter your name" />'],
    dependencies: ["react", "tailwindcss"],
    importPath: "@/components/Input",
  },
  {
    componentName: "Modal",
    indexingStatus: true,
    componentPath: "/src/components/Modal",
    description: "A modal dialog component with backdrop and animation",
    useCase: "Displaying important information or confirmations",
    codeSamples: [
      "<Modal isOpen={true} onClose={() => {}}>Modal content</Modal>",
    ],
    dependencies: ["react", "tailwindcss"],
    importPath: "@/components/Modal",
  },
  {
    componentName: "Button",
    indexingStatus: true,
    componentPath: "/src/components/Button",
    description:
      "A versatile button component with multiple variants and sizes",
    useCase: "Used for triggering actions or submitting forms",
    codeSamples: [
      '<Button variant="primary">Click me</Button>',
      '<Button variant="secondary" size="sm">Small Button</Button>',
    ],
    dependencies: ["react", "tailwindcss"],
    importPath: "@/components/Button",
  },
  {
    componentName: "Card",
    indexingStatus: true,
    componentPath: "/src/components/Card",
    description:
      "A flexible card component for displaying content in a contained format",
    useCase: "Displaying grouped information in a visually appealing way",
    codeSamples: ['<Card title="Example">Content goes here</Card>'],
    dependencies: ["react", "tailwindcss"],
    importPath: "@/components/Card",
  },
  {
    componentName: "Input",
    indexingStatus: false,
    componentPath: "/src/components/Input",
    description:
      "An input component with built-in validation and error handling",
    useCase: "Form inputs with validation support",
    codeSamples: ['<Input type="text" placeholder="Enter your name" />'],
    dependencies: ["react", "tailwindcss"],
    importPath: "@/components/Input",
  },
  {
    componentName: "Modal",
    indexingStatus: true,
    componentPath: "/src/components/Modal",
    description: "A modal dialog component with backdrop and animation",
    useCase: "Displaying important information or confirmations",
    codeSamples: [
      "<Modal isOpen={true} onClose={() => {}}>Modal content</Modal>",
    ],
    dependencies: ["react", "tailwindcss"],
    importPath: "@/components/Modal",
  },
];

export function InternalComponents() {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(
    null
  );
  const [componentList, setComponentList] = useState<Component[]>([]);

  async function fetchData() {
    try {
      const components = await find_components_endpoint();
      setComponentList(components);
    } catch (error) {
      console.log("error in fetching internal components", error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-8 bg-slate-900 h-screen overflow-y-auto scrollable-content">
      <h1 className="text-2xl font-semibold text-white mb-6">Library</h1>
      <div className="flex flex-wrap">
        {componentList.length > 0 ? (
          componentList.map((component) => (
            <div key={component.componentName} className="w-1/4 p-2">
              <ComponentCard
                key={component.componentName}
                component={component}
                onClick={() => setSelectedComponent(component)}
              />
            </div>
          ))
        ) : (
          <div className="w-full text-center text-white py-8">
            Please index your internal library
          </div>
        )}
      </div>

      {selectedComponent && (
        <ComponentDetail
          component={selectedComponent}
          onClose={() => setSelectedComponent(null)}
        />
      )}
    </div>
  );
}
