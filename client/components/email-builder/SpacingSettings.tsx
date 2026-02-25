import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { HelpCircle, PanelTop, PanelBottom, PanelLeft, PanelRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SpacingSettingsProps {
  label: string;
  values: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  onChange: (values: { top: number; right: number; bottom: number; left: number }) => void;
  tooltip?: string;
}

export const SpacingSettings: React.FC<SpacingSettingsProps> = ({
  label,
  values,
  onChange,
  tooltip,
}) => {
  const [isGrouped, setIsGrouped] = React.useState(false);

  const handleChange = (side: keyof typeof values, value: number) => {
    if (isGrouped) {
      onChange({
        top: value,
        right: value,
        bottom: value,
        left: value,
      });
    } else {
      onChange({
        ...values,
        [side]: value,
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Label className="text-xs font-semibold text-gray-700">{label}</Label>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor={`group-${label}`} className="text-[10px] text-gray-500 cursor-pointer">
            Group sides
          </Label>
          <Checkbox
            id={`group-${label}`}
            checked={isGrouped}
            onCheckedChange={(checked) => setIsGrouped(!!checked)}
            className="w-3.5 h-3.5"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {/* Top */}
        <div className="flex items-center gap-2 bg-gray-50/50 rounded-md px-2 py-1.5 border border-gray-100">
          <PanelTop className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <div className="flex items-center flex-1">
            <input
              type="number"
              value={values.top}
              onChange={(e) => handleChange("top", parseInt(e.target.value) || 0)}
              className="w-full bg-transparent text-xs focus:outline-none"
            />
            <span className="text-[10px] text-gray-400 ml-1">px</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => handleChange("top", values.top + 1)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg width="6" height="4" viewBox="0 0 6 4" fill="none"><path d="M1 3L3 1L5 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button
              type="button"
              onClick={() => handleChange("top", Math.max(0, values.top - 1))}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg width="6" height="4" viewBox="0 0 6 4" fill="none"><path d="M1 1L3 3L5 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex items-center gap-2 bg-gray-50/50 rounded-md px-2 py-1.5 border border-gray-100">
          <PanelBottom className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <div className="flex items-center flex-1">
            <input
              type="number"
              value={values.bottom}
              onChange={(e) => handleChange("bottom", parseInt(e.target.value) || 0)}
              className="w-full bg-transparent text-xs focus:outline-none"
            />
            <span className="text-[10px] text-gray-400 ml-1">px</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => handleChange("bottom", values.bottom + 1)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg width="6" height="4" viewBox="0 0 6 4" fill="none"><path d="M1 3L3 1L5 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button
              type="button"
              onClick={() => handleChange("bottom", Math.max(0, values.bottom - 1))}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg width="6" height="4" viewBox="0 0 6 4" fill="none"><path d="M1 1L3 3L5 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>

        {/* Left */}
        <div className="flex items-center gap-2 bg-gray-50/50 rounded-md px-2 py-1.5 border border-gray-100">
          <PanelLeft className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <div className="flex items-center flex-1">
            <input
              type="number"
              value={values.left}
              onChange={(e) => handleChange("left", parseInt(e.target.value) || 0)}
              className="w-full bg-transparent text-xs focus:outline-none"
            />
            <span className="text-[10px] text-gray-400 ml-1">px</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => handleChange("left", values.left + 1)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg width="6" height="4" viewBox="0 0 6 4" fill="none"><path d="M1 3L3 1L5 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button
              type="button"
              onClick={() => handleChange("left", Math.max(0, values.left - 1))}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg width="6" height="4" viewBox="0 0 6 4" fill="none"><path d="M1 1L3 3L5 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 bg-gray-50/50 rounded-md px-2 py-1.5 border border-gray-100">
          <PanelRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <div className="flex items-center flex-1">
            <input
              type="number"
              value={values.right}
              onChange={(e) => handleChange("right", parseInt(e.target.value) || 0)}
              className="w-full bg-transparent text-xs focus:outline-none"
            />
            <span className="text-[10px] text-gray-400 ml-1">px</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => handleChange("right", values.right + 1)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg width="6" height="4" viewBox="0 0 6 4" fill="none"><path d="M1 3L3 1L5 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button
              type="button"
              onClick={() => handleChange("right", Math.max(0, values.right - 1))}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg width="6" height="4" viewBox="0 0 6 4" fill="none"><path d="M1 1L3 3L5 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
