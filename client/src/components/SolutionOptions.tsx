import { Check, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SolutionOption } from "@shared/schema";

interface SolutionOptionsProps {
  options: SolutionOption[];
  onSelect: (optionId: string) => void;
}

export default function SolutionOptions({
  options,
  onSelect,
}: SolutionOptionsProps) {
  const complexityColors = {
    simple: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    moderate: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
    advanced: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
  };

  const complexityLabels = {
    simple: "ساده",
    moderate: "متوسط",
    advanced: "پیشرفته",
  };

  return (
    <div className="space-y-4 my-6" data-testid="solution-options-container">
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <Sparkles className="w-5 h-5 text-purple-500" />
        <span className="font-semibold">چند راه‌حل برای شما:</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map((option, index) => (
          <div
            key={option.id}
            className="glass-card p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all group"
            data-testid={`solution-card-${option.id}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white" data-testid={`text-title-${option.id}`}>
                  {option.title}
                </h3>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${complexityColors[option.complexity]}`}
                data-testid={`badge-complexity-${option.id}`}
              >
                {complexityLabels[option.complexity]}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4" data-testid={`text-description-${option.id}`}>
              {option.description}
            </p>

            <div className="space-y-3 mb-4">
              {option.pros.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">
                    ✓ مزایا:
                  </div>
                  <ul className="space-y-1" data-testid={`list-pros-${option.id}`}>
                    {option.pros.map((pro, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1"
                      >
                        <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {option.cons.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">
                    ✗ معایب:
                  </div>
                  <ul className="space-y-1" data-testid={`list-cons-${option.id}`}>
                    {option.cons.map((con, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1"
                      >
                        <span className="text-red-500 mt-0.5 flex-shrink-0">×</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Button
              onClick={() => onSelect(option.id)}
              className="w-full group-hover:bg-purple-600 group-hover:text-white transition-all"
              variant="outline"
              data-testid={`button-select-${option.id}`}
            >
              <span>انتخاب این راه‌حل</span>
              <ChevronRight className="w-4 h-4 mr-2" />
            </Button>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        یکی از راه‌حل‌ها را انتخاب کنید تا کد مربوطه تولید شود
      </div>
    </div>
  );
}
