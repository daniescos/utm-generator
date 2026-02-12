export interface UTMField {
  id: string;
  name: string;           // e.g., "utm_source"
  label: string;          // e.g., "Source"
  fieldType: 'dropdown' | 'string' | 'integer';  // field input type
  options: string[];      // dropdown values (only for dropdown type)
  order: number;          // display order
  isCustom: boolean;      // true if admin-created
  description?: string;   // tooltip description shown on hover
}

export type RuleType =
  | 'filter'              // Existing: restrict dropdown options
  | 'validation'          // Existing: validate string fields
  | 'transform'           // NEW: change field type dynamically
  | 'visibility'          // NEW: show/hide fields
  | 'required'            // NEW: make fields required/optional
  | 'autofill'            // NEW: automatically populate field values
  | 'cross_validation';   // NEW: validate relationships between fields

export type SourceCondition = 'equals' | 'not_equals' | 'in' | 'not_in';

export interface StringConstraint {
  type: 'pattern' | 'contains' | 'startsWith' | 'endsWith' | 'equals' | 'minLength' | 'maxLength';
  value: string;
  caseSensitive?: boolean;
}

export interface TransformRuleConfig {
  fieldType: 'dropdown' | 'string';
  dropdownOptions?: string[];
  stringConstraint?: StringConstraint;
  clearValueOnTransform?: boolean;
}

export interface CrossValidationConfig {
  validationRule: string;
  allowedCombinations?: Array<{
    targetValue: string;
    targetValue2?: string;
  }>;
}

export interface DependencyRule {
  id: string;
  ruleType: RuleType;                    // NEW: discriminator for rule type
  priority?: number;                     // NEW: for conflict resolution (higher = first)

  // Source condition
  sourceField: string;                   // field ID that triggers rule
  sourceValue: string;                   // value that triggers rule
  sourceCondition?: SourceCondition;     // NEW: condition type (default: 'equals')
  sourceValues?: string[];               // NEW: for 'in'/'not_in' conditions

  // Target configuration
  targetField: string;                   // field affected by rule
  targetFieldType?: 'dropdown' | 'string';

  // EXISTING: Dropdown filtering (ruleType: 'filter')
  allowedValues?: string[];

  // EXISTING: String validation (ruleType: 'validation')
  stringConstraint?: StringConstraint;

  // NEW: Transform configuration (ruleType: 'transform')
  transformTo?: TransformRuleConfig;

  // NEW: Visibility configuration (ruleType: 'visibility')
  visibilityAction?: 'show' | 'hide';

  // NEW: Required field configuration (ruleType: 'required')
  requiredAction?: 'make_required' | 'make_optional';

  // NEW: Autofill configuration (ruleType: 'autofill')
  autofillValue?: string;
  autofillAllowOverride?: boolean;

  // NEW: Cross-field validation (ruleType: 'cross_validation')
  crossValidation?: CrossValidationConfig;

  // User-facing explanation
  explanation?: string;
}

export interface UTMFieldState {
  fieldId: string;
  originalFieldType: 'dropdown' | 'string' | 'integer';
  currentFieldType: 'dropdown' | 'string' | 'integer';
  isVisible: boolean;
  isRequired: boolean;
  appliedRules: string[];
  hasConflict: boolean;
}

export interface AppConfig {
  fields: UTMField[];
  dependencies: DependencyRule[];
  adminPassword: string;
  version: number;
}

export const DEFAULT_CONFIG: AppConfig = {
  version: 2,
  adminPassword: "admin123",
  fields: [
    {
      id: "source",
      name: "utm_source",
      label: "Source",
      fieldType: "dropdown",
      options: ["google", "facebook", "email", "direct"],
      order: 1,
      isCustom: false,
    },
    {
      id: "medium",
      name: "utm_medium",
      label: "Medium",
      fieldType: "dropdown",
      options: ["cpc", "social", "email", "organic", "journey_builder"],
      order: 2,
      isCustom: false,
    },
    {
      id: "campaign",
      name: "utm_campaign",
      label: "Campaign",
      fieldType: "dropdown",
      options: [],
      order: 3,
      isCustom: false,
    },
    {
      id: "term",
      name: "utm_term",
      label: "Term",
      fieldType: "dropdown",
      options: [],
      order: 4,
      isCustom: false,
    },
    {
      id: "content",
      name: "utm_content",
      label: "Content",
      fieldType: "dropdown",
      options: [],
      order: 5,
      isCustom: false,
    },
  ],
  dependencies: [],
};
