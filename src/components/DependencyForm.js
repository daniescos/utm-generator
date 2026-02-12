"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyForm = DependencyForm;
var react_1 = require("react");
var utils_1 = require("../lib/utils");
var translations_1 = require("../lib/translations");
function DependencyForm(_a) {
    var _b;
    var config = _a.config, onAddRule = _a.onAddRule, onError = _a.onError, sortedFields = _a.sortedFields;
    var _c = (0, react_1.useState)('filter'), ruleType = _c[0], setRuleType = _c[1];
    var _d = (0, react_1.useState)(''), sourceField = _d[0], setSourceField = _d[1];
    var _e = (0, react_1.useState)(''), sourceValue = _e[0], setSourceValue = _e[1];
    var _f = (0, react_1.useState)(''), targetField = _f[0], setTargetField = _f[1];
    var _g = (0, react_1.useState)(50), priority = _g[0], setPriority = _g[1];
    var _h = (0, react_1.useState)('string'), transformFieldType = _h[0], setTransformFieldType = _h[1];
    var _j = (0, react_1.useState)('hide'), visibilityAction = _j[0], setVisibilityAction = _j[1];
    var _k = (0, react_1.useState)('make_required'), requiredAction = _k[0], setRequiredAction = _k[1];
    var _l = (0, react_1.useState)(''), autofillValue = _l[0], setAutofillValue = _l[1];
    var _m = (0, react_1.useState)(true), autofillAllowOverride = _m[0], setAutofillAllowOverride = _m[1];
    var _o = (0, react_1.useState)(''), explanation = _o[0], setExplanation = _o[1];
    var resetForm = function () {
        setRuleType('filter');
        setSourceField('');
        setSourceValue('');
        setTargetField('');
        setPriority(50);
        setTransformFieldType('string');
        setVisibilityAction('hide');
        setRequiredAction('make_required');
        setAutofillValue('');
        setAutofillAllowOverride(true);
        setExplanation('');
    };
    var handleSubmit = function () {
        var _a;
        if (!sourceField || !sourceValue || !targetField) {
            onError(translations_1.translations.admin.allDependencyFieldsRequired);
            return;
        }
        var rule = {
            id: (0, utils_1.generateId)(),
            ruleType: ruleType,
            priority: priority,
            sourceField: sourceField,
            sourceValue: sourceValue,
            sourceCondition: 'equals',
            targetField: targetField,
            targetFieldType: (_a = config.fields.find(function (f) { return f.id === targetField; })) === null || _a === void 0 ? void 0 : _a.fieldType,
            explanation: explanation || undefined,
        };
        // Type-specific properties
        switch (ruleType) {
            case 'transform':
                rule.transformTo = {
                    fieldType: transformFieldType,
                    clearValueOnTransform: true,
                };
                break;
            case 'visibility':
                rule.visibilityAction = visibilityAction;
                break;
            case 'required':
                rule.requiredAction = requiredAction;
                break;
            case 'autofill':
                rule.autofillValue = autofillValue;
                rule.autofillAllowOverride = autofillAllowOverride;
                break;
        }
        onAddRule(rule);
        resetForm();
    };
    return (React.createElement("div", { className: "border border-red-900/50 rounded-lg p-4 space-y-4" },
        React.createElement("div", null,
            React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-1" }, translations_1.translations.admin.ruleType),
            React.createElement("select", { value: ruleType, onChange: function (e) { return setRuleType(e.target.value); }, className: "w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white focus:outline-none focus:border-red-600" },
                React.createElement("option", { value: "filter" }, translations_1.translations.admin.ruleTypes.filter),
                React.createElement("option", { value: "validation" }, translations_1.translations.admin.ruleTypes.validation),
                React.createElement("option", { value: "transform" }, translations_1.translations.admin.ruleTypes.transform),
                React.createElement("option", { value: "visibility" }, translations_1.translations.admin.ruleTypes.visibility),
                React.createElement("option", { value: "required" }, translations_1.translations.admin.ruleTypes.required),
                React.createElement("option", { value: "autofill" }, translations_1.translations.admin.ruleTypes.autofill),
                React.createElement("option", { value: "cross_validation" }, translations_1.translations.admin.ruleTypes.cross_validation)),
            React.createElement("p", { className: "text-xs text-gray-500 mt-1" }, translations_1.translations.admin.ruleTypeDescriptions[ruleType])),
        React.createElement("div", { className: "grid grid-cols-2 gap-3" },
            React.createElement("div", null,
                React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-1" }, translations_1.translations.admin.ifField),
                React.createElement("select", { value: sourceField, onChange: function (e) {
                        setSourceField(e.target.value);
                        setSourceValue('');
                    }, className: "w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white focus:outline-none focus:border-red-600" },
                    React.createElement("option", { value: "" }, translations_1.translations.admin.selectSourceField),
                    sortedFields.filter(function (f) { return f.fieldType === 'dropdown'; }).map(function (f) { return (React.createElement("option", { key: f.id, value: f.id }, f.label)); }))),
            sourceField && (React.createElement("div", null,
                React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-1" }, translations_1.translations.admin.equals),
                React.createElement("select", { value: sourceValue, onChange: function (e) { return setSourceValue(e.target.value); }, className: "w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white focus:outline-none focus:border-red-600" },
                    React.createElement("option", { value: "" }, translations_1.translations.admin.selectValue), (_b = config.fields.find(function (f) { return f.id === sourceField; })) === null || _b === void 0 ? void 0 :
                    _b.options.map(function (opt) { return (React.createElement("option", { key: opt, value: opt }, opt)); }))))),
        React.createElement("div", null,
            React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-1" }, translations_1.translations.admin.thenLimitField),
            React.createElement("select", { value: targetField, onChange: function (e) { return setTargetField(e.target.value); }, className: "w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white focus:outline-none focus:border-red-600" },
                React.createElement("option", { value: "" }, translations_1.translations.admin.selectSourceField),
                sortedFields.map(function (f) { return (React.createElement("option", { key: f.id, value: f.id }, f.label)); }))),
        React.createElement("div", null,
            React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-1" }, translations_1.translations.admin.priority),
            React.createElement("input", { type: "number", min: 0, max: 100, value: priority, onChange: function (e) { return setPriority(parseInt(e.target.value, 10)); }, className: "w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white focus:outline-none focus:border-red-600" }),
            React.createElement("p", { className: "text-xs text-gray-500 mt-1" }, translations_1.translations.admin.priorityHelp)),
        ruleType === 'transform' && (React.createElement("div", { className: "border-l-4 border-cyan-500 pl-4 py-2 bg-cyan-900/10 rounded" },
            React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-2" }, translations_1.translations.admin.transformFieldType),
            React.createElement("select", { value: transformFieldType, onChange: function (e) { return setTransformFieldType(e.target.value); }, className: "w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white focus:outline-none focus:border-red-600" },
                React.createElement("option", { value: "dropdown" }, "Dropdown"),
                React.createElement("option", { value: "string" }, "String (Texto Livre)")))),
        ruleType === 'visibility' && (React.createElement("div", { className: "border-l-4 border-purple-500 pl-4 py-2 bg-purple-900/10 rounded" },
            React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-2" }, translations_1.translations.admin.visibilityAction),
            React.createElement("div", { className: "space-y-2" },
                React.createElement("label", { className: "flex items-center gap-2" },
                    React.createElement("input", { type: "radio", checked: visibilityAction === 'hide', onChange: function () { return setVisibilityAction('hide'); }, className: "w-4 h-4 accent-red-600" }),
                    React.createElement("span", { className: "text-sm text-gray-300" }, translations_1.translations.admin.hideField)),
                React.createElement("label", { className: "flex items-center gap-2" },
                    React.createElement("input", { type: "radio", checked: visibilityAction === 'show', onChange: function () { return setVisibilityAction('show'); }, className: "w-4 h-4 accent-red-600" }),
                    React.createElement("span", { className: "text-sm text-gray-300" }, translations_1.translations.admin.showField))))),
        ruleType === 'required' && (React.createElement("div", { className: "border-l-4 border-red-500 pl-4 py-2 bg-red-900/10 rounded" },
            React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-2" }, translations_1.translations.admin.requiredAction),
            React.createElement("div", { className: "space-y-2" },
                React.createElement("label", { className: "flex items-center gap-2" },
                    React.createElement("input", { type: "radio", checked: requiredAction === 'make_required', onChange: function () { return setRequiredAction('make_required'); }, className: "w-4 h-4 accent-red-600" }),
                    React.createElement("span", { className: "text-sm text-gray-300" }, translations_1.translations.admin.makeRequired)),
                React.createElement("label", { className: "flex items-center gap-2" },
                    React.createElement("input", { type: "radio", checked: requiredAction === 'make_optional', onChange: function () { return setRequiredAction('make_optional'); }, className: "w-4 h-4 accent-red-600" }),
                    React.createElement("span", { className: "text-sm text-gray-300" }, translations_1.translations.admin.makeOptional))))),
        ruleType === 'autofill' && (React.createElement("div", { className: "border-l-4 border-green-500 pl-4 py-2 bg-green-900/10 rounded space-y-3" },
            React.createElement("div", null,
                React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-1" }, translations_1.translations.admin.autofillValueLabel),
                React.createElement("input", { type: "text", value: autofillValue, onChange: function (e) { return setAutofillValue(e.target.value); }, placeholder: "ex: email", className: "w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600" })),
            React.createElement("label", { className: "flex items-center gap-2" },
                React.createElement("input", { type: "checkbox", checked: autofillAllowOverride, onChange: function (e) { return setAutofillAllowOverride(e.target.checked); }, className: "w-4 h-4 accent-red-600" }),
                React.createElement("span", { className: "text-sm text-gray-300" }, translations_1.translations.admin.allowUserToOverride)))),
        React.createElement("div", null,
            React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-1" },
                translations_1.translations.admin.ruleExplanation,
                " ",
                React.createElement("span", { className: "text-gray-500" },
                    "(",
                    translations_1.translations.admin.optional,
                    ")")),
            React.createElement("input", { type: "text", value: explanation, onChange: function (e) { return setExplanation(e.target.value); }, placeholder: translations_1.translations.admin.ruleExplanationPlaceholder, className: "w-full px-3 py-2 bg-gray-900 border border-red-900/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600" }),
            React.createElement("p", { className: "text-xs text-gray-500 mt-1" }, translations_1.translations.admin.ruleExplanationHelp)),
        React.createElement("div", { className: "flex gap-2" },
            React.createElement("button", { onClick: handleSubmit, className: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors" }, translations_1.translations.admin.addRule),
            React.createElement("button", { onClick: resetForm, className: "px-4 py-2 bg-slate-700 hover:bg-gray-800 text-white rounded transition-colors" }, translations_1.translations.admin.cancel))));
}
