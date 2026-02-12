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

export interface DependencyRule {
  id: string;
  sourceField: string;    // field ID that triggers rule (must be dropdown)
  sourceValue: string;    // value that triggers rule
  targetField: string;    // field affected by rule
  targetFieldType?: 'dropdown' | 'string'; // NEW: target field type

  // Para dropdown targets (existing - backward compatible)
  allowedValues?: string[];

  // Para string targets (NEW)
  stringConstraint?: {
    type: 'pattern' | 'contains' | 'startsWith' | 'endsWith' | 'equals' | 'minLength' | 'maxLength';
    value: string;
    caseSensitive?: boolean;
  };

  // User-facing explanation (NEW)
  explanation?: string;
}

export interface AppConfig {
  fields: UTMField[];
  dependencies: DependencyRule[];
  adminPassword: string;
  version: number;
}

export const DEFAULT_CONFIG: AppConfig = {
  version: 1,
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
      options: ["cpc", "social", "email", "organic"],
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
