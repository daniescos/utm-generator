import type { AppConfig } from './types';
import { DEFAULT_CONFIG } from './types';

const CONFIG_KEY = 'utm_generator_config';

// Load global config from public/config.json
async function loadGlobalConfig(): Promise<AppConfig | null> {
  try {
    const response = await fetch('/config.json');
    if (response.ok) {
      const config = await response.json();
      // Ensure fields have all required properties
      if (config.fields) {
        config.fields = config.fields.map((field: any) => ({
          ...field,
          fieldType: field.fieldType || 'dropdown',
          description: field.description !== undefined ? field.description : undefined
        }));
      }
      return config;
    }
  } catch {
    console.error('Failed to load global config from public/config.json');
  }
  return null;
}

// Load config with priority: localStorage > global config > defaults
export function loadConfig(): AppConfig {
  try {
    // First, check localStorage
    const stored = localStorage.getItem(CONFIG_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migration: Add fieldType to fields without it
      if (parsed.fields) {
        parsed.fields = parsed.fields.map((field: any) => ({
          ...field,
          fieldType: field.fieldType || 'dropdown',
          description: field.description !== undefined ? field.description : undefined
        }));
      }
      return parsed;
    }
    return DEFAULT_CONFIG;
  } catch {
    console.error('Failed to load config from storage');
    return DEFAULT_CONFIG;
  }
}

// Async version: Load from global config first, then localStorage
export async function loadConfigAsync(): Promise<AppConfig> {
  // Try to load global config first
  const globalConfig = await loadGlobalConfig();
  if (globalConfig) {
    // Check if user has custom changes in localStorage
    const stored = localStorage.getItem(CONFIG_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return globalConfig;
      }
    }
    return globalConfig;
  }
  // Fallback to synchronous load
  return loadConfig();
}

export function saveConfig(config: AppConfig): void {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch {
    console.error('Failed to save config to storage');
  }
}

export function exportConfig(): string {
  const config = loadConfig();
  return JSON.stringify(config, null, 2);
}

export function importConfig(jsonString: string): AppConfig {
  try {
    const parsed = JSON.parse(jsonString);
    // Validate basic structure
    if (!parsed.fields || !Array.isArray(parsed.fields)) {
      throw new Error('Invalid config format: missing fields array');
    }
    if (!parsed.dependencies || !Array.isArray(parsed.dependencies)) {
      throw new Error('Invalid config format: missing dependencies array');
    }
    if (typeof parsed.adminPassword !== 'string') {
      throw new Error('Invalid config format: missing adminPassword');
    }

    // Migration: Add fieldType to fields without it
    parsed.fields = parsed.fields.map((field: any) => ({
      ...field,
      fieldType: field.fieldType || 'dropdown'
    }));

    return parsed;
  } catch (error) {
    throw new Error(`Failed to parse config: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function resetConfig(): void {
  saveConfig(DEFAULT_CONFIG);
}
