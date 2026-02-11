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
    rule => rule.targetField === fieldId && selectedValues[rule.sourceField] === rule.sourceValue
  );

  if (applicableRules.length > 0) {
    // If there are applicable rules, restrict to their allowed values
    const ruleAllowedValues = new Set<string>();
    applicableRules.forEach(rule => {
      rule.allowedValues.forEach(val => ruleAllowedValues.add(val));
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

  // Validate that both fields are dropdown type (dependencies only work with dropdowns)
  if (sourceField.fieldType !== 'dropdown') {
    return {
      valid: false,
      error: `Source field must be a dropdown type (current: ${sourceField.fieldType})`
    };
  }

  if (targetField.fieldType !== 'dropdown') {
    return {
      valid: false,
      error: `Target field must be a dropdown type (current: ${targetField.fieldType})`
    };
  }

  // Check source value exists in source field options
  if (!sourceField.options.includes(rule.sourceValue)) {
    return { valid: false, error: `Source value ${rule.sourceValue} not in source field options` };
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

export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => false);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
