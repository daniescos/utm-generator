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
exports.validateFieldValue = validateFieldValue;
exports.generateUTMUrl = generateUTMUrl;
exports.getAvailableOptionsForField = getAvailableOptionsForField;
exports.validateDependency = validateDependency;
exports.getApplicableDependencyRules = getApplicableDependencyRules;
exports.validateStringAgainstRules = validateStringAgainstRules;
exports.evaluateSourceCondition = evaluateSourceCondition;
exports.getActiveRules = getActiveRules;
exports.checkRuleConflicts = checkRuleConflicts;
exports.computeFieldStates = computeFieldStates;
exports.validateCrossField = validateCrossField;
exports.validateTransformRule = validateTransformRule;
exports.validateVisibilityRule = validateVisibilityRule;
exports.validateRequiredRule = validateRequiredRule;
exports.validateAutofillRule = validateAutofillRule;
exports.validateCrossValidationRule = validateCrossValidationRule;
exports.validateDependencyEnhanced = validateDependencyEnhanced;
exports.copyToClipboard = copyToClipboard;
exports.generateId = generateId;
function validateFieldValue(value, fieldType) {
    if (!value || !value.trim()) {
        return { valid: true, sanitized: '' };
    }
    switch (fieldType) {
        case 'dropdown':
        case 'string':
            return { valid: true, sanitized: value.trim() };
        case 'integer': {
            var parsed = parseInt(value, 10);
            if (isNaN(parsed)) {
                return {
                    valid: false,
                    sanitized: value,
                    error: 'Value must be a valid integer'
                };
            }
            return { valid: true, sanitized: parsed.toString() };
        }
        default:
            return { valid: true, sanitized: value.trim() };
    }
}
function generateUTMUrl(baseUrl, selectedValues, config) {
    if (!baseUrl.trim()) {
        return '';
    }
    var params = new URLSearchParams();
    Object.entries(selectedValues).forEach(function (_a) {
        var fieldId = _a[0], value = _a[1];
        if (value && value.trim()) {
            var field = config.fields.find(function (f) { return f.id === fieldId; });
            if (field) {
                var validation = validateFieldValue(value, field.fieldType);
                if (validation.valid && validation.sanitized) {
                    params.append(field.name, validation.sanitized);
                }
            }
        }
    });
    var separator = baseUrl.includes('?') ? '&' : '?';
    var queryString = params.toString();
    return queryString ? "".concat(baseUrl).concat(separator).concat(queryString) : baseUrl;
}
function getAvailableOptionsForField(fieldId, selectedValues, config) {
    var field = config.fields.find(function (f) { return f.id === fieldId; });
    if (!field)
        return [];
    var availableOptions = __spreadArray([], field.options, true);
    // Apply dependency rules
    var applicableRules = config.dependencies.filter(function (rule) { return rule.targetField === fieldId && selectedValues[rule.sourceField] === rule.sourceValue && rule.targetFieldType === 'dropdown'; });
    if (applicableRules.length > 0) {
        // If there are applicable rules, restrict to their allowed values
        var ruleAllowedValues_1 = new Set();
        applicableRules.forEach(function (rule) {
            if (rule.allowedValues) {
                rule.allowedValues.forEach(function (val) { return ruleAllowedValues_1.add(val); });
            }
        });
        availableOptions = availableOptions.filter(function (opt) { return ruleAllowedValues_1.has(opt); });
    }
    return availableOptions;
}
function validateDependency(rule, config) {
    // Use enhanced validation that supports all rule types
    return validateDependencyEnhanced(rule, config);
}
function validateDropdownDependency(rule, targetField) {
    if (!rule.allowedValues || rule.allowedValues.length === 0) {
        return { valid: false, error: 'Dropdown dependency must have allowed values' };
    }
    // Check all allowed values exist in target field options
    var invalidValues = rule.allowedValues.filter(function (val) { return !targetField.options.includes(val); });
    if (invalidValues.length > 0) {
        return { valid: false, error: "Invalid target values: ".concat(invalidValues.join(', ')) };
    }
    return { valid: true };
}
function validateStringDependency(rule) {
    if (!rule.stringConstraint) {
        return { valid: false, error: 'String dependency must have a constraint' };
    }
    var sc = rule.stringConstraint;
    if (!sc.type) {
        return { valid: false, error: 'String constraint must have a type' };
    }
    if (!sc.value && !['minLength', 'maxLength'].includes(sc.type)) {
        return { valid: false, error: 'String constraint must have a value' };
    }
    // Validate regex pattern if type is 'pattern'
    if (sc.type === 'pattern') {
        try {
            new RegExp(sc.value);
        }
        catch (e) {
            return { valid: false, error: "Invalid regex pattern: ".concat(sc.value) };
        }
    }
    // Validate length constraints
    if (['minLength', 'maxLength'].includes(sc.type)) {
        var length_1 = parseInt(sc.value);
        if (isNaN(length_1) || length_1 < 0) {
            return { valid: false, error: 'Length constraint must be a non-negative number' };
        }
    }
    return { valid: true };
}
/**
 * Get applicable dependency rules for a field based on current selections
 */
function getApplicableDependencyRules(fieldId, selectedValues, config) {
    return config.dependencies.filter(function (rule) { return rule.targetField === fieldId && selectedValues[rule.sourceField] === rule.sourceValue; });
}
/**
 * Validate a string value against dependency rules
 */
function validateStringAgainstRules(value, applicableRules) {
    for (var _i = 0, applicableRules_1 = applicableRules; _i < applicableRules_1.length; _i++) {
        var rule = applicableRules_1[_i];
        if (rule.targetFieldType !== 'string' || !rule.stringConstraint)
            continue;
        var sc = rule.stringConstraint;
        var testValue = sc.caseSensitive ? value : value.toLowerCase();
        var constraintValue = sc.caseSensitive ? sc.value : sc.value.toLowerCase();
        var valid = true;
        var error = '';
        switch (sc.type) {
            case 'pattern':
                try {
                    var regex = new RegExp(sc.value, sc.caseSensitive ? '' : 'i');
                    valid = regex.test(value);
                    error = valid ? '' : "Deve corresponder ao padr\u00E3o: ".concat(sc.value);
                }
                catch (e) {
                    valid = false;
                    error = 'Padrão inválido';
                }
                break;
            case 'contains':
                valid = testValue.includes(constraintValue);
                error = valid ? '' : "Deve conter: ".concat(sc.value);
                break;
            case 'startsWith':
                valid = testValue.startsWith(constraintValue);
                error = valid ? '' : "Deve come\u00E7ar com: ".concat(sc.value);
                break;
            case 'endsWith':
                valid = testValue.endsWith(constraintValue);
                error = valid ? '' : "Deve terminar com: ".concat(sc.value);
                break;
            case 'equals':
                valid = testValue === constraintValue;
                error = valid ? '' : "Deve ser exatamente: ".concat(sc.value);
                break;
            case 'minLength':
                var minLen = parseInt(sc.value);
                valid = value.length >= minLen;
                error = valid ? '' : "Deve ter pelo menos ".concat(minLen, " caracteres");
                break;
            case 'maxLength':
                var maxLen = parseInt(sc.value);
                valid = value.length <= maxLen;
                error = valid ? '' : "Deve ter no m\u00E1ximo ".concat(maxLen, " caracteres");
                break;
        }
        if (!valid) {
            return { valid: false, error: error, violatedRule: rule };
        }
    }
    return { valid: true };
}
/**
 * Evaluate if a rule should be active based on source condition
 */
function evaluateSourceCondition(rule, sourceValue) {
    if (!sourceValue)
        return false;
    var condition = rule.sourceCondition || 'equals';
    switch (condition) {
        case 'equals':
            return sourceValue === rule.sourceValue;
        case 'not_equals':
            return sourceValue !== rule.sourceValue;
        case 'in':
            return (rule.sourceValues || []).includes(sourceValue);
        case 'not_in':
            return !(rule.sourceValues || []).includes(sourceValue);
        default:
            return false;
    }
}
/**
 * Get all active rules for the current state
 */
function getActiveRules(selectedValues, config) {
    var activeRulesByField = new Map();
    for (var _i = 0, _a = config.dependencies; _i < _a.length; _i++) {
        var rule = _a[_i];
        var isActive = evaluateSourceCondition(rule, selectedValues[rule.sourceField]);
        if (isActive) {
            var existing = activeRulesByField.get(rule.targetField) || [];
            existing.push(rule);
            activeRulesByField.set(rule.targetField, existing);
        }
    }
    // Sort by priority (higher first)
    for (var _b = 0, activeRulesByField_1 = activeRulesByField; _b < activeRulesByField_1.length; _b++) {
        var _c = activeRulesByField_1[_b], field = _c[0], rules = _c[1];
        rules.sort(function (a, b) { return (b.priority || 0) - (a.priority || 0); });
        activeRulesByField.set(field, rules);
    }
    return activeRulesByField;
}
/**
 * Check if multiple rules conflict with each other
 */
function checkRuleConflicts(rules) {
    if (rules.length <= 1)
        return false;
    // Check for conflicting visibility rules
    var visibilityRules = rules.filter(function (r) { return r.ruleType === 'visibility'; });
    if (visibilityRules.length > 1) {
        var actions = new Set(visibilityRules.map(function (r) { return r.visibilityAction; }));
        if (actions.size > 1)
            return true;
    }
    // Check for conflicting required rules
    var requiredRules = rules.filter(function (r) { return r.ruleType === 'required'; });
    if (requiredRules.length > 1) {
        var actions = new Set(requiredRules.map(function (r) { return r.requiredAction; }));
        if (actions.size > 1)
            return true;
    }
    // Check for conflicting transform rules
    var transformRules = rules.filter(function (r) { return r.ruleType === 'transform'; });
    if (transformRules.length > 1) {
        var types = new Set(transformRules.map(function (r) { var _a; return (_a = r.transformTo) === null || _a === void 0 ? void 0 : _a.fieldType; }));
        if (types.size > 1)
            return true;
    }
    return false;
}
/**
 * Compute field states based on active rules
 */
function computeFieldStates(selectedValues, config) {
    var _a;
    var activeRules = getActiveRules(selectedValues, config);
    var states = {};
    for (var _i = 0, _b = config.fields; _i < _b.length; _i++) {
        var field = _b[_i];
        var rules = activeRules.get(field.id) || [];
        // Determine visibility
        var hideRule = rules.find(function (r) { return r.ruleType === 'visibility' && r.visibilityAction === 'hide'; });
        var isVisible = !hideRule;
        // Determine current field type (apply transforms)
        var transformRule = rules.find(function (r) { return r.ruleType === 'transform'; });
        var currentFieldType = ((_a = transformRule === null || transformRule === void 0 ? void 0 : transformRule.transformTo) === null || _a === void 0 ? void 0 : _a.fieldType) || field.fieldType;
        // Determine if required
        var requiredRule = rules.find(function (r) { return r.ruleType === 'required'; });
        var isRequired = (requiredRule === null || requiredRule === void 0 ? void 0 : requiredRule.requiredAction) === 'make_required' || false;
        // Check for conflicts
        var hasConflict = checkRuleConflicts(rules);
        states[field.id] = {
            fieldId: field.id,
            originalFieldType: field.fieldType,
            currentFieldType: currentFieldType,
            isVisible: isVisible,
            isRequired: isRequired,
            appliedRules: rules.map(function (r) { return r.id; }),
            hasConflict: hasConflict,
        };
    }
    return states;
}
/**
 * Validate cross-field relationships
 */
function validateCrossField(rule, selectedValues) {
    if (!rule.crossValidation) {
        return { valid: true };
    }
    var cv = rule.crossValidation;
    if (cv.allowedCombinations && cv.allowedCombinations.length > 0) {
        var targetValue_1 = selectedValues[rule.targetField];
        var isAllowed = cv.allowedCombinations.some(function (combo) {
            return combo.targetValue === targetValue_1;
        });
        if (!isAllowed) {
            return {
                valid: false,
                error: cv.validationRule || 'Combinação de campos inválida'
            };
        }
    }
    return { valid: true };
}
/**
 * Validate transform rule at creation time
 */
function validateTransformRule(rule, config) {
    if (!rule.transformTo) {
        return { valid: false, error: 'Transform rule must have transformTo configuration' };
    }
    var _a = rule.transformTo, fieldType = _a.fieldType, dropdownOptions = _a.dropdownOptions, stringConstraint = _a.stringConstraint;
    if (!fieldType) {
        return { valid: false, error: 'Target field type must be specified' };
    }
    // Validate transform to dropdown
    if (fieldType === 'dropdown' && dropdownOptions) {
        var targetField_1 = config.fields.find(function (f) { return f.id === rule.targetField; });
        if (targetField_1 && targetField_1.fieldType === 'dropdown') {
            var invalidOptions = dropdownOptions.filter(function (opt) { return !targetField_1.options.includes(opt); });
            if (invalidOptions.length > 0) {
                return { valid: false, error: "Invalid dropdown options: ".concat(invalidOptions.join(', ')) };
            }
        }
    }
    // Validate transform to string with constraint
    if (fieldType === 'string' && stringConstraint) {
        var constraintValidation = validateStringDependency(__assign(__assign({}, rule), { stringConstraint: stringConstraint }));
        if (!constraintValidation.valid) {
            return constraintValidation;
        }
    }
    return { valid: true };
}
/**
 * Validate visibility rule at creation time
 */
function validateVisibilityRule(rule) {
    if (!rule.visibilityAction) {
        return { valid: false, error: 'Visibility rule must have an action (show/hide)' };
    }
    if (!['show', 'hide'].includes(rule.visibilityAction)) {
        return { valid: false, error: 'Invalid visibility action' };
    }
    return { valid: true };
}
/**
 * Validate required rule at creation time
 */
function validateRequiredRule(rule) {
    if (!rule.requiredAction) {
        return { valid: false, error: 'Required rule must have an action (make_required/make_optional)' };
    }
    if (!['make_required', 'make_optional'].includes(rule.requiredAction)) {
        return { valid: false, error: 'Invalid required action' };
    }
    return { valid: true };
}
/**
 * Validate autofill rule at creation time
 */
function validateAutofillRule(rule, config) {
    if (!rule.autofillValue) {
        return { valid: false, error: 'Autofill rule must have a value to fill' };
    }
    var targetField = config.fields.find(function (f) { return f.id === rule.targetField; });
    if (!targetField) {
        return { valid: false, error: 'Target field not found' };
    }
    // If target is dropdown, validate value exists in options
    if (targetField.fieldType === 'dropdown') {
        if (!targetField.options.includes(rule.autofillValue)) {
            return { valid: false, error: "Autofill value \"".concat(rule.autofillValue, "\" not in target field options") };
        }
    }
    return { valid: true };
}
/**
 * Validate cross-validation rule at creation time
 */
function validateCrossValidationRule(rule, config) {
    if (!rule.crossValidation) {
        return { valid: false, error: 'Cross-validation rule must have configuration' };
    }
    var cv = rule.crossValidation;
    if (!cv.validationRule && (!cv.allowedCombinations || cv.allowedCombinations.length === 0)) {
        return { valid: false, error: 'Cross-validation must have either a description or allowed combinations' };
    }
    if (cv.allowedCombinations && cv.allowedCombinations.length > 0) {
        var targetField_2 = config.fields.find(function (f) { return f.id === rule.targetField; });
        if (targetField_2 && targetField_2.fieldType === 'dropdown') {
            var invalidCombos = cv.allowedCombinations.filter(function (combo) { return !targetField_2.options.includes(combo.targetValue); });
            if (invalidCombos.length > 0) {
                return { valid: false, error: 'Some allowed combinations have invalid target values' };
            }
        }
    }
    return { valid: true };
}
/**
 * Update validateDependency to handle all rule types
 */
function validateDependencyEnhanced(rule, config) {
    // Check source and target fields exist
    var sourceField = config.fields.find(function (f) { return f.id === rule.sourceField; });
    if (!sourceField) {
        return { valid: false, error: "Source field ".concat(rule.sourceField, " not found") };
    }
    var targetField = config.fields.find(function (f) { return f.id === rule.targetField; });
    if (!targetField) {
        return { valid: false, error: "Target field ".concat(rule.targetField, " not found") };
    }
    // Source field must be dropdown (only dropdowns trigger rules)
    if (sourceField.fieldType !== 'dropdown') {
        return {
            valid: false,
            error: "Source field must be a dropdown type (current: ".concat(sourceField.fieldType, ")")
        };
    }
    // For 'in' and 'not_in', check sourceValues exist
    var condition = rule.sourceCondition || 'equals';
    if ((condition === 'in' || condition === 'not_in') && rule.sourceValues) {
        var invalidValues = rule.sourceValues.filter(function (val) { return !sourceField.options.includes(val); });
        if (invalidValues.length > 0) {
            return { valid: false, error: "Invalid source values: ".concat(invalidValues.join(', ')) };
        }
    }
    // For 'equals' and 'not_equals', check sourceValue exists
    if ((condition === 'equals' || condition === 'not_equals') && !sourceField.options.includes(rule.sourceValue)) {
        return { valid: false, error: "Source value ".concat(rule.sourceValue, " not in source field options") };
    }
    // Type-specific validation
    var ruleType = rule.ruleType || 'filter';
    switch (ruleType) {
        case 'filter':
            return validateDropdownDependency(rule, targetField);
        case 'validation':
            return validateStringDependency(rule);
        case 'transform':
            return validateTransformRule(rule, config);
        case 'visibility':
            return validateVisibilityRule(rule);
        case 'required':
            return validateRequiredRule(rule);
        case 'autofill':
            return validateAutofillRule(rule, config);
        case 'cross_validation':
            return validateCrossValidationRule(rule, config);
        default:
            return { valid: false, error: "Unknown rule type: ".concat(ruleType) };
    }
}
function copyToClipboard(text) {
    return navigator.clipboard
        .writeText(text)
        .then(function () { return true; })
        .catch(function () { return false; });
}
function generateId() {
    return "".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9));
}
