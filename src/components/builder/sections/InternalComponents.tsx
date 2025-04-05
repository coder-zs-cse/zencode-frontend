import React, { useEffect, useState } from "react";
import { ComponentCard } from "@/components/ui/card-component/card-component";
import { ComponentDetail } from "@/components/ui/details-component/details-component";
import { find_components_endpoint } from "@/api/library/library";
import { Search } from "lucide-react";

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

export function InternalComponents() {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [componentList, setComponentList] = useState<Component[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredComponents = componentList.filter((component) =>
    component.componentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 bg-slate-900 min-h-screen overflow-y-auto scrollable-content">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Library</h1>

      </div>
      <div className="relative flex justify-center pb-4">
          <input
            type="text"
            placeholder="Search component"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[85%] pl-10 pr-8 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
          />
      <Search className="absolute left-36  top-1/3 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        </div>

      <div className="flex flex-wrap">
        {filteredComponents.length > 0 ? (
          filteredComponents.map((component) => (
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
            {componentList.length === 0
              ? "Please index your internal library"
              : "No components found matching your search"}
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

export default InternalComponents;