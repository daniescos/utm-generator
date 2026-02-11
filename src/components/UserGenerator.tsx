import { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import { loadConfig } from '../lib/storage';
import { generateUTMUrl, getAvailableOptionsForField, copyToClipboard } from '../lib/utils';

export function UserGenerator() {
  const config = loadConfig();
  const [baseUrl, setBaseUrl] = useState('');
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const sortedFields = useMemo(() => {
    return [...config.fields].sort((a, b) => a.order - b.order);
  }, [config.fields]);

  const generatedUrl = useMemo(() => {
    return generateUTMUrl(baseUrl, selectedValues, config);
  }, [baseUrl, selectedValues, config]);

  const handleCopy = async () => {
    if (generatedUrl && await copyToClipboard(generatedUrl)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setSelectedValues(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg border border-red-900/50 shadow-2xl">
          {/* Header */}
          <div className="border-b border-red-900/50 p-6">
            <h1 className="text-3xl font-bold text-white">UTM Link Generator</h1>
            <p className="text-gray-400 mt-2">Generate properly formatted UTM parameters</p>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Base URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Base URL
              </label>
              <input
                type="url"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-gray-900 border border-red-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
              />
            </div>

            {/* UTM Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                UTM Parameters
              </label>
              <div className="space-y-3">
                {sortedFields.map(field => {
                  const availableOptions = getAvailableOptionsForField(
                    field.id,
                    selectedValues,
                    config
                  );

                  return (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="block text-xs font-medium text-gray-400 mb-1">
                        {field.label}
                      </label>

                      {field.fieldType === 'dropdown' && (
                        <select
                          id={field.id}
                          value={selectedValues[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-full px-4 py-2 bg-gray-900 border border-red-900/50 rounded-lg text-white focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                        >
                          <option value="">Select {field.label}...</option>
                          {availableOptions.map(option => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}

                      {field.fieldType === 'string' && (
                        <input
                          type="text"
                          id={field.id}
                          value={selectedValues[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          placeholder={`Enter ${field.label}...`}
                          className="w-full px-4 py-2 bg-gray-900 border border-red-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                        />
                      )}

                      {field.fieldType === 'integer' && (
                        <input
                          type="number"
                          id={field.id}
                          value={selectedValues[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          placeholder={`Enter ${field.label}...`}
                          step="1"
                          className="w-full px-4 py-2 bg-gray-900 border border-red-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-500/50 transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Generated URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Generated URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={generatedUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-900 border border-red-900/50 rounded-lg text-white font-mono text-sm focus:outline-none"
                />
                <button
                  onClick={handleCopy}
                  disabled={!generatedUrl}
                  className="px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              {copied && (
                <p className="text-green-400 text-sm mt-2">Copied to clipboard!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
