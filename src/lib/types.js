"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONFIG = void 0;
exports.DEFAULT_CONFIG = {
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
