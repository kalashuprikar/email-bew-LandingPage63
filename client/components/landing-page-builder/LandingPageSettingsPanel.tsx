import React, { useState, useEffect } from "react";
import { LandingPageBlock } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Copy } from "lucide-react";
import { EditableLink } from "./EditableLink";

interface LandingPageSettingsPanelProps {
  block: LandingPageBlock | null;
  onBlockUpdate: (blockId: string, properties: Record<string, any>) => void;
  onBlockDelete?: () => void;
  blockId?: string;
  selectedElement?: "heading" | "subheading" | "button" | null;
  onElementSelect?: (element: "heading" | "subheading" | "button" | null) => void;
  selectedLinkIndex?: number | null;
  selectedLinkType?: "navigation" | "quick" | null;
  onLinkSelect?: (index: number | null, type: "navigation" | "quick" | null) => void;
}

export const LandingPageSettingsPanel: React.FC<
  LandingPageSettingsPanelProps
> = ({
  block,
  onBlockUpdate,
  onBlockDelete,
  blockId,
  selectedElement,
  onElementSelect,
  selectedLinkIndex,
  selectedLinkType,
  onLinkSelect
}) => {
  const [localProps, setLocalProps] = useState(block?.properties || {});
  const [headlineWidthUnit, setHeadlineWidthUnit] = useState<"%" | "px">(String(block?.properties?.headlineWidth || "100%").includes("%") ? "%" : "px");
  const [headlineHeightUnit, setHeadlineHeightUnit] = useState<"%" | "px">(String(block?.properties?.headlineHeight || "auto").includes("%") ? "%" : "px");
  const [subheadingWidthUnit, setSubheadingWidthUnit] = useState<"%" | "px">(String(block?.properties?.subheadingWidth || "100%").includes("%") ? "%" : "px");
  const [subheadingHeightUnit, setSubheadingHeightUnit] = useState<"%" | "px">(String(block?.properties?.subheadingHeight || "auto").includes("%") ? "%" : "px");
  const [buttonWidthUnit, setButtonWidthUnit] = useState<"%" | "px">(String(block?.properties?.ctaButtonWidth || "auto").includes("%") ? "%" : "px");
  const [buttonHeightUnit, setButtonHeightUnit] = useState<"%" | "px">(String(block?.properties?.ctaButtonHeight || "auto").includes("%") ? "%" : "px");

  useEffect(() => {
    if (block) {
      setLocalProps(block.properties);
      setHeadlineWidthUnit(String(block.properties?.headlineWidth || "100%").includes("%") ? "%" : "px");
      setHeadlineHeightUnit(String(block.properties?.headlineHeight || "auto").includes("%") ? "%" : "px");
      setSubheadingWidthUnit(String(block.properties?.subheadingWidth || "100%").includes("%") ? "%" : "px");
      setSubheadingHeightUnit(String(block.properties?.subheadingHeight || "auto").includes("%") ? "%" : "px");
      setButtonWidthUnit(String(block.properties?.ctaButtonWidth || "auto").includes("%") ? "%" : "px");
      setButtonHeightUnit(String(block.properties?.ctaButtonHeight || "auto").includes("%") ? "%" : "px");
    }
  }, [block?.id]);

  const updateProperty = (key: string, value: any) => {
    const updated = { ...localProps, [key]: value };
    setLocalProps(updated);
    if (blockId) {
      onBlockUpdate(blockId, updated);
    }
  };

  const handleSizeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    key: string,
    currentValue: string
  ) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const value = currentValue || "0px";
      const match = value.match(/^(\d+(?:\.\d+)?)(.*)/);

      if (match) {
        const num = parseFloat(match[1]);
        const unit = match[2] || "px";
        const step = unit === "%" ? 5 : 10;
        const newNum = e.key === "ArrowUp" ? num + step : Math.max(0, num - step);
        updateProperty(key, `${newNum}${unit}`);
      }
    }
  };

  const toggleUnit = (key: string, currentValue: string, fromUnit: string, toUnit: string) => {
    const match = currentValue.match(/^(\d+(?:\.\d+)?)(.*)/);
    if (match) {
      const num = parseFloat(match[1]);
      updateProperty(key, `${num}${toUnit}`);
    } else {
      updateProperty(key, `100${toUnit}`);
    }
  };

  // Show element-specific styling UI if an element is selected
  if (selectedElement && block && block.type === "hero") {
    const elementLabels = {
      heading: "Headline",
      subheading: "Subheading",
      button: "CTA Button",
    };

    return (
      <div className="bg-white border-l border-gray-200 h-full overflow-y-auto flex flex-col">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
          <button
            onClick={() => onElementSelect?.(null)}
            className="text-xs text-valasys-orange hover:text-orange-700 font-medium mb-2 inline-flex items-center gap-1"
          >
            ← Back to Block
          </button>
          <h3 className="font-semibold text-gray-900 text-sm">
            {elementLabels[selectedElement]} Sizing & Styling
          </h3>
        </div>

        <div className="flex-1 p-4">
          <div className="space-y-4">
            {selectedElement === "heading" && (
              <>
                <div>
                  <Label className="text-sm font-medium">Headline Text</Label>
                  <textarea
                    value={localProps.headline || ""}
                    onChange={(e) => updateProperty("headline", e.target.value)}
                    placeholder="Enter headline text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Headline Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={localProps.headlineColor || "#1f2937"}
                      onChange={(e) => updateProperty("headlineColor", e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={localProps.headlineColor || "#1f2937"}
                      onChange={(e) => updateProperty("headlineColor", e.target.value)}
                      placeholder="#1f2937"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <Label className="text-sm font-medium block mb-3">Size & Spacing</Label>
                  <div>
                    <Label className="text-xs text-gray-600 mb-1 block">Width</Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={String(localProps.headlineWidth || "100%").replace(/[^0-9]/g, "")}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const numericOnly = inputValue.replace(/[^0-9]/g, "");
                          if (numericOnly === "") {
                            updateProperty("headlineWidth", `100${headlineWidthUnit}`);
                            return;
                          }
                          const num = parseInt(numericOnly, 10);
                          if (headlineWidthUnit === "%" && num > 100) {
                            return;
                          }
                          updateProperty("headlineWidth", `${num}${headlineWidthUnit}`);
                        }}
                        onKeyDown={(e) => handleSizeKeyDown(e, "headlineWidth", String(localProps.headlineWidth || "100%"))}
                        placeholder="100"
                        className="flex-1"
                      />
                      <select
                        value={headlineWidthUnit}
                        onChange={(e) => {
                          const newUnit = e.target.value as "%" | "px";
                          const currentNum = parseInt(String(localProps.headlineWidth || "100").replace(/[^0-9]/g, ""), 10) || 100;
                          setHeadlineWidthUnit(newUnit);
                          if (newUnit === "%") {
                            const cappedNum = Math.min(currentNum, 100);
                            updateProperty("headlineWidth", `${cappedNum}${newUnit}`);
                          } else {
                            updateProperty("headlineWidth", `${currentNum}${newUnit}`);
                          }
                        }}
                        className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                      >
                        <option value="%">%</option>
                        <option value="px">px</option>
                      </select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateProperty("headlineWidth", "0px")}
                        className="px-3"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label className="text-xs text-gray-600 mb-1 block">Height</Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={String(localProps.headlineHeight || "auto").replace(/[^0-9]/g, "")}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const numericOnly = inputValue.replace(/[^0-9]/g, "");
                          if (numericOnly === "") {
                            updateProperty("headlineHeight", "auto");
                            return;
                          }
                          const num = parseInt(numericOnly, 10);
                          if (headlineHeightUnit === "%" && num > 100) {
                            return;
                          }
                          updateProperty("headlineHeight", `${num}${headlineHeightUnit}`);
                        }}
                        onKeyDown={(e) => handleSizeKeyDown(e, "headlineHeight", String(localProps.headlineHeight || "auto"))}
                        placeholder="auto or number"
                        className="flex-1"
                      />
                      <select
                        value={headlineHeightUnit}
                        onChange={(e) => {
                          const newUnit = e.target.value as "%" | "px";
                          const currentNum = parseInt(String(localProps.headlineHeight || "100").replace(/[^0-9]/g, ""), 10) || 100;
                          setHeadlineHeightUnit(newUnit);
                          if (newUnit === "%") {
                            const cappedNum = Math.min(currentNum, 100);
                            updateProperty("headlineHeight", `${cappedNum}${newUnit}`);
                          } else {
                            updateProperty("headlineHeight", `${currentNum}${newUnit}`);
                          }
                        }}
                        className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                      >
                        <option value="%">%</option>
                        <option value="px">px</option>
                      </select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateProperty("headlineHeight", "0px")}
                        className="px-3"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
            {selectedElement === "subheading" && (
              <>
                <div>
                  <Label className="text-sm font-medium">Subheading Text</Label>
                  <textarea
                    value={localProps.subheading || ""}
                    onChange={(e) => updateProperty("subheading", e.target.value)}
                    placeholder="Enter subheading text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Subheading Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={localProps.subheadingColor || "#4b5563"}
                      onChange={(e) => updateProperty("subheadingColor", e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={localProps.subheadingColor || "#4b5563"}
                      onChange={(e) => updateProperty("subheadingColor", e.target.value)}
                      placeholder="#4b5563"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <Label className="text-sm font-medium block mb-3">Size & Spacing</Label>
                  <div>
                    <Label className="text-xs text-gray-600 mb-1 block">Width</Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={String(localProps.subheadingWidth || "100%").replace(/[^0-9]/g, "")}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const numericOnly = inputValue.replace(/[^0-9]/g, "");
                          if (numericOnly === "") {
                            updateProperty("subheadingWidth", `100${subheadingWidthUnit}`);
                            return;
                          }
                          const num = parseInt(numericOnly, 10);
                          if (subheadingWidthUnit === "%" && num > 100) {
                            return;
                          }
                          updateProperty("subheadingWidth", `${num}${subheadingWidthUnit}`);
                        }}
                        onKeyDown={(e) => handleSizeKeyDown(e, "subheadingWidth", String(localProps.subheadingWidth || "100%"))}
                        placeholder="100"
                        className="flex-1"
                      />
                      <select
                        value={subheadingWidthUnit}
                        onChange={(e) => {
                          const newUnit = e.target.value as "%" | "px";
                          const currentNum = parseInt(String(localProps.subheadingWidth || "100").replace(/[^0-9]/g, ""), 10) || 100;
                          setSubheadingWidthUnit(newUnit);
                          if (newUnit === "%") {
                            const cappedNum = Math.min(currentNum, 100);
                            updateProperty("subheadingWidth", `${cappedNum}${newUnit}`);
                          } else {
                            updateProperty("subheadingWidth", `${currentNum}${newUnit}`);
                          }
                        }}
                        className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                      >
                        <option value="%">%</option>
                        <option value="px">px</option>
                      </select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateProperty("subheadingWidth", "0px")}
                        className="px-3"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label className="text-xs text-gray-600 mb-1 block">Height</Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={String(localProps.subheadingHeight || "auto").replace(/[^0-9]/g, "")}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const numericOnly = inputValue.replace(/[^0-9]/g, "");
                          if (numericOnly === "") {
                            updateProperty("subheadingHeight", "auto");
                            return;
                          }
                          const num = parseInt(numericOnly, 10);
                          if (subheadingHeightUnit === "%" && num > 100) {
                            return;
                          }
                          updateProperty("subheadingHeight", `${num}${subheadingHeightUnit}`);
                        }}
                        onKeyDown={(e) => handleSizeKeyDown(e, "subheadingHeight", String(localProps.subheadingHeight || "auto"))}
                        placeholder="auto or number"
                        className="flex-1"
                      />
                      <select
                        value={subheadingHeightUnit}
                        onChange={(e) => {
                          const newUnit = e.target.value as "%" | "px";
                          const currentNum = parseInt(String(localProps.subheadingHeight || "100").replace(/[^0-9]/g, ""), 10) || 100;
                          setSubheadingHeightUnit(newUnit);
                          if (newUnit === "%") {
                            const cappedNum = Math.min(currentNum, 100);
                            updateProperty("subheadingHeight", `${cappedNum}${newUnit}`);
                          } else {
                            updateProperty("subheadingHeight", `${currentNum}${newUnit}`);
                          }
                        }}
                        className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                      >
                        <option value="%">%</option>
                        <option value="px">px</option>
                      </select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateProperty("subheadingHeight", "0px")}
                        className="px-3"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
            {selectedElement === "button" && (
              <>
                <div>
                  <Label className="text-sm font-medium">Button Text</Label>
                  <Input
                    value={localProps.ctaButtonText || ""}
                    onChange={(e) => updateProperty("ctaButtonText", e.target.value)}
                    placeholder="Enter button text"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Button Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={localProps.ctaButtonColor || "#FF6A00"}
                      onChange={(e) => updateProperty("ctaButtonColor", e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={localProps.ctaButtonColor || "#FF6A00"}
                      onChange={(e) => updateProperty("ctaButtonColor", e.target.value)}
                      placeholder="#FF6A00"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Button Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={localProps.ctaButtonTextColor || "#ffffff"}
                      onChange={(e) => updateProperty("ctaButtonTextColor", e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={localProps.ctaButtonTextColor || "#ffffff"}
                      onChange={(e) => updateProperty("ctaButtonTextColor", e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <Label className="text-sm font-medium block mb-3">Size & Spacing</Label>
                  <div>
                    <Label className="text-xs text-gray-600 mb-1 block">Width</Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={String(localProps.ctaButtonWidth || "auto").replace(/[^0-9]/g, "")}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const numericOnly = inputValue.replace(/[^0-9]/g, "");
                          if (numericOnly === "") {
                            updateProperty("ctaButtonWidth", "auto");
                            return;
                          }
                          updateProperty("ctaButtonWidth", `${numericOnly}px`);
                        }}
                        onKeyDown={(e) => handleSizeKeyDown(e, "ctaButtonWidth", String(localProps.ctaButtonWidth || "auto"))}
                        placeholder="auto or number"
                        className="flex-1"
                      />
                      <div className="px-3 py-2 border border-input rounded-md bg-background text-sm flex items-center text-gray-500">
                        px
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateProperty("ctaButtonWidth", "0px")}
                        className="px-3"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label className="text-xs text-gray-600 mb-1 block">Height</Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={String(localProps.ctaButtonHeight || "auto").replace(/[^0-9]/g, "")}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const numericOnly = inputValue.replace(/[^0-9]/g, "");
                          if (numericOnly === "") {
                            updateProperty("ctaButtonHeight", "auto");
                            return;
                          }
                          const num = parseInt(numericOnly, 10);
                          if (buttonHeightUnit === "%" && num > 100) {
                            return;
                          }
                          updateProperty("ctaButtonHeight", `${num}${buttonHeightUnit}`);
                        }}
                        onKeyDown={(e) => handleSizeKeyDown(e, "ctaButtonHeight", String(localProps.ctaButtonHeight || "auto"))}
                        placeholder="auto or number"
                        className="flex-1"
                      />
                      <select
                        value={buttonHeightUnit}
                        onChange={(e) => {
                          const newUnit = e.target.value as "%" | "px";
                          const currentNum = parseInt(String(localProps.ctaButtonHeight || "100").replace(/[^0-9]/g, ""), 10) || 100;
                          setButtonHeightUnit(newUnit);
                          if (newUnit === "%") {
                            const cappedNum = Math.min(currentNum, 100);
                            updateProperty("ctaButtonHeight", `${cappedNum}${newUnit}`);
                          } else {
                            updateProperty("ctaButtonHeight", `${currentNum}${newUnit}`);
                          }
                        }}
                        className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                      >
                        <option value="%">%</option>
                        <option value="px">px</option>
                      </select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateProperty("ctaButtonHeight", "0px")}
                        className="px-3"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show link editing UI if a link is selected
  if (selectedLinkIndex !== null && selectedLinkType && block) {
    const links = selectedLinkType === "navigation"
      ? (localProps.navigationLinks || [])
      : (localProps.quickLinks || []);

    const link = links[selectedLinkIndex];

    if (link) {
      return (
        <div className="bg-white border-l border-gray-200 h-full overflow-y-auto flex flex-col">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
            <button
              onClick={() => onLinkSelect?.(null, null)}
              className="text-sm text-gray-600 hover:text-gray-900 mb-2"
            >
              ← Back to block
            </button>
            <h3 className="font-semibold text-gray-900">Edit Link</h3>
          </div>

          <div className="flex-1 p-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Link Text</Label>
                <Input
                  value={link.label}
                  onChange={(e) => {
                    const updated = [...links];
                    updated[selectedLinkIndex] = { ...link, label: e.target.value };
                    const key = selectedLinkType === "navigation" ? "navigationLinks" : "quickLinks";
                    updateProperty(key, updated);
                  }}
                  placeholder="Link text"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">URL</Label>
                <Input
                  value={link.href}
                  onChange={(e) => {
                    const updated = [...links];
                    updated[selectedLinkIndex] = { ...link, href: e.target.value };
                    const key = selectedLinkType === "navigation" ? "navigationLinks" : "quickLinks";
                    updateProperty(key, updated);
                  }}
                  placeholder="URL"
                />
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => {
                const updated = links.filter((_: any, i: number) => i !== selectedLinkIndex);
                const key = selectedLinkType === "navigation" ? "navigationLinks" : "quickLinks";
                updateProperty(key, updated);
                onLinkSelect?.(null, null);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Link
            </Button>
          </div>
        </div>
      );
    }
  }

  if (!block) {
    return (
      <div className="bg-white border-l border-gray-200 p-6 h-full flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-900 text-sm font-semibold">Select a Block</p>
          <p className="text-gray-500 text-xs leading-relaxed">
            Click on any block in the center to select it and edit its properties.
          </p>
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <p className="text-gray-700 text-xs font-medium">For Hero Blocks:</p>
            <ul className="text-gray-500 text-xs space-y-1">
              <li>• Click block background to edit settings</li>
              <li>• Click headline/subheading text to size them</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const updateNestedProperty = (
    parentKey: string,
    childKey: string,
    value: any,
  ) => {
    const updated = {
      ...localProps,
      [parentKey]: {
        ...(localProps[parentKey] || {}),
        [childKey]: value,
      },
    };
    setLocalProps(updated);
    if (blockId) {
      onBlockUpdate(blockId, updated);
    }
  };

  const renderHeaderBlockSettings = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Background Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.backgroundColor || "#ffffff"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.backgroundColor || "#ffffff"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Width</Label>
        <Input
          value={localProps.width || "100%"}
          onChange={(e) => updateProperty("width", e.target.value)}
          placeholder="100% or 1200px"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Logo Text</Label>
        <Input
          value={localProps.logoText || ""}
          onChange={(e) => updateProperty("logoText", e.target.value)}
          placeholder="Logo text"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Logo Image URL</Label>
        <Input
          value={localProps.logoUrl || ""}
          onChange={(e) => updateProperty("logoUrl", e.target.value)}
          placeholder="Image URL"
        />
        {localProps.logoUrl && (
          <div className="mt-2 rounded border border-gray-200 p-2">
            <img
              src={localProps.logoUrl}
              alt="Logo preview"
              className="max-h-12 object-contain"
            />
          </div>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">
          Navigation Links
        </Label>
        <div className="space-y-2">
          {localProps.navigationLinks?.map(
            (link: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1">
                  <EditableLink
                    label={link.label}
                    href={link.href}
                    onUpdate={(label, href) => {
                      const updated = [...(localProps.navigationLinks || [])];
                      updated[index] = { label, href };
                      updateProperty("navigationLinks", updated);
                    }}
                    onDelete={() => {
                      const updated = (localProps.navigationLinks || []).filter(
                        (_: any, i: number) => i !== index,
                      );
                      updateProperty("navigationLinks", updated);
                    }}
                  />
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                  title="Copy link"
                  onClick={() => {
                    const updated = [...(localProps.navigationLinks || [])];
                    updated.splice(index + 1, 0, { ...link });
                    updateProperty("navigationLinks", updated);
                  }}
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                  title="Delete link"
                  onClick={() => {
                    const updated = (localProps.navigationLinks || []).filter(
                      (_: any, i: number) => i !== index,
                    );
                    updateProperty("navigationLinks", updated);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ),
          )}
        </div>
        <Button
          size="sm"
          variant="outline"
          className="mt-2 w-full"
          onClick={() => {
            const updated = [...(localProps.navigationLinks || [])];
            updated.push({ label: "New Link", href: "#" });
            updateProperty("navigationLinks", updated);
          }}
        >
          + Add Link
        </Button>
      </div>

      <div>
        <Label className="text-sm font-medium">CTA Button Text</Label>
        <Input
          value={localProps.ctaButtonText || ""}
          onChange={(e) => updateProperty("ctaButtonText", e.target.value)}
          placeholder="Button text"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">CTA Button Link</Label>
        <Input
          value={localProps.ctaButtonLink || ""}
          onChange={(e) => updateProperty("ctaButtonLink", e.target.value)}
          placeholder="Button URL"
        />
      </div>
    </div>
  );

  const renderHeroBlockSettings = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Headline</Label>
        <Input
          value={localProps.headline || ""}
          onChange={(e) => updateProperty("headline", e.target.value)}
          placeholder="Headline text"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Subheading</Label>
        <Input
          value={localProps.subheading || ""}
          onChange={(e) => updateProperty("subheading", e.target.value)}
          placeholder="Subheading text"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Background Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.backgroundColor || "#f3f4f6"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.backgroundColor || "#f3f4f6"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            placeholder="#f3f4f6"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Width</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={String(localProps.width || "100%").replace(/[^0-9]/g, "")}
            onChange={(e) => {
              const unit = String(localProps.width || "100%").includes("%") ? "%" : "px";
              const inputValue = e.target.value;

              // Only accept numeric input
              const numericOnly = inputValue.replace(/[^0-9]/g, "");

              if (numericOnly === "") {
                updateProperty("width", "100%"); // Reset to default
                return;
              }

              const num = parseInt(numericOnly, 10);

              // For percentage: only allow up to 100
              if (unit === "%") {
                if (num > 100) {
                  return;
                }
              }

              updateProperty("width", `${num}${unit}`);
            }}
            placeholder="100"
            className="flex-1"
          />
          <select
            value={String(localProps.width || "100%").includes("%") ? "%" : "px"}
            onChange={(e) => {
              const currentNum = parseInt(String(localProps.width || "100").replace(/[^0-9]/g, ""), 10) || 100;
              const unit = e.target.value;

              // When switching TO percentage, cap at 100
              if (unit === "%") {
                const cappedNum = Math.min(currentNum, 100);
                updateProperty("width", `${cappedNum}${unit}`);
              } else {
                updateProperty("width", `${currentNum}${unit}`);
              }
            }}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="%">%</option>
            <option value="px">px</option>
          </select>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Min Height</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={String(localProps.minHeight || "500px").replace(/[^0-9]/g, "")}
            onChange={(e) => {
              const inputValue = e.target.value;

              // Only accept numeric input
              const numericOnly = inputValue.replace(/[^0-9]/g, "");

              if (numericOnly === "") {
                updateProperty("minHeight", "500px"); // Reset to default
                return;
              }

              updateProperty("minHeight", `${numericOnly}px`);
            }}
            onKeyDown={(e) => handleSizeKeyDown(e, "minHeight", String(localProps.minHeight || "500px"))}
            placeholder="500"
            className="flex-1"
          />
          <div className="px-3 py-2 border border-input rounded-md bg-background text-sm flex items-center text-gray-500">
            px
          </div>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">CTA Button Text</Label>
        <Input
          value={localProps.ctaButtonText || ""}
          onChange={(e) => updateProperty("ctaButtonText", e.target.value)}
          placeholder="Button text"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">CTA Button Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.ctaButtonColor || "#FF6A00"}
            onChange={(e) => updateProperty("ctaButtonColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.ctaButtonColor || "#FF6A00"}
            onChange={(e) => updateProperty("ctaButtonColor", e.target.value)}
            placeholder="#FF6A00"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Headline Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.headlineColor || "#1f2937"}
            onChange={(e) => updateProperty("headlineColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.headlineColor || "#1f2937"}
            onChange={(e) => updateProperty("headlineColor", e.target.value)}
            placeholder="#1f2937"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Subheading Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.subheadingColor || "#4b5563"}
            onChange={(e) => updateProperty("subheadingColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.subheadingColor || "#4b5563"}
            onChange={(e) => updateProperty("subheadingColor", e.target.value)}
            placeholder="#4b5563"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Button Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.ctaButtonTextColor || "#ffffff"}
            onChange={(e) => updateProperty("ctaButtonTextColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.ctaButtonTextColor || "#ffffff"}
            onChange={(e) => updateProperty("ctaButtonTextColor", e.target.value)}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Background Image URL</Label>
        <Input
          value={localProps.backgroundImage || ""}
          onChange={(e) => updateProperty("backgroundImage", e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
        {localProps.backgroundImage && (
          <div className="mt-2 text-xs text-gray-600">
            <div
              className="w-full h-20 rounded border border-gray-300 bg-cover bg-center mt-1"
              style={{ backgroundImage: `url(${localProps.backgroundImage})` }}
            />
          </div>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium">Overlay Opacity (0-100)</Label>
        <Input
          type="number"
          min="0"
          max="100"
          value={localProps.overlayOpacity || 0}
          onChange={(e) => updateProperty("overlayOpacity", parseInt(e.target.value))}
          placeholder="0"
        />
        <p className="text-xs text-gray-500 mt-1">
          Use overlay to make text more readable over the background image
        </p>
      </div>
    </div>
  );

  const renderFeaturesBlockSettings = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Heading</Label>
        <Input
          value={localProps.heading || ""}
          onChange={(e) => updateProperty("heading", e.target.value)}
          placeholder="Section heading"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Description</Label>
        <Input
          value={localProps.description || ""}
          onChange={(e) => updateProperty("description", e.target.value)}
          placeholder="Section description"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Background Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.backgroundColor || "#ffffff"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.backgroundColor || "#ffffff"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Width</Label>
        <Input
          value={localProps.width || "100%"}
          onChange={(e) => updateProperty("width", e.target.value)}
          placeholder="100% or 1200px"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Columns</Label>
        <Input
          type="number"
          value={localProps.columns || 4}
          onChange={(e) =>
            updateProperty("columns", parseInt(e.target.value))
          }
          min="1"
          max="6"
        />
      </div>
    </div>
  );

  const renderFooterBlockSettings = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Company Name</Label>
        <Input
          value={localProps.companyName || ""}
          onChange={(e) => updateProperty("companyName", e.target.value)}
          placeholder="Company name"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Description</Label>
        <Input
          value={localProps.companyDescription || ""}
          onChange={(e) =>
            updateProperty("companyDescription", e.target.value)
          }
          placeholder="Company description"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Email</Label>
        <Input
          value={localProps.contactInfo?.email || ""}
          onChange={(e) =>
            updateNestedProperty("contactInfo", "email", e.target.value)
          }
          placeholder="Email address"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Phone</Label>
        <Input
          value={localProps.contactInfo?.phone || ""}
          onChange={(e) =>
            updateNestedProperty("contactInfo", "phone", e.target.value)
          }
          placeholder="Phone number"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Background Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.backgroundColor || "#1f2937"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.backgroundColor || "#1f2937"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            placeholder="#1f2937"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Width</Label>
        <Input
          value={localProps.width || "100%"}
          onChange={(e) => updateProperty("width", e.target.value)}
          placeholder="100% or 1200px"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.textColor || "#ffffff"}
            onChange={(e) => updateProperty("textColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.textColor || "#ffffff"}
            onChange={(e) => updateProperty("textColor", e.target.value)}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Quick Links</Label>
        <div className="space-y-2">
          {localProps.quickLinks?.map((link: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1">
                <EditableLink
                  label={link.label}
                  href={link.href}
                  onUpdate={(label, href) => {
                    const updated = [...(localProps.quickLinks || [])];
                    updated[index] = { label, href };
                    updateProperty("quickLinks", updated);
                  }}
                  onDelete={() => {
                    const updated = (localProps.quickLinks || []).filter(
                      (_: any, i: number) => i !== index,
                    );
                    updateProperty("quickLinks", updated);
                  }}
                />
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                title="Copy link"
                onClick={() => {
                  const updated = [...(localProps.quickLinks || [])];
                  updated.splice(index + 1, 0, { ...link });
                  updateProperty("quickLinks", updated);
                }}
              >
                <Copy className="w-4 h-4 text-gray-600" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                title="Delete link"
                onClick={() => {
                  const updated = (localProps.quickLinks || []).filter(
                    (_: any, i: number) => i !== index,
                  );
                  updateProperty("quickLinks", updated);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          className="mt-2 w-full"
          onClick={() => {
            const updated = [...(localProps.quickLinks || [])];
            updated.push({ label: "New Link", href: "#" });
            updateProperty("quickLinks", updated);
          }}
        >
          + Add Link
        </Button>
      </div>
    </div>
  );

  const renderTestimonialsBlockSettings = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Heading</Label>
        <Input
          value={localProps.heading || ""}
          onChange={(e) => updateProperty("heading", e.target.value)}
          placeholder="Section heading"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Background Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.backgroundColor || "#ffffff"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.backgroundColor || "#ffffff"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Width</Label>
        <Input
          value={localProps.width || "100%"}
          onChange={(e) => updateProperty("width", e.target.value)}
          placeholder="100% or 1200px"
        />
      </div>
    </div>
  );

  const renderAboutBlockSettings = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Heading</Label>
        <Input
          value={localProps.heading || ""}
          onChange={(e) => updateProperty("heading", e.target.value)}
          placeholder="Section heading"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Background Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.backgroundColor || "#ffffff"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.backgroundColor || "#ffffff"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Width</Label>
        <Input
          value={localProps.width || "100%"}
          onChange={(e) => updateProperty("width", e.target.value)}
          placeholder="100% or 1200px"
        />
      </div>
    </div>
  );

  const renderDefaultSettings = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Background Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.backgroundColor || "#ffffff"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.backgroundColor || "#ffffff"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Width</Label>
        <Input
          value={localProps.width || "100%"}
          onChange={(e) => updateProperty("width", e.target.value)}
          placeholder="100% or 1200px"
        />
      </div>
    </div>
  );

  const renderTextHeadingsBlockSettings = () => (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h4 className="font-semibold text-gray-900 mb-4">Container Styling</h4>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Background Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={localProps.containerBackgroundColor || "#ffffff"}
                onChange={(e) => updateProperty("containerBackgroundColor", e.target.value)}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                value={localProps.containerBackgroundColor || "#ffffff"}
                onChange={(e) => updateProperty("containerBackgroundColor", e.target.value)}
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Padding (px)</Label>
            <Input
              value={localProps.containerPadding || "24px"}
              onChange={(e) => updateProperty("containerPadding", e.target.value)}
              placeholder="24px"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Margin (px)</Label>
            <Input
              value={localProps.containerMargin || "0px"}
              onChange={(e) => updateProperty("containerMargin", e.target.value)}
              placeholder="0px"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Border Radius (px)</Label>
            <Input
              value={localProps.containerBorderRadius || "0px"}
              onChange={(e) => updateProperty("containerBorderRadius", e.target.value)}
              placeholder="0px"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Box Shadow</Label>
            <Input
              value={localProps.containerBoxShadow || "none"}
              onChange={(e) => updateProperty("containerBoxShadow", e.target.value)}
              placeholder="none or shadow CSS"
            />
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 pb-4">
        <h4 className="font-semibold text-gray-900 mb-4">Edit Elements</h4>
        <p className="text-xs text-gray-600 mb-3">Click on text elements in the preview to edit them individually. Use the styling controls below to customize all elements at once.</p>

        {localProps.elements && localProps.elements.length > 0 ? (
          <div className="space-y-2">
            {localProps.elements.map((element: any) => (
              <div key={element.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-700 mb-1">
                      {element.type === "heading" ? `Heading (${element.level})` : element.type.charAt(0).toUpperCase() + element.type.slice(1)}
                    </p>
                    <p className="text-xs text-gray-600 truncate">{element.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">No elements added yet. Click the block to add elements.</p>
        )}
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Text Styling (All Elements)</h4>
        <p className="text-xs text-gray-600 mb-4">Apply these styles to all text elements in the block:</p>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Font Family</Label>
            <select
              value={localProps.defaultFontFamily || "Arial, sans-serif"}
              onChange={(e) => {
                updateProperty("defaultFontFamily", e.target.value);
                // Update all elements
                const updatedElements = localProps.elements?.map((el: any) => ({
                  ...el,
                  fontFamily: e.target.value,
                })) || [];
                updateProperty("elements", updatedElements);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Arial, sans-serif">Arial</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Times New Roman, serif">Times New Roman</option>
              <option value="Courier New, monospace">Courier New</option>
              <option value="Verdana, sans-serif">Verdana</option>
              <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
            </select>
          </div>

          <div>
            <Label className="text-sm font-medium">Text Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={localProps.defaultTextColor || "#1f2937"}
                onChange={(e) => {
                  updateProperty("defaultTextColor", e.target.value);
                  const updatedElements = localProps.elements?.map((el: any) => ({
                    ...el,
                    textColor: e.target.value,
                  })) || [];
                  updateProperty("elements", updatedElements);
                }}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                value={localProps.defaultTextColor || "#1f2937"}
                onChange={(e) => {
                  updateProperty("defaultTextColor", e.target.value);
                  const updatedElements = localProps.elements?.map((el: any) => ({
                    ...el,
                    textColor: e.target.value,
                  })) || [];
                  updateProperty("elements", updatedElements);
                }}
                placeholder="#1f2937"
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Text Alignment</Label>
            <div className="flex gap-2">
              {["left", "center", "right"].map((align) => (
                <button
                  key={align}
                  onClick={() => {
                    const updatedElements = localProps.elements?.map((el: any) => ({
                      ...el,
                      textAlign: align,
                    })) || [];
                    updateProperty("elements", updatedElements);
                  }}
                  className={`flex-1 py-2 px-3 rounded border text-xs font-medium transition-colors ${
                    localProps.elements?.[0]?.textAlign === align
                      ? "bg-valasys-orange text-white border-valasys-orange"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {align.charAt(0).toUpperCase() + align.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDynamicContentBlockSettings = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Heading</Label>
        <Input
          value={localProps.heading || ""}
          onChange={(e) => updateProperty("heading", e.target.value)}
          placeholder="Section heading"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Description</Label>
        <textarea
          value={localProps.description || ""}
          onChange={(e) => updateProperty("description", e.target.value)}
          placeholder="Section description"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-sm"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Background Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.backgroundColor || "#ffffff"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.backgroundColor || "#ffffff"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.textColor || "#1f2937"}
            onChange={(e) => updateProperty("textColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.textColor || "#1f2937"}
            onChange={(e) => updateProperty("textColor", e.target.value)}
            placeholder="#1f2937"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );

  const renderProductBlockSettings = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Heading</Label>
        <Input
          value={localProps.heading || ""}
          onChange={(e) => updateProperty("heading", e.target.value)}
          placeholder="Product section heading"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Background Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.backgroundColor || "#ffffff"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.backgroundColor || "#ffffff"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Columns</Label>
        <Input
          type="number"
          value={localProps.columns || 1}
          onChange={(e) => updateProperty("columns", parseInt(e.target.value))}
          min="1"
          max="4"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">
          <input
            type="checkbox"
            checked={localProps.showPrice || false}
            onChange={(e) => updateProperty("showPrice", e.target.checked)}
            className="mr-2"
          />
          Show Price
        </Label>
      </div>

      <div>
        <Label className="text-sm font-medium">
          <input
            type="checkbox"
            checked={localProps.showDescription || false}
            onChange={(e) => updateProperty("showDescription", e.target.checked)}
            className="mr-2"
          />
          Show Description
        </Label>
      </div>
    </div>
  );

  const renderNavigationBlockSettings = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Background Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.backgroundColor || "#1f2937"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.backgroundColor || "#1f2937"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            placeholder="#1f2937"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.textColor || "#ffffff"}
            onChange={(e) => updateProperty("textColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.textColor || "#ffffff"}
            onChange={(e) => updateProperty("textColor", e.target.value)}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Orientation</Label>
        <div className="flex gap-2">
          {["horizontal", "vertical"].map((orientation) => (
            <button
              key={orientation}
              onClick={() => updateProperty("orientation", orientation)}
              className={`flex-1 py-2 px-3 rounded border text-xs font-medium transition-colors ${
                localProps.orientation === orientation
                  ? "bg-valasys-orange text-white border-valasys-orange"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {orientation.charAt(0).toUpperCase() + orientation.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Alignment</Label>
        <div className="flex gap-2">
          {["start", "center", "end"].map((align) => (
            <button
              key={align}
              onClick={() => updateProperty("alignment", align)}
              className={`flex-1 py-2 px-3 rounded border text-xs font-medium transition-colors ${
                localProps.alignment === align
                  ? "bg-valasys-orange text-white border-valasys-orange"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBlockSettings = () => {
    switch (block.type) {
      case "header":
        return renderHeaderBlockSettings();
      case "hero":
        return renderHeroBlockSettings();
      case "features":
        return renderFeaturesBlockSettings();
      case "testimonials":
        return renderTestimonialsBlockSettings();
      case "about":
        return renderAboutBlockSettings();
      case "footer":
        return renderFooterBlockSettings();
      case "text-headings-composite":
        return renderTextHeadingsBlockSettings();
      case "dynamic-content":
        return renderDynamicContentBlockSettings();
      case "product":
        return renderProductBlockSettings();
      case "navigation":
        return renderNavigationBlockSettings();
      default:
        return renderDefaultSettings();
    }
  };

  return (
    <div className="bg-white border-l border-gray-200 h-full overflow-y-auto flex flex-col">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900">
          {block.type.charAt(0).toUpperCase() + block.type.slice(1)} Settings
        </h3>
        {block.type === "hero" && (
          <p className="text-xs text-gray-600 mt-2">
            Click on headline or subheading text to edit sizing
          </p>
        )}
      </div>

      <div className="flex-1 p-4">
        <div className="space-y-6">{renderBlockSettings()}</div>
      </div>

      {onBlockDelete && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={onBlockDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Block
          </Button>
        </div>
      )}
    </div>
  );
};
