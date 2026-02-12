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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
exports.getStoredConfigVersion = getStoredConfigVersion;
exports.loadConfigAsync = loadConfigAsync;
exports.saveConfig = saveConfig;
exports.exportConfig = exportConfig;
exports.importConfig = importConfig;
exports.resetConfig = resetConfig;
var types_1 = require("./types");
var CONFIG_KEY = 'utm_generator_config';
// Migrate V1 rules: Add targetFieldType if missing
function migrateV1(config) {
    return __assign(__assign({}, config), { dependencies: config.dependencies.map(function (rule) {
            // If targetFieldType doesn't exist, it's an old rule (dropdown → dropdown only)
            if (!rule.targetFieldType) {
                var targetField = config.fields.find(function (f) { return f.id === rule.targetField; });
                var fieldType = (targetField === null || targetField === void 0 ? void 0 : targetField.fieldType) || 'dropdown';
                return __assign(__assign({}, rule), { targetFieldType: (fieldType === 'string' ? 'string' : 'dropdown') });
            }
            return rule;
        }) });
}
// Migrate V2 rules: Add ruleType if missing
function migrateV2(config) {
    return __assign(__assign({}, config), { version: 2, dependencies: config.dependencies.map(function (rule) {
            // If ruleType exists, it's already migrated
            if (rule.ruleType)
                return rule;
            // Detect rule type based on existing structure
            var ruleType;
            if (rule.targetFieldType === 'string' && rule.stringConstraint) {
                ruleType = 'validation';
            }
            else if (rule.allowedValues) {
                ruleType = 'filter';
            }
            else {
                ruleType = 'filter'; // Default
            }
            return __assign(__assign({}, rule), { ruleType: ruleType, sourceCondition: rule.sourceCondition || 'equals', priority: rule.priority !== undefined ? rule.priority : 50 });
        }) });
}
// Migrate dependency rules through all versions
function migrateDependencyRules(config) {
    var migrated = config;
    // V1 migration: Add targetFieldType
    if (!config.version || config.version < 1) {
        migrated = migrateV1(migrated);
    }
    // V2 migration: Add ruleType
    if (!config.version || config.version < 2) {
        migrated = migrateV2(migrated);
    }
    return migrated;
}
// Load global config from public/config.json
function loadGlobalConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var timestamp, response, config, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    timestamp = Date.now();
                    return [4 /*yield*/, fetch("/config.json?t=".concat(timestamp), {
                            cache: 'no-store' // Additional directive to prevent caching
                        })];
                case 1:
                    response = _b.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    config = _b.sent();
                    // Ensure fields have all required properties
                    if (config.fields) {
                        config.fields = config.fields.map(function (field) { return (__assign(__assign({}, field), { fieldType: field.fieldType || 'dropdown', description: field.description !== undefined ? field.description : undefined })); });
                    }
                    return [2 /*return*/, config];
                case 3: return [3 /*break*/, 5];
                case 4:
                    _a = _b.sent();
                    console.error('Failed to load global config from public/config.json');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, null];
            }
        });
    });
}
// Load config with priority: localStorage > global config > defaults
function loadConfig() {
    try {
        // First, check localStorage
        var stored = localStorage.getItem(CONFIG_KEY);
        if (stored) {
            var parsed = JSON.parse(stored);
            // Migration: Add fieldType to fields without it
            if (parsed.fields) {
                parsed.fields = parsed.fields.map(function (field) { return (__assign(__assign({}, field), { fieldType: field.fieldType || 'dropdown', description: field.description !== undefined ? field.description : undefined })); });
            }
            // Migration: Add targetFieldType to dependency rules
            parsed = migrateDependencyRules(parsed);
            return parsed;
        }
        return types_1.DEFAULT_CONFIG;
    }
    catch (_a) {
        console.error('Failed to load config from storage');
        return types_1.DEFAULT_CONFIG;
    }
}
// Get the stored config version
function getStoredConfigVersion() {
    try {
        var stored = localStorage.getItem(CONFIG_KEY);
        if (stored) {
            var parsed = JSON.parse(stored);
            return parsed.version || 0;
        }
    }
    catch (_a) {
        return 0;
    }
    return 0;
}
// Async version: Load from global config, using localStorage only if version matches
function loadConfigAsync() {
    return __awaiter(this, void 0, void 0, function () {
        var globalConfig, storedVersion, stored, parsedConfig;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadGlobalConfig()];
                case 1:
                    globalConfig = _a.sent();
                    if (globalConfig) {
                        // Migration: Add targetFieldType to dependency rules
                        globalConfig = migrateDependencyRules(globalConfig);
                        storedVersion = getStoredConfigVersion();
                        // If versions match, user can have custom changes in localStorage
                        if (storedVersion === globalConfig.version) {
                            stored = localStorage.getItem(CONFIG_KEY);
                            if (stored) {
                                try {
                                    parsedConfig = JSON.parse(stored);
                                    parsedConfig = migrateDependencyRules(parsedConfig);
                                    return [2 /*return*/, parsedConfig];
                                }
                                catch (_b) {
                                    return [2 /*return*/, globalConfig];
                                }
                            }
                        }
                        else {
                            // Version mismatch - admin updated config, use global and update localStorage
                            saveConfig(globalConfig);
                        }
                        return [2 /*return*/, globalConfig];
                    }
                    // Fallback to synchronous load
                    return [2 /*return*/, loadConfig()];
            }
        });
    });
}
function saveConfig(config) {
    try {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    }
    catch (_a) {
        console.error('Failed to save config to storage');
    }
}
function exportConfig() {
    var config = loadConfig();
    return JSON.stringify(config, null, 2);
}
function importConfig(jsonString) {
    try {
        var parsed = JSON.parse(jsonString);
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
        parsed.fields = parsed.fields.map(function (field) { return (__assign(__assign({}, field), { fieldType: field.fieldType || 'dropdown' })); });
        // Migration: Add targetFieldType to dependency rules
        parsed = migrateDependencyRules(parsed);
        return parsed;
    }
    catch (error) {
        throw new Error("Failed to parse config: ".concat(error instanceof Error ? error.message : 'Unknown error'));
    }
}
function resetConfig() {
    saveConfig(types_1.DEFAULT_CONFIG);
}
