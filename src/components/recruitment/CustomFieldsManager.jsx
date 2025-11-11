import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Type, 
  Hash,
  Calendar,
  ToggleLeft,
  List,
  FileText
} from 'lucide-react';
import { customFieldsService } from '../../services/integrationService';

const CustomFieldsManager = () => {
  const [fields, setFields] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState('all');

  useEffect(() => {
    loadFields();
  }, [selectedEntity]);

  const loadFields = () => {
    const entityType = selectedEntity === 'all' ? null : selectedEntity;
    const allFields = customFieldsService.getAll(entityType);
    setFields(allFields);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this custom field?')) {
      customFieldsService.delete(id);
      loadFields();
    }
  };

  const entityTypes = [
    { value: 'all', label: 'All Entities' },
    { value: 'candidate', label: 'Candidates' },
    { value: 'job', label: 'Jobs' },
    { value: 'interview', label: 'Interviews' },
    { value: 'offer', label: 'Offers' },
    { value: 'client', label: 'Clients' }
  ];

  const fieldTypeIcons = {
    text: Type,
    number: Hash,
    date: Calendar,
    boolean: ToggleLeft,
    select: List,
    textarea: FileText
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Custom Fields</h1>
          <p className="text-gray-600">Extend your data model with custom fields</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Field
        </button>
      </div>

      {/* Entity Filter */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {entityTypes.map(entity => (
            <button
              key={entity.value}
              onClick={() => setSelectedEntity(entity.value)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedEntity === entity.value
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {entity.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map(field => {
          const IconComponent = fieldTypeIcons[field.fieldType] || Type;
          
          return (
            <div
              key={field.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <IconComponent className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{field.label}</h3>
                    <p className="text-xs text-gray-500 capitalize">{field.entityType}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingField(field)}
                    className="p-1 text-gray-600 hover:text-gray-900"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(field.id)}
                    className="p-1 text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Field Name:</span>
                  <span className="text-gray-900 font-mono text-xs">{field.fieldName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="text-gray-900 capitalize">{field.fieldType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Required:</span>
                  <span className={field.required ? 'text-green-600' : 'text-gray-400'}>
                    {field.required ? 'Yes' : 'No'}
                  </span>
                </div>
                {field.description && (
                  <p className="text-gray-600 text-xs mt-2 pt-2 border-t border-gray-200">
                    {field.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {fields.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Type className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No custom fields</h3>
          <p className="text-gray-600 mb-4">
            {selectedEntity === 'all' 
              ? 'Create your first custom field to extend your data model'
              : `No custom fields for ${entityTypes.find(e => e.value === selectedEntity)?.label}`
            }
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Field
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingField) && (
        <CustomFieldModal
          field={editingField}
          entityTypes={entityTypes.filter(e => e.value !== 'all')}
          onClose={() => {
            setShowAddModal(false);
            setEditingField(null);
          }}
          onSave={() => {
            loadFields();
            setShowAddModal(false);
            setEditingField(null);
          }}
        />
      )}
    </div>
  );
};

const CustomFieldModal = ({ field, entityTypes, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    entityType: field?.entityType || 'candidate',
    label: field?.label || '',
    fieldName: field?.fieldName || '',
    fieldType: field?.fieldType || 'text',
    required: field?.required || false,
    description: field?.description || '',
    options: field?.options || []
  });

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'boolean', label: 'Yes/No' },
    { value: 'select', label: 'Dropdown' },
    { value: 'textarea', label: 'Long Text' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (field) {
      customFieldsService.update(field.id, formData);
    } else {
      customFieldsService.create(formData);
    }
    
    onSave();
  };

  const generateFieldName = (label) => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {field ? 'Edit Custom Field' : 'Add Custom Field'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entity Type
              </label>
              <select
                value={formData.entityType}
                onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {entityTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Label
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => {
                  const label = e.target.value;
                  setFormData({ 
                    ...formData, 
                    label,
                    fieldName: generateFieldName(label)
                  });
                }}
                placeholder="e.g., LinkedIn Profile"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Name (API)
              </label>
              <input
                type="text"
                value={formData.fieldName}
                onChange={(e) => setFormData({ ...formData, fieldName: e.target.value })}
                placeholder="e.g., linkedin_profile"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Used in API calls and exports
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Type
              </label>
              <select
                value={formData.fieldType}
                onChange={(e) => setFormData({ ...formData, fieldType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {fieldTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description for this field"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="required"
                checked={formData.required}
                onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="required" className="text-sm text-gray-700">
                Required field
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              {field ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomFieldsManager;
