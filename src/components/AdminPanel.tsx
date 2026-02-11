import { useState, useMemo } from 'react';
import { Plus, Trash2, Download, Upload, RotateCcw, Lock, Edit2 } from 'lucide-react';
import { loadConfig, saveConfig, exportConfig, importConfig, resetConfig } from '../lib/storage';
import type { AppConfig, UTMField, DependencyRule } from '../lib/types';
import { generateId, validateDependency } from '../lib/utils';

interface AdminPanelProps {
  onLogout: () => void;
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [config, setConfig] = useState<AppConfig>(loadConfig());
  const [activeTab, setActiveTab] = useState<'fields' | 'options' | 'dependencies' | 'config'>('fields');
  const [newPassword, setNewPassword] = useState('');
  const [showNewFieldForm, setShowNewFieldForm] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<'dropdown' | 'string' | 'integer'>('dropdown');
  const [selectedFieldForOptions, setSelectedFieldForOptions] = useState<string | null>(null);
  const [fieldOptionsText, setFieldOptionsText] = useState('');
  const [newDependency, setNewDependency] = useState<Partial<DependencyRule>>({});
  const [showDependencyForm, setShowDependencyForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editFieldName, setEditFieldName] = useState('');
  const [editFieldLabel, setEditFieldLabel] = useState('');
  const [editFieldType, setEditFieldType] = useState<'dropdown' | 'string' | 'integer'>('dropdown');
  const [editFieldOptions, setEditFieldOptions] = useState('');

  const handleSave = () => {
    saveConfig(config);
    setSuccess('Configuration saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  // Field Management
  const handleAddField = () => {
    if (!newFieldName.trim() || !newFieldLabel.trim()) {
      setError('Field name and label are required');
      return;
    }

    const newField: UTMField = {
      id: generateId(),
      name: newFieldName,
      label: newFieldLabel,
      fieldType: newFieldType,
      options: [],
      order: config.fields.length + 1,
      isCustom: true,
    };

    setConfig(prev => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));

    setNewFieldName('');
    setNewFieldLabel('');
    setNewFieldType('dropdown');
    setShowNewFieldForm(false);
    setError('');
  };

  const handleDeleteField = (fieldId: string) => {
    const field = config.fields.find(f => f.id === fieldId);
    if (field && !field.isCustom) {
      setError('Cannot delete standard UTM fields');
      return;
    }

    setConfig(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== fieldId),
      dependencies: prev.dependencies.filter(
        d => d.sourceField !== fieldId && d.targetField !== fieldId
      ),
    }));
  };

  const handleStartEditField = (field: UTMField) => {
    setEditingFieldId(field.id);
    setEditFieldName(field.name);
    setEditFieldLabel(field.label);
    setEditFieldType(field.fieldType);
    setEditFieldOptions(field.options.join('\n'));
  };

  const handleSaveEditField = () => {
    if (!editFieldName.trim() || !editFieldLabel.trim()) {
      setError('Field name and label are required');
      return;
    }

    const field = config.fields.find(f => f.id === editingFieldId);
    if (!field) return;

    const options = editFieldType === 'dropdown'
      ? editFieldOptions.split('\n').map(o => o.trim()).filter(Boolean)
      : [];

    setConfig(prev => ({
      ...prev,
      fields: prev.fields.map(f =>
        f.id === editingFieldId
          ? {
              ...f,
              name: editFieldName,
              label: editFieldLabel,
              fieldType: editFieldType,
              options,
            }
          : f
      ),
    }));

    setEditingFieldId(null);
    setSuccess('Field updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleCancelEditField = () => {
    setEditingFieldId(null);
    setEditFieldName('');
    setEditFieldLabel('');
    setEditFieldType('dropdown');
    setEditFieldOptions('');
  };

  // Options Management
  const handleUpdateFieldOptions = (fieldId: string) => {
    const options = fieldOptionsText
      .split('\n')
      .map(o => o.trim())
      .filter(Boolean);

    setConfig(prev => ({
      ...prev,
      fields: prev.fields.map(f =>
        f.id === fieldId ? { ...f, options } : f
      ),
    }));

    setFieldOptionsText('');
    setSelectedFieldForOptions(null);
    setSuccess('Options updated!');
    setTimeout(() => setSuccess(''), 3000);
  };

  // Dependency Management
  const handleAddDependency = () => {
    if (!newDependency.sourceField || !newDependency.sourceValue || !newDependency.targetField || !newDependency.allowedValues?.length) {
      setError('All dependency fields are required');
      return;
    }

    const rule: DependencyRule = {
      id: generateId(),
      sourceField: newDependency.sourceField,
      sourceValue: newDependency.sourceValue,
      targetField: newDependency.targetField,
      allowedValues: newDependency.allowedValues,
    };

    const validation = validateDependency(rule, config);
    if (!validation.valid) {
      setError(validation.error || 'Invalid dependency');
      return;
    }

    setConfig(prev => ({
      ...prev,
      dependencies: [...prev.dependencies, rule],
    }));

    setNewDependency({});
    setShowDependencyForm(false);
    setError('');
  };

  const handleDeleteDependency = (ruleId: string) => {
    setConfig(prev => ({
      ...prev,
      dependencies: prev.dependencies.filter(d => d.id !== ruleId),
    }));
  };

  // Import/Export
  const handleExport = () => {
    const json = exportConfig();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'utm-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const imported = importConfig(json);
        setConfig(imported);
        setSuccess('Configuration imported successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Import failed');
      }
    };
    reader.readAsText(file);
  };

  // Password
  const handlePasswordChange = () => {
    if (!newPassword.trim()) {
      setError('Password cannot be empty');
      return;
    }

    setConfig(prev => ({
      ...prev,
      adminPassword: newPassword,
    }));

    setNewPassword('');
    setSuccess('Password updated!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const sortedFields = useMemo(() => {
    return [...config.fields].sort((a, b) => a.order - b.order);
  }, [config.fields]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-400 mt-1">Configure UTM fields and dependencies</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg border border-red-900/50 transition-colors"
          >
            <Lock className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-300">
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-red-900/50">
          {(['fields', 'options', 'dependencies', 'config'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab
                  ? 'text-red-500 border-b-2 border-red-600'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-black/80 backdrop-blur-sm rounded-lg border border-red-900/50 p-6">
          {/* Fields Tab */}
          {activeTab === 'fields' && (
            <div className="space-y-4">
              <button
                onClick={() => setShowNewFieldForm(!showNewFieldForm)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Custom Field
              </button>

              {showNewFieldForm && (
                <div className="border border-red-900/50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Field Name (UTM parameter)</label>
                    <input
                      type="text"
                      value={newFieldName}
                      onChange={(e) => setNewFieldName(e.target.value)}
                      placeholder="e.g., utm_custom"
                      className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Display Label</label>
                    <input
                      type="text"
                      value={newFieldLabel}
                      onChange={(e) => setNewFieldLabel(e.target.value)}
                      placeholder="e.g., Custom Field"
                      className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Field Type</label>
                    <select
                      value={newFieldType}
                      onChange={(e) => setNewFieldType(e.target.value as 'dropdown' | 'string' | 'integer')}
                      className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white focus:outline-none focus:border-red-600"
                    >
                      <option value="dropdown">Dropdown (select from options)</option>
                      <option value="string">Text Input (free text)</option>
                      <option value="integer">Number Input (integers only)</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddField}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                    >
                      Add Field
                    </button>
                    <button
                      onClick={() => setShowNewFieldForm(false)}
                      className="px-4 py-2 bg-slate-700 hover:bg-gray-800 text-white rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {sortedFields.map(field => (
                  <div key={field.id}>
                    {editingFieldId === field.id ? (
                      <div className="border border-red-900/50 rounded-lg p-4 space-y-3 bg-slate-700/50">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Field Name (UTM parameter)</label>
                          <input
                            type="text"
                            value={editFieldName}
                            onChange={(e) => setEditFieldName(e.target.value)}
                            placeholder="e.g., utm_custom"
                            className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Display Label</label>
                          <input
                            type="text"
                            value={editFieldLabel}
                            onChange={(e) => setEditFieldLabel(e.target.value)}
                            placeholder="e.g., Custom Field"
                            className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Field Type</label>
                          <select
                            value={editFieldType}
                            onChange={(e) => setEditFieldType(e.target.value as 'dropdown' | 'string' | 'integer')}
                            className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white focus:outline-none focus:border-red-600"
                          >
                            <option value="dropdown">Dropdown (select from options)</option>
                            <option value="string">Text Input (free text)</option>
                            <option value="integer">Number Input (integers only)</option>
                          </select>
                        </div>
                        {editFieldType === 'dropdown' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Options (one per line)</label>
                            <textarea
                              value={editFieldOptions}
                              onChange={(e) => setEditFieldOptions(e.target.value)}
                              placeholder="Option 1&#10;Option 2&#10;Option 3"
                              className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600 font-mono text-sm h-24"
                            />
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEditField}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={handleCancelEditField}
                            className="px-4 py-2 bg-slate-700 hover:bg-gray-800 text-white rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-white">{field.label}</p>
                            <span className="px-2 py-0.5 text-xs rounded bg-slate-600 text-gray-300 font-mono">
                              {field.fieldType}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400">{field.name}</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleStartEditField(field)}
                            className="p-2 hover:bg-blue-500/20 text-blue-400 rounded transition-colors"
                            title="Edit field"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {field.isCustom && (
                            <button
                              onClick={() => handleDeleteField(field.id)}
                              className="p-2 hover:bg-red-500/20 text-red-400 rounded transition-colors ml-1"
                              title="Delete field"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Options Tab */}
          {activeTab === 'options' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Field</label>
                <select
                  value={selectedFieldForOptions || ''}
                  onChange={(e) => {
                    setSelectedFieldForOptions(e.target.value);
                    setFieldOptionsText('');
                  }}
                  className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white focus:outline-none focus:border-red-600"
                >
                  <option value="">Choose a field...</option>
                  {sortedFields.map(field => (
                    <option key={field.id} value={field.id}>{field.label}</option>
                  ))}
                </select>
              </div>

              {selectedFieldForOptions && (
                <>
                  {config.fields.find(f => f.id === selectedFieldForOptions)?.fieldType !== 'dropdown' && (
                    <div className="p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg text-yellow-300 text-sm">
                      Note: This field is a {config.fields.find(f => f.id === selectedFieldForOptions)?.fieldType} type and does not use options. Options are only used for dropdown fields.
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Options (one per line)
                    </label>
                    <textarea
                      value={fieldOptionsText}
                      onChange={(e) => setFieldOptionsText(e.target.value)}
                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                      disabled={config.fields.find(f => f.id === selectedFieldForOptions)?.fieldType !== 'dropdown'}
                      className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600 font-mono text-sm h-32 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      onClick={() => handleUpdateFieldOptions(selectedFieldForOptions)}
                      disabled={config.fields.find(f => f.id === selectedFieldForOptions)?.fieldType !== 'dropdown'}
                      className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                      Save Options
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Dependencies Tab */}
          {activeTab === 'dependencies' && (
            <div className="space-y-4">
              <button
                onClick={() => setShowDependencyForm(!showDependencyForm)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Dependency Rule
              </button>

              {showDependencyForm && (
                <div className="border border-red-900/50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">If Field</label>
                    <select
                      value={newDependency.sourceField || ''}
                      onChange={(e) => setNewDependency(prev => ({ ...prev, sourceField: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white focus:outline-none focus:border-red-600"
                    >
                      <option value="">Select field...</option>
                      {sortedFields.filter(f => f.fieldType === 'dropdown').map(f => (
                        <option key={f.id} value={f.id}>{f.label}</option>
                      ))}
                    </select>
                  </div>

                  {newDependency.sourceField && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Equals</label>
                      <select
                        value={newDependency.sourceValue || ''}
                        onChange={(e) => setNewDependency(prev => ({ ...prev, sourceValue: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white focus:outline-none focus:border-red-600"
                      >
                        <option value="">Select value...</option>
                        {config.fields.find(f => f.id === newDependency.sourceField)?.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Then Limit Field</label>
                    <select
                      value={newDependency.targetField || ''}
                      onChange={(e) => setNewDependency(prev => ({ ...prev, targetField: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white focus:outline-none focus:border-red-600"
                    >
                      <option value="">Select field...</option>
                      {sortedFields.filter(f => f.fieldType === 'dropdown').map(f => (
                        <option key={f.id} value={f.id}>{f.label}</option>
                      ))}
                    </select>
                  </div>

                  {newDependency.targetField && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">To These Values (one per line)</label>
                      <textarea
                        value={(newDependency.allowedValues || []).join('\n')}
                        onChange={(e) => setNewDependency(prev => ({
                          ...prev,
                          allowedValues: e.target.value.split('\n').map(v => v.trim()).filter(Boolean)
                        }))}
                        className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600 font-mono text-sm h-24"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={handleAddDependency}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                    >
                      Add Rule
                    </button>
                    <button
                      onClick={() => setShowDependencyForm(false)}
                      className="px-4 py-2 bg-slate-700 hover:bg-gray-800 text-white rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {config.dependencies.map(rule => {
                  const sourceField = config.fields.find(f => f.id === rule.sourceField);
                  const targetField = config.fields.find(f => f.id === rule.targetField);
                  return (
                    <div key={rule.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <p className="text-sm text-gray-300">
                        If {sourceField?.label} = {rule.sourceValue}, then {targetField?.label} ∈ [{rule.allowedValues.join(', ')}]
                      </p>
                      <button
                        onClick={() => handleDeleteDependency(rule.id)}
                        className="p-2 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Config Tab */}
          {activeTab === 'config' && (
            <div className="space-y-6">
              {/* Password Change */}
              <div className="border-b border-red-900/50 pb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Change Admin Password</h3>
                <div className="space-y-3">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                  />
                  <button
                    onClick={handlePasswordChange}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </div>

              {/* Import/Export */}
              <div className="border-b border-red-900/50 pb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Configuration</h3>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export Config
                  </button>
                  <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Import Config
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Dangerous Actions */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Dangerous Actions</h3>
                <button
                  onClick={() => {
                    if (confirm('Reset to default configuration? This cannot be undone.')) {
                      resetConfig();
                      setConfig(loadConfig());
                      setSuccess('Configuration reset to defaults');
                      setTimeout(() => setSuccess(''), 3000);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to Defaults
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
}
