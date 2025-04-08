import React, { useState } from "react";
import { X, CheckCircle, XCircle, Edit2, Save, Trash2 } from "lucide-react";
import { update_component_endpoint } from "@/api";

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

interface ComponentDetailProps {
  component: Component;
  onClose: () => void;
  isEditingEnabled?: boolean;
  onUpdate?: (component: Component) => void;
}

// Reusable UI Components
const ModalContainer: React.FC<{
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ children, onClick }) => (
  <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
    <div
      className="bg-slate-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-800"
      onClick={onClick}
    >
      {children}
    </div>
  </div>
);

const Header: React.FC<{
  title: string;
  indexingStatus: boolean;
  onClose: () => void;
  onEdit?: () => void;
  showEdit?: boolean;
}> = ({ title, indexingStatus, onClose, onEdit, showEdit = true }) => (
  <div className="sticky top-0 bg-gradient-to-r from-slate-950 to-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
      {indexingStatus ? (
        <CheckCircle className="w-5 h-5 text-emerald-400 animate-in zoom-in duration-200" />
      ) : (
        <XCircle className="w-5 h-5 text-rose-400 animate-in zoom-in duration-200" />
      )}
    </div>
    <div className="flex gap-2">
      {showEdit && (
        <button
          onClick={onEdit}
          className="rounded-full p-2 hover:bg-slate-800/80 transition-colors duration-200"
        >
          <Edit2 className="w-5 h-5 text-slate-400" />
        </button>
      )}
      <button
        onClick={onClose}
        className="rounded-full p-2 hover:bg-slate-800/80 transition-colors duration-200"
      >
        <X className="w-5 h-5 text-slate-400" />
      </button>
    </div>
  </div>
);

const InfoSection: React.FC<{
  label: string;
  value: string;
  isError?: boolean;
  isCode?: boolean;
}> = ({ label, value, isError = false, isCode = false }) => (
  <div className="space-y-2">
    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
      {label}
    </h3>
    {value ? (
      isCode ? (
        <code className="block bg-slate-800/50 p-2 rounded-lg font-mono text-sm text-slate-300 border border-slate-700">
          {value}
        </code>
      ) : (
        <p className="text-slate-300 leading-relaxed">{value}</p>
      )
    ) : (
      <p className="bg-red-400 p-2 rounded-lg text-center text-white leading-relaxed">
        {`${label} not added`}
      </p>
    )}
  </div>
);

const CodeSamplesSection: React.FC<{ samples: string[] }> = ({ samples }) => (
  <div className="space-y-3">
    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
      Code Samples
    </h3>
    <div className="space-y-3">
      {samples.map((sample, index) => (
        <pre
          key={index}
          className="bg-slate-800/50 p-4 rounded-lg overflow-x-auto border border-slate-700"
        >
          <code className="text-sm font-mono text-slate-300">{sample}</code>
        </pre>
      ))}
      {samples.length === 0 && (
        <div className="px-54 py-2 bg-red-400 text-white text-sm text-center font-semibold rounded-lg border border-slate-700">
          <span>CodeSamples not added</span>
        </div>
      )}
    </div>
  </div>
);

const DependenciesSection: React.FC<{ dependencies: string[] }> = ({
  dependencies,
}) => (
  <div className="space-y-3">
    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
      Dependencies
    </h3>
    <div className="flex flex-wrap gap-2">
      {dependencies.map((dep, index) => (
        <span
          key={index}
          className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm font-medium border border-slate-700"
        >
          {dep}
        </span>
      ))}
      {dependencies.length === 0 && (
        <div className="px-54 py-2 bg-red-400 rounded-lg text-white text-md text-center font-medium border border-slate-700">
          <span>Dependencies not added</span>
        </div>
      )}
    </div>
  </div>
);

// Reusable Form Components
interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "textarea";
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
  className = "",
}) => {
  const commonClasses =
    "w-full bg-slate-800/50 p-2 rounded-lg border border-slate-700 text-slate-300 focus:border-blue-500 outline-none";
  const textareaClasses = "min-h-[100px]";

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${commonClasses} ${textareaClasses} ${className}`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${commonClasses} ${className}`}
        />
      )}
    </div>
  );
};

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
    {children}
  </div>
);

export const EditForm: React.FC<{
  component: Component;
  onSave: (component: Component) => void;
  onCancel: () => void;
}> = ({ component, onSave, onCancel }) => {
  const [editedComponent, setEditedComponent] = useState<Component>(component);

  const handleInputChange = (field: keyof Component, value: any) => {
    setEditedComponent((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayInputChange = (
    field: "codeSamples" | "dependencies",
    value: string
  ) => {
    const array = value.split("\n").filter((item) => item.trim() !== "");
    setEditedComponent((prev) => ({ ...prev, [field]: array }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedComponent);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-8">
      <FormSection title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Component Name"
            value={editedComponent.componentName}
            onChange={(value) => handleInputChange("componentName", value)}
          />
          <FormField
            label="Component Path"
            value={editedComponent.componentPath}
            onChange={(value) => handleInputChange("componentPath", value)}
          />
          <FormField
            label="Import Path"
            value={editedComponent.importPath}
            onChange={(value) => handleInputChange("importPath", value)}
          />
        </div>
      </FormSection>

      <FormSection title="Documentation">
        <FormField
          label="Description"
          value={editedComponent.description}
          onChange={(value) => handleInputChange("description", value)}
          type="textarea"
        />
        <FormField
          label="Use Case"
          value={editedComponent.useCase}
          onChange={(value) => handleInputChange("useCase", value)}
          type="textarea"
        />
      </FormSection>

      <FormSection title="Technical Details">
        <FormField
          label="Code Samples (one per line)"
          value={editedComponent.codeSamples.join("\n")}
          onChange={(value) => handleArrayInputChange("codeSamples", value)}
          type="textarea"
          className="font-mono"
        />
        <FormField
          label="Dependencies (one per line)"
          value={editedComponent.dependencies.join("\n")}
          onChange={(value) => handleArrayInputChange("dependencies", value)}
          type="textarea"
        />
      </FormSection>

      <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export function ComponentDetail({
  component,
  onClose,
  isEditingEnabled = false,
  onUpdate,
}: ComponentDetailProps) {
  const [isEditing, setIsEditing] = useState(isEditingEnabled);

  const handleSave = (updatedComponent: Component) => {
    update_component_endpoint(updatedComponent);
    if (onUpdate) {
      onUpdate(updatedComponent);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <ModalContainer>
        <Header
          title={component.componentName}
          indexingStatus={component.indexingStatus}
          onClose={onClose}
          showEdit={false}
        />
        <EditForm
          component={component}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      </ModalContainer>
    );
  }

  return (
    <ModalContainer>
      <Header
        title={component.componentName}
        indexingStatus={component.indexingStatus}
        onClose={onClose}
        onEdit={() => setIsEditing(true)}
      />
      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoSection
            label="Component Path"
            value={component.componentPath}
            isError={!component.componentPath}
            isCode
          />
          <InfoSection
            label="Import Path"
            value={component.importPath}
            isError={!component.importPath}
            isCode
          />
        </div>

        <InfoSection
          label="Description"
          value={component.description}
          isError={!component.description}
        />

        <InfoSection
          label="Use Case"
          value={component.useCase}
          isError={!component.useCase}
        />

        <CodeSamplesSection samples={component.codeSamples} />
        <DependenciesSection dependencies={component.dependencies} />
      </div>
    </ModalContainer>
  );
}
