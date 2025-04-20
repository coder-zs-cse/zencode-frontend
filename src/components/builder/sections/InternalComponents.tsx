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
import { AlertCircle, Loader2, Search, X, Plus, List } from "lucide-react";
import { fetch_github_details } from "@/api/user/user";

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

interface DependenciesListProps {
  packageJson: string | null;
}

interface ParsedPackageJson {
  dependencies: string;
  devDependencies: string;
}

const DependenciesList: React.FC<DependenciesListProps> = ({ packageJson }) => {
  if (!packageJson) {
    return (
      <div className="w-full flex justify-center py-8">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-[60%]">
                  <div className="flex items-center">
                    <AlertCircle className="w-6 h-6 text-blue-500 mr-3" />
                    <p className="text-white font-medium text-center">
                      No dependencies to display
                    </p>
                  </div>
                  <p className="text-slate-400 mt-2 text-sm pt-4">
                    Please index your internal library to start managing your dependencies.
                  </p>
                </div>
              </div>
    );
  }

  try {
    const parsedPackageJson: ParsedPackageJson = JSON.parse(packageJson);
    const dependencies = parsedPackageJson.dependencies
      .split(",")
      .map((dep: string) => dep.trim());
    const devDependencies = parsedPackageJson.devDependencies
      .split(",")
      .map((dep: string) => dep.trim());

    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            Dependencies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dependencies.map((dependency: string, index: number) => (
              <div
                key={index}
                className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{dependency}</span>
                  <span className="text-slate-400 text-sm">Production</span>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold text-white mb-6 mt-8">
            Dev Dependencies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devDependencies.map((dependency: string, index: number) => (
              <div
                key={index}
                className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{dependency}</span>
                  <span className="text-slate-400 text-sm">Development</span>
                </div>
              </div>
            ))}
          </div>

          {dependencies.length === 0 && devDependencies.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-400">No dependencies found.</p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error parsing package.json:", error);
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="text-center py-8">
            <p className="text-red-400">
              Error loading dependencies. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }
};

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
  const [showAddButton, setShowAddButton] = useState(true);
  const [showDependenciesPage, setShowDependenciesPage] = useState(false);
  const [packageJson, setPackageJson] = useState<string | null>(null);
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
      const userData = await fetch_github_details();
      console.log("userData", userData.packageJson);
      setComponentList(components);
      setPackageJson(userData.packageJson);
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
        <h1 className="text-3xl font-semibold text-white">Library</h1>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => {
                setShowDependenciesPage(false);
                setShowAddButton(true);
              }}
              className={`flex items-center gap-2 text-base font-medium px-6 py-3 rounded-md transition-colors ${
                !showDependenciesPage
                  ? "bg-blue-700 text-white cursor-default"
                  : "text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer"
              }`}
            >
              <List className="w-5 h-5" />
              Components
            </button>
            <button
              onClick={() => { 
                setShowDependenciesPage(true);
                setShowAddButton(false);
              }}
              className={`flex items-center gap-2 text-base font-medium px-6 py-3 rounded-md transition-colors ${
                showDependenciesPage
                  ? "bg-blue-700 text-white cursor-default"
                  : "text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer"
              }`}
            >
              <List className="w-5 h-5" />
              Dependencies
            </button>
          </div>
        </div>
      </div>

      {showDependenciesPage ? (
        <div className="flex flex-col items-center py-8">
          <DependenciesList packageJson={packageJson} />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center gap-4 pb-4">
            <div className="relative flex-1 max-w-[89%]">
              <input
                type="text"
                placeholder="Search component"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-8 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            </div>
            {!showDependenciesPage && (
              <button
                onClick={() => setShowAddComponent(true)}
                className="flex items-center gap-2 text-sm font-medium text-white bg-blue-700 px-4 py-2.5 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Component
              </button>
            )}
          </div>

          <div className="flex flex-wrap">
            {isLoading ? (
              <div className="w-full flex flex-col items-center justify-center py-16">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                <p className="text-slate-400">Loading components...</p>
              </div>
            ) : componentList.length === 0 ? (
              <div className="w-full flex justify-center py-8">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-[60%]">
                  <div className="flex items-center">
                    <AlertCircle className="w-6 h-6 text-blue-500 mr-3" />
                    <p className="text-white font-medium text-center">
                      No components to display
                    </p>
                  </div>
                  <p className="text-slate-400 mt-2 text-sm pt-4">
                    Please index your internal library to start managing your components.
                  </p>
                </div>
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
                <div className="bg-red-950/50 border border-red-500/20 rounded-lg p-6 w-[60%]">
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
        </>
      )}

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
