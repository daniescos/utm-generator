import type { AppConfig } from './types';
import { DEFAULT_CONFIG } from './types';

const CONFIG_KEY = 'utm_generator_config';

export function loadConfig(): AppConfig {
  try {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (!stored) {
      return DEFAULT_CONFIG;
    }
    const parsed = JSON.parse(stored);

    // Migration: Add fieldType to fields without it
    if (parsed.fields) {
      parsed.fields = parsed.fields.map((field: any) => ({
        ...field,
        fieldType: field.fieldType || 'dropdown',
        // Migration: Add description field if it doesn't exist
        description: field.description !== undefined ? field.description : undefined
      }));
    }

    return parsed;
  } catch {
    console.error('Failed to load config from storage');
    return DEFAULT_CONFIG;
  }
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
