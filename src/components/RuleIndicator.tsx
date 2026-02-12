import { AlertCircle } from 'lucide-react';
import { Tooltip } from './Tooltip';
import type { DependencyRule } from '../lib/types';

interface RuleIndicatorProps {
  rule: DependencyRule;
  sourceFieldLabel: string;
}

export function RuleIndicator({ rule, sourceFieldLabel }: RuleIndicatorProps) {
  // Explicação automática caso não haja explicação customizada
  const defaultExplanation = `Este campo está restrito porque ${sourceFieldLabel} está definido como "${rule.sourceValue}"`;

  return (
    <Tooltip content={rule.explanation || defaultExplanation}>
      <div className="flex items-center gap-1 text-xs text-yellow-400 mt-1 cursor-help">
        <AlertCircle className="w-3 h-3" />
        <span>Regra ativa</span>
      </div>
    </Tooltip>
  );
}
