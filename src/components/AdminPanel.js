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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPanel = AdminPanel;
var react_1 = require("react");
var storage_1 = require("../lib/storage");
var utils_1 = require("../lib/utils");
var translations_1 = require("../lib/translations");
function AdminPanel(_a) {
    var _b, _c;
    var onLogout = _a.onLogout;
    var _d = (0, react_1.useState)((0, storage_1.loadConfig)()), config = _d[0], setConfig = _d[1];
    (0, react_1.useEffect)(function () {
        (0, storage_1.loadConfigAsync)().then(setConfig);
    }, []);
    var _e = (0, react_1.useState)('fields'), activeTab = _e[0], setActiveTab = _e[1];
    var _f = (0, react_1.useState)(''), newPassword = _f[0], setNewPassword = _f[1];
    var _g = (0, react_1.useState)(false), showNewFieldForm = _g[0], setShowNewFieldForm = _g[1];
    var _h = (0, react_1.useState)(''), newFieldName = _h[0], setNewFieldName = _h[1];
    var _j = (0, react_1.useState)(''), newFieldLabel = _j[0], setNewFieldLabel = _j[1];
    var _k = (0, react_1.useState)('dropdown'), newFieldType = _k[0], setNewFieldType = _k[1];
    var _l = (0, react_1.useState)(null), selectedFieldForOptions = _l[0], setSelectedFieldForOptions = _l[1];
    var _m = (0, react_1.useState)(''), fieldOptionsText = _m[0], setFieldOptionsText = _m[1];
    var _o = (0, react_1.useState)(false), showDependencyForm = _o[0], setShowDependencyForm = _o[1];
    var _p = (0, react_1.useState)(''), error = _p[0], setError = _p[1];
    var _q = (0, react_1.useState)(''), success = _q[0], setSuccess = _q[1];
    var _r = (0, react_1.useState)(null), editingFieldId = _r[0], setEditingFieldId = _r[1];
    var _s = (0, react_1.useState)(''), editFieldName = _s[0], setEditFieldName = _s[1];
    var _t = (0, react_1.useState)(''), editFieldLabel = _t[0], setEditFieldLabel = _t[1];
    var _u = (0, react_1.useState)('dropdown'), editFieldType = _u[0], setEditFieldType = _u[1];
    var _v = (0, react_1.useState)(''), editFieldOptions = _v[0], setEditFieldOptions = _v[1];
    var _w = (0, react_1.useState)(''), editFieldDescription = _w[0], setEditFieldDescription = _w[1];
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
    // Dependency Management  const formatRuleDisplay = (rule: DependencyRule): string => {
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
            description = "Se ".concat(sourceField === null || sourceField === void 0 ? void 0 : sourceField.label, " = ").concat(rule.sourceValue, ", transforma ").concat(targetField === null || targetField === void 0 ? void 0 : targetField.label, " para ").concat((_b = rule.transformTo) === null || _b === void 0 ? void 0 : _b.fieldType);
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
            description = "Se ".concat(sourceField === null || sourceField === void 0 ? void 0 : sourceField.label, " = ").concat(rule.sourceValue, ", ").concat(((_c = rule.crossValidation) === null || _c === void 0 ? void 0 : _c.validationRule) || (targetField === null || targetField === void 0 ? void 0 : targetField.label) + ' deve ter valor específico');
            break;
        default:
            description = "Regra de tipo desconhecido";
    }
    return description;
}
;
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
return (React.createElement("div", { className: "min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 p-4" },
    React.createElement("div", { className: "max-w-6xl mx-auto" },
        React.createElement("div", { className: "flex justify-between items-center mb-6" },
            React.createElement("div", null,
                React.createElement("h1", { className: "text-3xl font-bold text-white" }, translations_1.translations.admin.title),
                React.createElement("p", { className: "text-gray-400 mt-1" }, translations_1.translations.admin.subtitle)),
            React.createElement("button", { onClick: onLogout, className: "flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg border border-red-900/50 transition-colors" },
                React.createElement(lucide_react_1.Lock, { className: "w-4 h-4" }),
                translations_1.translations.admin.logout)),
        error && (React.createElement("div", { className: "mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300" }, error)),
        success && (React.createElement("div", { className: "mb-4 p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-300" }, success)),
        React.createElement("div", { className: "flex gap-2 mb-6 border-b border-red-900/50" }, ['fields', 'options', 'dependencies', 'config'].map(function (tab) {
            var tabLabels = {
                fields: translations_1.translations.admin.tabs.fields,
                options: translations_1.translations.admin.tabs.options,
                dependencies: translations_1.translations.admin.tabs.dependencies,
                config: translations_1.translations.admin.tabs.config,
            };
            return (React.createElement("button", { key: tab, onClick: function () { return setActiveTab(tab); }, className: "px-4 py-2 font-medium transition-colors ".concat(activeTab === tab
                    ? 'text-red-500 border-b-2 border-red-600'
                    : 'text-gray-400 hover:text-gray-300') }, tabLabels[tab]));
        })),
        React.createElement("div", { className: "bg-black/80 backdrop-blur-sm rounded-lg border border-red-900/50 p-6" },
            activeTab === 'fields' && (React.createElement("div", { className: "space-y-4" },
                React.createElement("button", { onClick: function () { return setShowNewFieldForm(!showNewFieldForm); }, className: "flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors" },
                    React.createElement(lucide_react_1.Plus, { className: "w-4 h-4" }),
                    translations_1.translations.admin.addCustomField),
                showNewFieldForm && (React.createElement("div", { className: "border border-red-900/50 rounded-lg p-4 space-y-3" },
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-1" }, translations_1.translations.admin.fieldName),
                        React.createElement("input", { type: "text", value: newFieldName, onChange: function (e) { return setNewFieldName(e.target.value); }, placeholder: translations_1.translations.admin.fieldNamePlaceholder, className: "w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600" })),
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-1" }, translations_1.translations.admin.displayLabel),
                        React.createElement("input", { type: "text", value: newFieldLabel, onChange: function (e) { return setNewFieldLabel(e.target.value); }, placeholder: translations_1.translations.admin.displayLabelPlaceholder, className: "w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600" })),
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-1" }, translations_1.translations.admin.fieldType),
                        React.createElement("select", { value: newFieldType, onChange: function (e) { return setNewFieldType(e.target.value); }, className: "w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white focus:outline-none focus:border-red-600" },
                            React.createElement("option", { value: "dropdown" }, translations_1.translations.admin.fieldTypeDropdown),
                            React.createElement("option", { value: "string" }, translations_1.translations.admin.fieldTypeString),
                            React.createElement("option", { value: "integer" }, translations_1.translations.admin.fieldTypeInteger))),
                    React.createElement("div", { className: "flex gap-2" },
                        React.createElement("button", { onClick: handleAddField, className: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors" }, translations_1.translations.admin.addField),
                        React.createElement("button", { onClick: function () { return setShowNewFieldForm(false); }, className: "px-4 py-2 bg-slate-700 hover:bg-gray-800 text-white rounded transition-colors" }, translations_1.translations.admin.cancel)))),
                React.createElement("div", { className: "space-y-2" }, sortedFields.map(function (field) { return (React.createElement("div", { key: field.id }, editingFieldId === field.id ? (React.createElement("div", { className: "border border-red-900/50 rounded-lg p-4 space-y-3 bg-slate-700/50" },
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-1" }, translations_1.translations.admin.fieldName),
                        React.createElement("input", { type: "text", value: editFieldName, onChange: function (e) { return setEditFieldName(e.target.value); }, placeholder: translations_1.translations.admin.fieldNamePlaceholder, className: "w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600" })),
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-1" }, translations_1.translations.admin.displayLabel),
                        React.createElement("input", { type: "text", value: editFieldLabel, onChange: function (e) { return setEditFieldLabel(e.target.value); }, placeholder: translations_1.translations.admin.displayLabelPlaceholder, className: "w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600" })),
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-1" }, translations_1.translations.admin.fieldType),
                        React.createElement("select", { value: editFieldType, onChange: function (e) { return setEditFieldType(e.target.value); }, className: "w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white focus:outline-none focus:border-red-600" },
                            React.createElement("option", { value: "dropdown" }, translations_1.translations.admin.fieldTypeDropdown),
                            React.createElement("option", { value: "string" }, translations_1.translations.admin.fieldTypeString),
                            React.createElement("option", { value: "integer" }, translations_1.translations.admin.fieldTypeInteger))),
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-1" }, translations_1.translations.admin.description),
                        React.createElement("textarea", { value: editFieldDescription, onChange: function (e) { return setEditFieldDescription(e.target.value); }, placeholder: translations_1.translations.admin.descriptionPlaceholder, className: "w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600 font-mono text-sm h-16" })),
                    editFieldType === 'dropdown' && (React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-1" }, translations_1.translations.admin.options),
                        React.createElement("textarea", { value: editFieldOptions, onChange: function (e) { return setEditFieldOptions(e.target.value); }, placeholder: translations_1.translations.admin.optionsPlaceholder, className: "w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600 font-mono text-sm h-24" }))),
                    React.createElement("div", { className: "flex gap-2" },
                        React.createElement("button", { onClick: handleSaveEditField, className: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors" }, translations_1.translations.admin.saveChangesField),
                        React.createElement("button", { onClick: handleCancelEditField, className: "px-4 py-2 bg-slate-700 hover:bg-gray-800 text-white rounded transition-colors" }, translations_1.translations.admin.cancel)))) : (React.createElement("div", { className: "flex items-center justify-between p-3 bg-slate-700 rounded-lg" },
                    React.createElement("div", { className: "flex-1" },
                        React.createElement("div", { className: "flex items-center gap-2 mb-1" },
                            React.createElement("p", { className: "font-medium text-white" }, field.label),
                            React.createElement("span", { className: "px-2 py-0.5 text-xs rounded bg-slate-600 text-gray-300 font-mono" }, field.fieldType)),
                        React.createElement("p", { className: "text-sm text-gray-400" }, field.name)),
                    React.createElement("div", { className: "flex gap-1" },
                        React.createElement("button", { onClick: function () { return handleStartEditField(field); }, className: "p-2 hover:bg-blue-500/20 text-blue-400 rounded transition-colors", title: translations_1.translations.admin.editField },
                            React.createElement(lucide_react_1.Edit2, { className: "w-4 h-4" })),
                        field.isCustom && (React.createElement("button", { onClick: function () { return handleDeleteField(field.id); }, className: "p-2 hover:bg-red-500/20 text-red-400 rounded transition-colors ml-1", title: translations_1.translations.admin.deleteField },
                            React.createElement(lucide_react_1.Trash2, { className: "w-4 h-4" })))))))); })))),
            activeTab === 'options' && (React.createElement("div", { className: "space-y-4" },
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-2" }, translations_1.translations.admin.selectField),
                    React.createElement("select", { value: selectedFieldForOptions || '', onChange: function (e) {
                            setSelectedFieldForOptions(e.target.value);
                            setFieldOptionsText('');
                        }, className: "w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white focus:outline-none focus:border-red-600" },
                        React.createElement("option", { value: "" }, translations_1.translations.admin.chooseField),
                        sortedFields.map(function (field) { return (React.createElement("option", { key: field.id, value: field.id }, field.label)); }))),
                selectedFieldForOptions && (React.createElement(React.Fragment, null,
                    ((_a = config.fields.find(function (f) { return f.id === selectedFieldForOptions; })) === null || _a === void 0 ? void 0 : _a.fieldType) !== 'dropdown' && (React.createElement("div", { className: "p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg text-yellow-300 text-sm" }, translations_1.translations.admin.noteNonDropdownField.replace('{fieldType}', ((_b = config.fields.find(function (f) { return f.id === selectedFieldForOptions; })) === null || _b === void 0 ? void 0 : _b.fieldType) || ''))),
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-2" }, translations_1.translations.admin.options),
                        React.createElement("textarea", { value: fieldOptionsText, onChange: function (e) { return setFieldOptionsText(e.target.value); }, placeholder: translations_1.translations.admin.optionsPlaceholder, disabled: ((_c = config.fields.find(function (f) { return f.id === selectedFieldForOptions; })) === null || _c === void 0 ? void 0 : _c.fieldType) !== 'dropdown', className: "w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600 font-mono text-sm h-32 disabled:opacity-50 disabled:cursor-not-allowed" }),
                        React.createElement("button", { onClick: function () { return handleUpdateFieldOptions(selectedFieldForOptions); }, disabled: ((_d = config.fields.find(function (f) { return f.id === selectedFieldForOptions; })) === null || _d === void 0 ? void 0 : _d.fieldType) !== 'dropdown', className: "mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed" }, translations_1.translations.admin.saveOptions)))))),
            activeTab === 'dependencies' && (React.createElement("div", { className: "space-y-4" },
                React.createElement("button", { onClick: function () { return setShowDependencyForm(!showDependencyForm); }, className: "flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors" },
                    React.createElement(lucide_react_1.Plus, { className: "w-4 h-4" }),
                    translations_1.translations.admin.addDependencyRule),
                showDependencyForm && (React.createElement(DependencyForm_1.DependencyForm, { config: config, sortedFields: sortedFields, onAddRule: handleAddDependency, onError: setError })),
                React.createElement("div", { className: "space-y-2" }, config.dependencies.map(function (rule) {
                    return (React.createElement("div", { key: rule.id, className: "flex items-center justify-between p-3 bg-slate-700 rounded-lg" },
                        React.createElement("div", { className: "flex-1" },
                            React.createElement("p", { className: "text-sm text-gray-300" }, formatRuleDisplay(rule)),
                            rule.explanation && (React.createElement("p", { className: "text-xs text-gray-400 mt-1 italic" },
                                "\"",
                                rule.explanation,
                                "\""))),
                        React.createElement("button", { onClick: function () { return handleDeleteDependency(rule.id); }, className: "p-2 hover:bg-red-500/20 text-red-400 rounded transition-colors ml-3", title: translations_1.translations.admin.deleteDependency },
                            React.createElement(lucide_react_1.Trash2, { className: "w-4 h-4" }))));
                })))),
            activeTab === 'config' && (React.createElement("div", { className: "space-y-6" },
                React.createElement("div", { className: "bg-blue-900/30 border border-blue-700 rounded-lg p-4 space-y-3" },
                    React.createElement("h3", { className: "text-lg font-semibold text-blue-200 flex items-center gap-2" },
                        React.createElement(lucide_react_1.AlertCircle, { className: "w-5 h-5" }),
                        translations_1.translations.admin.versioningInfo.title),
                    React.createElement("p", { className: "text-sm text-blue-300" }, translations_1.translations.admin.versioningInfo.description),
                    React.createElement("div", { className: "bg-blue-950/50 rounded p-3 border border-blue-700/50" },
                        React.createElement("p", { className: "text-xs text-blue-300 font-mono" }, translations_1.translations.admin.versioningInfo.howItWorks)),
                    React.createElement("div", { className: "text-sm text-blue-300" },
                        React.createElement("strong", null, "Vers\u00E3o atual da configura\u00E7\u00E3o:"),
                        " ",
                        React.createElement("span", { className: "font-mono text-blue-200" }, config.version || 1))),
                React.createElement("div", { className: "border-b border-red-900/50 pb-6" },
                    React.createElement("h3", { className: "text-lg font-semibold text-white mb-4" }, translations_1.translations.admin.changeAdminPassword),
                    React.createElement("div", { className: "space-y-3" },
                        React.createElement("input", { type: "password", value: newPassword, onChange: function (e) { return setNewPassword(e.target.value); }, placeholder: translations_1.translations.admin.newPassword, className: "w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600" }),
                        React.createElement("button", { onClick: handlePasswordChange, className: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors" }, translations_1.translations.admin.updatePassword))),
                React.createElement("div", { className: "border-b border-red-900/50 pb-6" },
                    React.createElement("h3", { className: "text-lg font-semibold text-white mb-4" }, translations_1.translations.admin.configuration),
                    React.createElement("div", { className: "flex gap-3 flex-wrap" },
                        React.createElement("button", { onClick: handleExport, className: "flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors" },
                            React.createElement(lucide_react_1.Download, { className: "w-4 h-4" }),
                            translations_1.translations.admin.exportConfig),
                        React.createElement("label", { className: "flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors cursor-pointer" },
                            React.createElement(lucide_react_1.Upload, { className: "w-4 h-4" }),
                            translations_1.translations.admin.importConfig,
                            React.createElement("input", { type: "file", accept: ".json", onChange: handleImport, className: "hidden" })),
                        React.createElement("button", { onClick: handleExportGlobal, className: "flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors" },
                            React.createElement(lucide_react_1.Download, { className: "w-4 h-4" }),
                            translations_1.translations.admin.exportConfigGlobal))),
                React.createElement("div", { className: "bg-blue-900/30 border border-blue-700 rounded-lg p-4" },
                    React.createElement("p", { className: "text-sm text-blue-300" }, translations_1.translations.admin.saveConfigGlobalHelp)),
                React.createElement("div", null,
                    React.createElement("h3", { className: "text-lg font-semibold text-white mb-4" }, translations_1.translations.admin.dangerousActions),
                    React.createElement("button", { onClick: function () {
                            if (confirm(translations_1.translations.admin.resetConfirmation)) {
                                (0, storage_1.resetConfig)();
                                setConfig((0, storage_1.loadConfig)());
                                setSuccess(translations_1.translations.admin.configurationResetToDefaults);
                                setTimeout(function () { return setSuccess(''); }, 3000);
                            }
                        }, className: "flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors" },
                        React.createElement(lucide_react_1.RotateCcw, { className: "w-4 h-4" }),
                        translations_1.translations.admin.resetToDefaults))))),
        React.createElement("div", { className: "mt-6 flex justify-end" },
            React.createElement("button", { onClick: handleSave, className: "px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors" }, translations_1.translations.admin.saveChanges)))));
