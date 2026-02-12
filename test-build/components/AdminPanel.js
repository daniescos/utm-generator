"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPanel = AdminPanel;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var storage_1 = require("../lib/storage");
var utils_1 = require("../lib/utils");
var translations_1 = require("../lib/translations");
var DependencyForm_1 = require("./DependencyForm");
function AdminPanel(_a) {
    var _b, _c, _d, _e;
    var onLogout = _a.onLogout;
    var _f = (0, react_1.useState)((0, storage_1.loadConfig)()), config = _f[0], setConfig = _f[1];
    (0, react_1.useEffect)(function () {
        (0, storage_1.loadConfigAsync)().then(setConfig);
    }, []);
    var _g = (0, react_1.useState)('fields'), activeTab = _g[0], setActiveTab = _g[1];
    var _h = (0, react_1.useState)(''), newPassword = _h[0], setNewPassword = _h[1];
    var _j = (0, react_1.useState)(false), showNewFieldForm = _j[0], setShowNewFieldForm = _j[1];
    var _k = (0, react_1.useState)(''), newFieldName = _k[0], setNewFieldName = _k[1];
    var _l = (0, react_1.useState)(''), newFieldLabel = _l[0], setNewFieldLabel = _l[1];
    var _m = (0, react_1.useState)('dropdown'), newFieldType = _m[0], setNewFieldType = _m[1];
    var _o = (0, react_1.useState)(null), selectedFieldForOptions = _o[0], setSelectedFieldForOptions = _o[1];
    var _p = (0, react_1.useState)(''), fieldOptionsText = _p[0], setFieldOptionsText = _p[1];
    var _q = (0, react_1.useState)(false), showDependencyForm = _q[0], setShowDependencyForm = _q[1];
    var _r = (0, react_1.useState)(''), error = _r[0], setError = _r[1];
    var _s = (0, react_1.useState)(''), success = _s[0], setSuccess = _s[1];
    var _t = (0, react_1.useState)(null), editingFieldId = _t[0], setEditingFieldId = _t[1];
    var _u = (0, react_1.useState)(''), editFieldName = _u[0], setEditFieldName = _u[1];
    var _v = (0, react_1.useState)(''), editFieldLabel = _v[0], setEditFieldLabel = _v[1];
    var _w = (0, react_1.useState)('dropdown'), editFieldType = _w[0], setEditFieldType = _w[1];
    var _x = (0, react_1.useState)(''), editFieldOptions = _x[0], setEditFieldOptions = _x[1];
    var _y = (0, react_1.useState)(''), editFieldDescription = _y[0], setEditFieldDescription = _y[1];
    var handleSave = function () {
        // Increment version to trigger client-side sync for all users
        var updatedConfig = __assign(__assign({}, config), { version: (config.version || 1) + 1 });
        (0, storage_1.saveConfig)(updatedConfig);
        setSuccess(translations_1.translations.admin.successMessages.configurationSavedSuccessfully);
        setTimeout(function () { return setSuccess(''); }, 3000);
    };
    // Field Management
    var handleAddField = function () {
        if (!newFieldName.trim() || !newFieldLabel.trim()) {
            setError(translations_1.translations.admin.errorMessages.fieldNameAndLabelRequired);
            return;
        }
        var newField = {
            id: (0, utils_1.generateId)(),
            name: newFieldName,
            label: newFieldLabel,
            fieldType: newFieldType,
            options: [],
            order: config.fields.length + 1,
            isCustom: true,
            description: undefined,
        };
        setConfig(function (prev) { return (__assign(__assign({}, prev), { fields: __spreadArray(__spreadArray([], prev.fields, true), [newField], false) })); });
        setNewFieldName('');
        setNewFieldLabel('');
        setNewFieldType('dropdown');
        setShowNewFieldForm(false);
        setError('');
    };
    var handleDeleteField = function (fieldId) {
        var field = config.fields.find(function (f) { return f.id === fieldId; });
        if (field && !field.isCustom) {
            setError(translations_1.translations.admin.cannotDeleteStandardField);
            return;
        }
        setConfig(function (prev) { return (__assign(__assign({}, prev), { fields: prev.fields.filter(function (f) { return f.id !== fieldId; }), dependencies: prev.dependencies.filter(function (d) { return d.sourceField !== fieldId && d.targetField !== fieldId; }) })); });
    };
    var handleStartEditField = function (field) {
        setEditingFieldId(field.id);
        setEditFieldName(field.name);
        setEditFieldLabel(field.label);
        setEditFieldType(field.fieldType);
        setEditFieldOptions(field.options.join('\n'));
        setEditFieldDescription(field.description || '');
    };
    var handleSaveEditField = function () {
        if (!editFieldName.trim() || !editFieldLabel.trim()) {
            setError(translations_1.translations.admin.errorMessages.fieldNameAndLabelRequired);
            return;
        }
        var field = config.fields.find(function (f) { return f.id === editingFieldId; });
        if (!field)
            return;
        var options = editFieldType === 'dropdown'
            ? editFieldOptions.split('\n').map(function (o) { return o.trim(); }).filter(Boolean)
            : [];
        setConfig(function (prev) { return (__assign(__assign({}, prev), { fields: prev.fields.map(function (f) {
                return f.id === editingFieldId
                    ? __assign(__assign({}, f), { name: editFieldName, label: editFieldLabel, fieldType: editFieldType, options: options, description: editFieldDescription || undefined }) : f;
            }) })); });
        setEditingFieldId(null);
        setSuccess(translations_1.translations.admin.fieldUpdatedSuccessfully);
        setTimeout(function () { return setSuccess(''); }, 3000);
    };
    var handleCancelEditField = function () {
        setEditingFieldId(null);
        setEditFieldName('');
        setEditFieldLabel('');
        setEditFieldType('dropdown');
        setEditFieldOptions('');
        setEditFieldDescription('');
    };
    // Options Management
    var handleUpdateFieldOptions = function (fieldId) {
        var options = fieldOptionsText
            .split('\n')
            .map(function (o) { return o.trim(); })
            .filter(Boolean);
        setConfig(function (prev) { return (__assign(__assign({}, prev), { fields: prev.fields.map(function (f) {
                return f.id === fieldId ? __assign(__assign({}, f), { options: options }) : f;
            }) })); });
        setFieldOptionsText('');
        setSelectedFieldForOptions(null);
        setSuccess(translations_1.translations.admin.optionsUpdated);
        setTimeout(function () { return setSuccess(''); }, 3000);
    };
    // Dependency Management
    var formatRuleDisplay = function (rule) {
        var _a, _b;
        var sourceField = config.fields.find(function (f) { return f.id === rule.sourceField; });
        var targetField = config.fields.find(function (f) { return f.id === rule.targetField; });
        var ruleType = rule.ruleType || 'filter';
        var description = '';
        switch (ruleType) {
            case 'filter':
            case 'validation':
                var constraint = '';
                if (rule.targetFieldType === 'dropdown' && rule.allowedValues) {
                    constraint = "\u2208 [".concat(rule.allowedValues.join(', '), "]");
                }
                else if (rule.targetFieldType === 'string' && rule.stringConstraint) {
                    var sc = rule.stringConstraint;
                    switch (sc.type) {
                        case 'pattern':
                            constraint = "corresponde a \"".concat(sc.value, "\"");
                            break;
                        case 'contains':
                            constraint = "cont\u00E9m \"".concat(sc.value, "\"");
                            break;
                        case 'startsWith':
                            constraint = "come\u00E7a com \"".concat(sc.value, "\"");
                            break;
                        case 'endsWith':
                            constraint = "termina com \"".concat(sc.value, "\"");
                            break;
                        case 'equals':
                            constraint = "= \"".concat(sc.value, "\"");
                            break;
                        case 'minLength':
                            constraint = "comprimento \u2265 ".concat(sc.value);
                            break;
                        case 'maxLength':
                            constraint = "comprimento \u2264 ".concat(sc.value);
                            break;
                    }
                }
                description = "Se ".concat(sourceField === null || sourceField === void 0 ? void 0 : sourceField.label, " = ").concat(rule.sourceValue, ", ent\u00E3o ").concat(targetField === null || targetField === void 0 ? void 0 : targetField.label, " ").concat(constraint);
                break;
            case 'transform':
                description = "Se ".concat(sourceField === null || sourceField === void 0 ? void 0 : sourceField.label, " = ").concat(rule.sourceValue, ", transforma ").concat(targetField === null || targetField === void 0 ? void 0 : targetField.label, " para ").concat((_a = rule.transformTo) === null || _a === void 0 ? void 0 : _a.fieldType);
                break;
            case 'visibility':
                description = "Se ".concat(sourceField === null || sourceField === void 0 ? void 0 : sourceField.label, " = ").concat(rule.sourceValue, ", ").concat(rule.visibilityAction === 'hide' ? 'oculta' : 'mostra', " ").concat(targetField === null || targetField === void 0 ? void 0 : targetField.label);
                break;
            case 'required':
                description = "Se ".concat(sourceField === null || sourceField === void 0 ? void 0 : sourceField.label, " = ").concat(rule.sourceValue, ", torna ").concat(targetField === null || targetField === void 0 ? void 0 : targetField.label, " ").concat(rule.requiredAction === 'make_required' ? 'obrigatório' : 'opcional');
                break;
            case 'autofill':
                description = "Se ".concat(sourceField === null || sourceField === void 0 ? void 0 : sourceField.label, " = ").concat(rule.sourceValue, ", preenche ").concat(targetField === null || targetField === void 0 ? void 0 : targetField.label, " com \"").concat(rule.autofillValue, "\"");
                break;
            case 'cross_validation':
                description = "Se ".concat(sourceField === null || sourceField === void 0 ? void 0 : sourceField.label, " = ").concat(rule.sourceValue, ", ").concat(((_b = rule.crossValidation) === null || _b === void 0 ? void 0 : _b.validationRule) || (targetField === null || targetField === void 0 ? void 0 : targetField.label) + ' deve ter valor específico');
                break;
            default:
                description = "Regra de tipo desconhecido";
        }
        return description;
    };
    var handleAddDependency = function (rule) {
        var validation = (0, utils_1.validateDependency)(rule, config);
        if (!validation.valid) {
            setError(validation.error || 'Invalid dependency');
            return;
        }
        setConfig(function (prev) { return (__assign(__assign({}, prev), { dependencies: __spreadArray(__spreadArray([], prev.dependencies, true), [rule], false) })); });
        setShowDependencyForm(false);
        setError('');
        setSuccess(translations_1.translations.admin.dependencyAddedSuccessfully);
        setTimeout(function () { return setSuccess(''); }, 3000);
    };
    var handleDeleteDependency = function (ruleId) {
        setConfig(function (prev) { return (__assign(__assign({}, prev), { dependencies: prev.dependencies.filter(function (d) { return d.id !== ruleId; }) })); });
    };
    // Import/Export
    var handleExport = function () {
        var json = (0, storage_1.exportConfig)();
        var blob = new Blob([json], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'utm-config.json';
        a.click();
        URL.revokeObjectURL(url);
    };
    var handleExportGlobal = function () {
        var json = (0, storage_1.exportConfig)();
        var blob = new Blob([json], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'config.json';
        a.click();
        URL.revokeObjectURL(url);
        setSuccess(translations_1.translations.admin.configGlobalInstructions);
        setTimeout(function () { return setSuccess(''); }, 8000);
    };
    var handleImport = function (e) {
        var _a;
        var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        var reader = new FileReader();
        reader.onload = function (event) {
            var _a;
            try {
                var json = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
                var imported = (0, storage_1.importConfig)(json);
                setConfig(imported);
                setSuccess(translations_1.translations.admin.configurationImportedSuccessfully);
                setTimeout(function () { return setSuccess(''); }, 3000);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : translations_1.translations.admin.errorMessages.importFailed);
            }
        };
        reader.readAsText(file);
    };
    // Password
    var handlePasswordChange = function () {
        if (!newPassword.trim()) {
            setError(translations_1.translations.admin.errorMessages.passwordCannotBeEmpty);
            return;
        }
        setConfig(function (prev) { return (__assign(__assign({}, prev), { adminPassword: newPassword })); });
        setNewPassword('');
        setSuccess(translations_1.translations.admin.passwordUpdated);
        setTimeout(function () { return setSuccess(''); }, 3000);
    };
    var sortedFields = (0, react_1.useMemo)(function () {
        return __spreadArray([], config.fields, true).sort(function (a, b) { return a.order - b.order; });
    }, [config.fields]);
    return (<div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{translations_1.translations.admin.title}</h1>
            <p className="text-gray-400 mt-1">{translations_1.translations.admin.subtitle}</p>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg border border-red-900/50 transition-colors">
            <lucide_react_1.Lock className="w-4 h-4"/>
            {translations_1.translations.admin.logout}
          </button>
        </div>

        {/* Messages */}
        {error && (<div className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
            {error}
          </div>)}
        {success && (<div className="mb-4 p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-300">
            {success}
          </div>)}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-red-900/50">
          {['fields', 'options', 'dependencies', 'config'].map(function (tab) {
            var tabLabels = {
                fields: translations_1.translations.admin.tabs.fields,
                options: translations_1.translations.admin.tabs.options,
                dependencies: translations_1.translations.admin.tabs.dependencies,
                config: translations_1.translations.admin.tabs.config,
            };
            return (<button key={tab} onClick={function () { return setActiveTab(tab); }} className={"px-4 py-2 font-medium transition-colors ".concat(activeTab === tab
                    ? 'text-red-500 border-b-2 border-red-600'
                    : 'text-gray-400 hover:text-gray-300')}>
                {tabLabels[tab]}
              </button>);
        })}
        </div>

        {/* Tab Content */}
        <div className="bg-black/80 backdrop-blur-sm rounded-lg border border-red-900/50 p-6">
          {/* Fields Tab */}
          {activeTab === 'fields' && (<div className="space-y-4">
              <button onClick={function () { return setShowNewFieldForm(!showNewFieldForm); }} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                <lucide_react_1.Plus className="w-4 h-4"/>
                {translations_1.translations.admin.addCustomField}
              </button>

              {showNewFieldForm && (<div className="border border-red-900/50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{translations_1.translations.admin.fieldName}</label>
                    <input type="text" value={newFieldName} onChange={function (e) { return setNewFieldName(e.target.value); }} placeholder={translations_1.translations.admin.fieldNamePlaceholder} className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{translations_1.translations.admin.displayLabel}</label>
                    <input type="text" value={newFieldLabel} onChange={function (e) { return setNewFieldLabel(e.target.value); }} placeholder={translations_1.translations.admin.displayLabelPlaceholder} className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{translations_1.translations.admin.fieldType}</label>
                    <select value={newFieldType} onChange={function (e) { return setNewFieldType(e.target.value); }} className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white focus:outline-none focus:border-red-600">
                      <option value="dropdown">{translations_1.translations.admin.fieldTypeDropdown}</option>
                      <option value="string">{translations_1.translations.admin.fieldTypeString}</option>
                      <option value="integer">{translations_1.translations.admin.fieldTypeInteger}</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleAddField} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
                      {translations_1.translations.admin.addField}
                    </button>
                    <button onClick={function () { return setShowNewFieldForm(false); }} className="px-4 py-2 bg-slate-700 hover:bg-gray-800 text-white rounded transition-colors">
                      {translations_1.translations.admin.cancel}
                    </button>
                  </div>
                </div>)}

              <div className="space-y-2">
                {sortedFields.map(function (field) { return (<div key={field.id}>
                    {editingFieldId === field.id ? (<div className="border border-red-900/50 rounded-lg p-4 space-y-3 bg-slate-700/50">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">{translations_1.translations.admin.fieldName}</label>
                          <input type="text" value={editFieldName} onChange={function (e) { return setEditFieldName(e.target.value); }} placeholder={translations_1.translations.admin.fieldNamePlaceholder} className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600"/>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">{translations_1.translations.admin.displayLabel}</label>
                          <input type="text" value={editFieldLabel} onChange={function (e) { return setEditFieldLabel(e.target.value); }} placeholder={translations_1.translations.admin.displayLabelPlaceholder} className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600"/>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">{translations_1.translations.admin.fieldType}</label>
                          <select value={editFieldType} onChange={function (e) { return setEditFieldType(e.target.value); }} className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white focus:outline-none focus:border-red-600">
                            <option value="dropdown">{translations_1.translations.admin.fieldTypeDropdown}</option>
                            <option value="string">{translations_1.translations.admin.fieldTypeString}</option>
                            <option value="integer">{translations_1.translations.admin.fieldTypeInteger}</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">{translations_1.translations.admin.description}</label>
                          <textarea value={editFieldDescription} onChange={function (e) { return setEditFieldDescription(e.target.value); }} placeholder={translations_1.translations.admin.descriptionPlaceholder} className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600 font-mono text-sm h-16"/>
                        </div>
                        {editFieldType === 'dropdown' && (<div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{translations_1.translations.admin.options}</label>
                            <textarea value={editFieldOptions} onChange={function (e) { return setEditFieldOptions(e.target.value); }} placeholder={translations_1.translations.admin.optionsPlaceholder} className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600 font-mono text-sm h-24"/>
                          </div>)}
                        <div className="flex gap-2">
                          <button onClick={handleSaveEditField} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
                            {translations_1.translations.admin.saveChangesField}
                          </button>
                          <button onClick={handleCancelEditField} className="px-4 py-2 bg-slate-700 hover:bg-gray-800 text-white rounded transition-colors">
                            {translations_1.translations.admin.cancel}
                          </button>
                        </div>
                      </div>) : (<div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
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
                          <button onClick={function () { return handleStartEditField(field); }} className="p-2 hover:bg-blue-500/20 text-blue-400 rounded transition-colors" title={translations_1.translations.admin.editField}>
                            <lucide_react_1.Edit2 className="w-4 h-4"/>
                          </button>
                          {field.isCustom && (<button onClick={function () { return handleDeleteField(field.id); }} className="p-2 hover:bg-red-500/20 text-red-400 rounded transition-colors ml-1" title={translations_1.translations.admin.deleteField}>
                              <lucide_react_1.Trash2 className="w-4 h-4"/>
                            </button>)}
                        </div>
                      </div>)}
                  </div>); })}
              </div>
            </div>)}

          {/* Options Tab */}
          {activeTab === 'options' && (<div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{translations_1.translations.admin.selectField}</label>
                <select value={selectedFieldForOptions || ''} onChange={function (e) {
                setSelectedFieldForOptions(e.target.value);
                setFieldOptionsText('');
            }} className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white focus:outline-none focus:border-red-600">
                  <option value="">{translations_1.translations.admin.chooseField}</option>
                  {sortedFields.map(function (field) { return (<option key={field.id} value={field.id}>{field.label}</option>); })}
                </select>
              </div>

              {selectedFieldForOptions && (<>
                  {((_b = config.fields.find(function (f) { return f.id === selectedFieldForOptions; })) === null || _b === void 0 ? void 0 : _b.fieldType) !== 'dropdown' && (<div className="p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg text-yellow-300 text-sm">
                      {translations_1.translations.admin.noteNonDropdownField.replace('{fieldType}', ((_c = config.fields.find(function (f) { return f.id === selectedFieldForOptions; })) === null || _c === void 0 ? void 0 : _c.fieldType) || '')}
                    </div>)}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {translations_1.translations.admin.options}
                    </label>
                    <textarea value={fieldOptionsText} onChange={function (e) { return setFieldOptionsText(e.target.value); }} placeholder={translations_1.translations.admin.optionsPlaceholder} disabled={((_d = config.fields.find(function (f) { return f.id === selectedFieldForOptions; })) === null || _d === void 0 ? void 0 : _d.fieldType) !== 'dropdown'} className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600 font-mono text-sm h-32 disabled:opacity-50 disabled:cursor-not-allowed"/>
                    <button onClick={function () { return handleUpdateFieldOptions(selectedFieldForOptions); }} disabled={((_e = config.fields.find(function (f) { return f.id === selectedFieldForOptions; })) === null || _e === void 0 ? void 0 : _e.fieldType) !== 'dropdown'} className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed">
                      {translations_1.translations.admin.saveOptions}
                    </button>
                  </div>
                </>)}
            </div>)}

          {/* Dependencies Tab */}
          {activeTab === 'dependencies' && (<div className="space-y-4">
              <button onClick={function () { return setShowDependencyForm(!showDependencyForm); }} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                <lucide_react_1.Plus className="w-4 h-4"/>
                {translations_1.translations.admin.addDependencyRule}
              </button>

              {showDependencyForm && (<DependencyForm_1.DependencyForm config={config} sortedFields={sortedFields} onAddRule={handleAddDependency} onError={setError}/>)}

              <div className="space-y-2">
                {config.dependencies.map(function (rule) {
                return (<div key={rule.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm text-gray-300">
                          {formatRuleDisplay(rule)}
                        </p>
                        {rule.explanation && (<p className="text-xs text-gray-400 mt-1 italic">
                            "{rule.explanation}"
                          </p>)}
                      </div>
                      <button onClick={function () { return handleDeleteDependency(rule.id); }} className="p-2 hover:bg-red-500/20 text-red-400 rounded transition-colors ml-3" title={translations_1.translations.admin.deleteDependency}>
                        <lucide_react_1.Trash2 className="w-4 h-4"/>
                      </button>
                    </div>);
            })}
              </div>
            </div>)}

          {/* Config Tab */}
          {activeTab === 'config' && (<div className="space-y-6">
              {/* Versioning Info */}
              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 space-y-3">
                <h3 className="text-lg font-semibold text-blue-200 flex items-center gap-2">
                  <lucide_react_1.AlertCircle className="w-5 h-5"/>
                  {translations_1.translations.admin.versioningInfo.title}
                </h3>
                <p className="text-sm text-blue-300">
                  {translations_1.translations.admin.versioningInfo.description}
                </p>
                <div className="bg-blue-950/50 rounded p-3 border border-blue-700/50">
                  <p className="text-xs text-blue-300 font-mono">
                    {translations_1.translations.admin.versioningInfo.howItWorks}
                  </p>
                </div>
                <div className="text-sm text-blue-300">
                  <strong>Versão atual da configuração:</strong> <span className="font-mono text-blue-200">{config.version || 1}</span>
                </div>
              </div>

              {/* Password Change */}
              <div className="border-b border-red-900/50 pb-6">
                <h3 className="text-lg font-semibold text-white mb-4">{translations_1.translations.admin.changeAdminPassword}</h3>
                <div className="space-y-3">
                  <input type="password" value={newPassword} onChange={function (e) { return setNewPassword(e.target.value); }} placeholder={translations_1.translations.admin.newPassword} className="w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600"/>
                  <button onClick={handlePasswordChange} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
                    {translations_1.translations.admin.updatePassword}
                  </button>
                </div>
              </div>

              {/* Import/Export */}
              <div className="border-b border-red-900/50 pb-6">
                <h3 className="text-lg font-semibold text-white mb-4">{translations_1.translations.admin.configuration}</h3>
                <div className="flex gap-3 flex-wrap">
                  <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors">
                    <lucide_react_1.Download className="w-4 h-4"/>
                    {translations_1.translations.admin.exportConfig}
                  </button>
                  <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors cursor-pointer">
                    <lucide_react_1.Upload className="w-4 h-4"/>
                    {translations_1.translations.admin.importConfig}
                    <input type="file" accept=".json" onChange={handleImport} className="hidden"/>
                  </label>
                  <button onClick={handleExportGlobal} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors">
                    <lucide_react_1.Download className="w-4 h-4"/>
                    {translations_1.translations.admin.exportConfigGlobal}
                  </button>
                </div>
              </div>

              {/* Global Config Help Text */}
              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                <p className="text-sm text-blue-300">{translations_1.translations.admin.saveConfigGlobalHelp}</p>
              </div>

              {/* Dangerous Actions */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">{translations_1.translations.admin.dangerousActions}</h3>
                <button onClick={function () {
                if (confirm(translations_1.translations.admin.resetConfirmation)) {
                    (0, storage_1.resetConfig)();
                    setConfig((0, storage_1.loadConfig)());
                    setSuccess(translations_1.translations.admin.configurationResetToDefaults);
                    setTimeout(function () { return setSuccess(''); }, 3000);
                }
            }} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
                  <lucide_react_1.RotateCcw className="w-4 h-4"/>
                  {translations_1.translations.admin.resetToDefaults}
                </button>
              </div>
            </div>)}
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button onClick={handleSave} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
            {translations_1.translations.admin.saveChanges}
          </button>
        </div>
      </div>
    </div>);
}
