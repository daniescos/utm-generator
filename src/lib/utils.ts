import type { AppConfig, DependencyRule } from './types';

export function validateFieldValue(
  value: string,
  fieldType: 'dropdown' | 'string' | 'integer'
): { valid: boolean; sanitized: string; error?: string } {
  if (!value || !value.trim()) {
    return { valid: true, sanitized: '' };
  }

  switch (fieldType) {
    case 'dropdown':
    case 'string':
      return { valid: true, sanitized: value.trim() };

    case 'integer': {
      const parsed = parseInt(value, 10);
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

export function generateUTMUrl(
  baseUrl: string,
  selectedValues: Record<string, string>,
  config: AppConfig
): string {
  if (!baseUrl.trim()) {
    return '';
  }

  const params = new URLSearchParams();

  Object.entries(selectedValues).forEach(([fieldId, value]) => {
    if (value && value.trim()) {
      const field = config.fields.find(f => f.id === fieldId);
      if (field) {
        const validation = validateFieldValue(value, field.fieldType);
        if (validation.valid && validation.sanitized) {
          params.append(field.name, validation.sanitized);
        }
      }
    }
  });

  const separator = baseUrl.includes('?') ? '&' : '?';
  const queryString = params.toString();

  return queryString ? `${baseUrl}${separator}${queryString}` : baseUrl;
}

export function getAvailableOptionsForField(
  fieldId: string,
  selectedValues: Record<string, string>,
  config: AppConfig
): string[] {
  const field = config.fields.find(f => f.id === fieldId);
  if (!field) return [];

  let availableOptions = [...field.options];

  // Apply dependency rules
  const applicableRules = config.dependencies.filter(
    rule => rule.targetField === fieldId && selectedValues[rule.sourceField] === rule.sourceValue && rule.targetFieldType === 'dropdown'
  );

  if (applicableRules.length > 0) {
    // If there are applicable rules, restrict to their allowed values
    const ruleAllowedValues = new Set<string>();
    applicableRules.forEach(rule => {
      if (rule.allowedValues) {
        rule.allowedValues.forEach(val => ruleAllowedValues.add(val));
      }
    });
    availableOptions = availableOptions.filter(opt => ruleAllowedValues.has(opt));
  }

  return availableOptions;
}

export function validateDependency(
  rule: DependencyRule,
  config: AppConfig
): { valid: boolean; error?: string } {
  // Check source field exists
  const sourceField = config.fields.find(f => f.id === rule.sourceField);
  if (!sourceField) {
    return { valid: false, error: `Source field ${rule.sourceField} not found` };
  }

  // Check target field exists
  const targetField = config.fields.find(f => f.id === rule.targetField);
  if (!targetField) {
    return { valid: false, error: `Target field ${rule.targetField} not found` };
  }

  // Source field must be dropdown (only dropdowns trigger rules)
  if (sourceField.fieldType !== 'dropdown') {
    return {
      valid: false,
      error: `Source field must be a dropdown type (current: ${sourceField.fieldType})`
    };
  }

  // Check source value exists in source field options
  if (!sourceField.options.includes(rule.sourceValue)) {
    return { valid: false, error: `Source value ${rule.sourceValue} not in source field options` };
  }

  // Validate based on target field type
  switch (rule.targetFieldType || targetField.fieldType) {
    case 'dropdown':
      return validateDropdownDependency(rule, targetField);
    case 'string':
      return validateStringDependency(rule);
    default:
      return { valid: false, error: `Unsupported target field type: ${targetField.fieldType}` };
  }
}

function validateDropdownDependency(
  rule: DependencyRule,
  targetField: any
): { valid: boolean; error?: string } {
  if (!rule.allowedValues || rule.allowedValues.length === 0) {
    return { valid: false, error: 'Dropdown dependency must have allowed values' };
  }

  // Check all allowed values exist in target field options
  const invalidValues = rule.allowedValues.filter(
    val => !targetField.options.includes(val)
  );
  if (invalidValues.length > 0) {
    return { valid: false, error: `Invalid target values: ${invalidValues.join(', ')}` };
  }

  return { valid: true };
}

function validateStringDependency(
  rule: DependencyRule
): { valid: boolean; error?: string } {
  if (!rule.stringConstraint) {
    return { valid: false, error: 'String dependency must have a constraint' };
  }

  const sc = rule.stringConstraint;

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
    } catch (e) {
      return { valid: false, error: `Invalid regex pattern: ${sc.value}` };
    }
  }

  // Validate length constraints
  if (['minLength', 'maxLength'].includes(sc.type)) {
    const length = parseInt(sc.value);
    if (isNaN(length) || length < 0) {
      return { valid: false, error: 'Length constraint must be a non-negative number' };
    }
  }

  return { valid: true };
}

/**
 * Get applicable dependency rules for a field based on current selections
 */
export function getApplicableDependencyRules(
  fieldId: string,
  selectedValues: Record<string, string>,
  config: AppConfig
): DependencyRule[] {
  return config.dependencies.filter(
    rule => rule.targetField === fieldId && selectedValues[rule.sourceField] === rule.sourceValue
  );
}

/**
 * Validate a string value against dependency rules
 */
export function validateStringAgainstRules(
  value: string,
  applicableRules: DependencyRule[]
): { valid: boolean; error?: string; violatedRule?: DependencyRule } {
  for (const rule of applicableRules) {
    if (rule.targetFieldType !== 'string' || !rule.stringConstraint) continue;

    const sc = rule.stringConstraint;
    const testValue = sc.caseSensitive ? value : value.toLowerCase();
    const constraintValue = sc.caseSensitive ? sc.value : sc.value.toLowerCase();

    let valid = true;
    let error = '';

    switch (sc.type) {
      case 'pattern':
        try {
          const regex = new RegExp(sc.value, sc.caseSensitive ? '' : 'i');
          valid = regex.test(value);
          error = valid ? '' : `Deve corresponder ao padrão: ${sc.value}`;
        } catch (e) {
          valid = false;
          error = 'Padrão inválido';
        }
        break;

      case 'contains':
        valid = testValue.includes(constraintValue);
        error = valid ? '' : `Deve conter: ${sc.value}`;
        break;

      case 'startsWith':
        valid = testValue.startsWith(constraintValue);
        error = valid ? '' : `Deve começar com: ${sc.value}`;
        break;

      case 'endsWith':
        valid = testValue.endsWith(constraintValue);
        error = valid ? '' : `Deve terminar com: ${sc.value}`;
        break;

      case 'equals':
        valid = testValue === constraintValue;
        error = valid ? '' : `Deve ser exatamente: ${sc.value}`;
        break;

      case 'minLength':
        const minLen = parseInt(sc.value);
        valid = value.length >= minLen;
        error = valid ? '' : `Deve ter pelo menos ${minLen} caracteres`;
        break;

      case 'maxLength':
        const maxLen = parseInt(sc.value);
        valid = value.length <= maxLen;
        error = valid ? '' : `Deve ter no máximo ${maxLen} caracteres`;
        break;
    }

    if (!valid) {
      return { valid: false, error, violatedRule: rule };
    }
  }

  return { valid: true };
}

export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => false);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
