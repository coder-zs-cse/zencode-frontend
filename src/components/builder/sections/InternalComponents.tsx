import React, { useEffect, useState } from "react";
import { ComponentCard } from "@/components/ui/card-component/card-component";
import {
  ComponentDetail,
  EditForm,
} from "@/components/ui/details-component/details-component";
import {
  find_components_endpoint,
  insert_component_endpoint,
} from "@/api/library/library";
import { AlertCircle, Loader2, Search, X } from "lucide-react";

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
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(
    null
  );
  const [selectedEditComponent, setSelectedComponentEdit] =
    useState<Component | null>(null);
  const [componentList, setComponentList] = useState<Component[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddComponent, setShowAddComponent] = useState(false);
  const [newComponent, setNewComponent] = useState<Component>({
    componentName: "",
    indexingStatus: false,
    componentPath: "",
    description: "",
    useCase: "",
    codeSamples: [],
    dependencies: [],
    importPath: "",
  });

  async function fetchData() {
    try {
      setIsLoading(true);
      const components = await find_components_endpoint();
      setComponentList(components);
    } catch (error) {
      console.log("error in fetching internal components", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filteredComponents = componentList.filter((component) =>
    component.componentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddComponent = async (component: Component) => {
    try {
      await insert_component_endpoint(component);
      setShowAddComponent(false);
      fetchData(); // Refresh the component list
    } catch (error) {
      console.error("Error adding component:", error);
    }
  };

  return (
    <div className="p-8 bg-slate-900 min-h-full overflow-y-auto scrollable-content">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Library</h1>
        <button
          onClick={() => setShowAddComponent(true)}
          className="flex items-center gap-2 text-sm font-medium text-white bg-blue-700 p-4 rounded-2xl hover:bg-blue-600"
        >
          Add Component
        </button>
      </div>
      <div className="relative flex justify-center pb-4">
        <input
          type="text"
          placeholder="Search component"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[85%] pl-14 pr-8 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
        />
        <Search className="absolute left-38 top-1/3 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
      </div>

      <div className="flex flex-wrap">
        {isLoading || componentList.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-400">Loading components...</p>
          </div>
        ) : filteredComponents.length > 0 ? (
          filteredComponents.map((component) => (
            <div key={component.componentName} className="w-1/4 p-2">
              <ComponentCard
                key={component.componentName}
                component={component}
                onClick={() => setSelectedComponent(component)}
                onEdit={() => setSelectedComponentEdit(component)}
              />
            </div>
          ))
        ) : (
          <div className="w-full flex justify-center py-8">
            <div className="bg-red-950/50 border border-red-500/20 rounded-lg p-6  w-[60%]">
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
                <p className="text-red-500 font-medium text-center">
                  No components found matching your search
                </p>
              </div>
              <p className="text-red-400/70 mt-2 text-sm pt-4">
                Try adjusting your search query or browse all components by
                clearing the search.
              </p>
            </div>
          </div>
        )}
      </div>

      {showAddComponent && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-800">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-xl font-semibold text-white">
                Add New Component
              </h2>
              <button
                onClick={() => setShowAddComponent(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <EditForm
              component={newComponent}
              onSave={handleAddComponent}
              onCancel={() => setShowAddComponent(false)}
            />
          </div>
        </div>
      )}

      {selectedComponent && (
        <ComponentDetail
          component={selectedComponent}
          onClose={() => setSelectedComponent(null)}
        />
      )}
      {selectedEditComponent && (
        <ComponentDetail
          component={selectedEditComponent}
          onClose={() => setSelectedComponentEdit(null)}
          isEditingEnabled={true}
        />
      )}
    </div>
  );
}

export default InternalComponents;
