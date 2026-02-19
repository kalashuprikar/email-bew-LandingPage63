import React, { useState } from "react";
import { LandingPageBlock } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface SettingsPanelProps {
  block: LandingPageBlock | null;
  onBlockUpdate: (block: LandingPageBlock) => void;
  onBlockDelete: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  block,
  onBlockUpdate,
  onBlockDelete,
}) => {
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
        const newValue = `${newNum}${unit}`;
        onBlockUpdate({
          ...block,
          properties: { ...block.properties, [key]: newValue },
        });
      }
    }
  };

  const toggleUnit = (key: string, currentValue: string) => {
    const match = currentValue.match(/^(\d+(?:\.\d+)?)(.*)/);
    if (match) {
      const num = parseFloat(match[1]);
      const unit = match[2] || "px";
      const newUnit = unit === "%" ? "px" : "%";
      onBlockUpdate({
        ...block,
        properties: { ...block.properties, [key]: `${num}${newUnit}` },
      });
    }
  };

  if (!block) {
    return (
      <div className="bg-white border-l border-gray-200 p-4 h-full flex items-center justify-center">
        <p className="text-gray-500 text-sm">Select a block to edit</p>
      </div>
    );
  }

  const renderSettings = () => {
    const props = block.properties;

    switch (block.type) {
      case "header":
        return (
          <div className="space-y-5">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Logo Text
              </Label>
              <Input
                type="text"
                value={props.logoText || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, logoText: e.target.value },
                  })
                }
                className="focus:ring-valasys-orange focus:ring-2"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                CTA Button Text
              </Label>
              <Input
                type="text"
                value={props.ctaButtonText || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, ctaButtonText: e.target.value },
                  })
                }
                className="focus:ring-valasys-orange focus:ring-2"
              />
            </div>
          </div>
        );

      case "hero":
        return (
          <div className="space-y-5">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Headline
              </Label>
              <Input
                type="text"
                value={props.headline || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, headline: e.target.value },
                  })
                }
                className="focus:ring-valasys-orange focus:ring-2"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Subheading
              </Label>
              <Input
                type="text"
                value={props.subheading || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, subheading: e.target.value },
                  })
                }
                className="focus:ring-valasys-orange focus:ring-2"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                CTA Button Text
              </Label>
              <Input
                type="text"
                value={props.ctaButtonText || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, ctaButtonText: e.target.value },
                  })
                }
                className="focus:ring-valasys-orange focus:ring-2"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Headline Text Color
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={props.headlineColor || "#1f2937"}
                  onChange={(e) =>
                    onBlockUpdate({
                      ...block,
                      properties: { ...props, headlineColor: e.target.value },
                    })
                  }
                  className="w-12 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={props.headlineColor || "#1f2937"}
                  onChange={(e) =>
                    onBlockUpdate({
                      ...block,
                      properties: { ...props, headlineColor: e.target.value },
                    })
                  }
                  className="flex-1 focus:ring-valasys-orange focus:ring-2"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Subheading Text Color
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={props.subheadingColor || "#4b5563"}
                  onChange={(e) =>
                    onBlockUpdate({
                      ...block,
                      properties: { ...props, subheadingColor: e.target.value },
                    })
                  }
                  className="w-12 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={props.subheadingColor || "#4b5563"}
                  onChange={(e) =>
                    onBlockUpdate({
                      ...block,
                      properties: { ...props, subheadingColor: e.target.value },
                    })
                  }
                  className="flex-1 focus:ring-valasys-orange focus:ring-2"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Button Text Color
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={props.ctaButtonTextColor || "#ffffff"}
                  onChange={(e) =>
                    onBlockUpdate({
                      ...block,
                      properties: { ...props, ctaButtonTextColor: e.target.value },
                    })
                  }
                  className="w-12 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={props.ctaButtonTextColor || "#ffffff"}
                  onChange={(e) =>
                    onBlockUpdate({
                      ...block,
                      properties: { ...props, ctaButtonTextColor: e.target.value },
                    })
                  }
                  className="flex-1 focus:ring-valasys-orange focus:ring-2"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Background Color
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={props.backgroundColor || "#f3f4f6"}
                  onChange={(e) =>
                    onBlockUpdate({
                      ...block,
                      properties: { ...props, backgroundColor: e.target.value },
                    })
                  }
                  className="w-12 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={props.backgroundColor || "#f3f4f6"}
                  onChange={(e) =>
                    onBlockUpdate({
                      ...block,
                      properties: { ...props, backgroundColor: e.target.value },
                    })
                  }
                  className="flex-1 focus:ring-valasys-orange focus:ring-2"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Background Image URL
              </Label>
              <Input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={props.backgroundImage || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, backgroundImage: e.target.value },
                  })
                }
                className="focus:ring-valasys-orange focus:ring-2"
              />
              {props.backgroundImage && (
                <div className="mt-2 text-xs text-gray-600">
                  Preview:
                  <div
                    className="mt-1 w-full h-20 rounded border border-gray-300 bg-cover bg-center"
                    style={{ backgroundImage: `url(${props.backgroundImage})` }}
                  />
                </div>
              )}
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Overlay Opacity (0-100)
              </Label>
              <Input
                type="text"
                value={String(props.overlayOpacity || 0)}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const numericOnly = inputValue.replace(/[^0-9]/g, "");
                  if (numericOnly === "") {
                    onBlockUpdate({
                      ...block,
                      properties: { ...props, overlayOpacity: 0 },
                    });
                    return;
                  }
                  const num = Math.min(parseInt(numericOnly, 10), 100);
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, overlayOpacity: num },
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault();
                    const currentValue = props.overlayOpacity || 0;
                    const step = 5;
                    const newValue = e.key === "ArrowUp"
                      ? Math.min(currentValue + step, 100)
                      : Math.max(currentValue - step, 0);
                    onBlockUpdate({
                      ...block,
                      properties: { ...props, overlayOpacity: newValue },
                    });
                  }
                }}
                placeholder="0"
                className="focus:ring-valasys-orange focus:ring-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use overlay to make text more readable over the background image
              </p>
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Min Height (px)
              </Label>
              <Input
                type="text"
                value={props.minHeight || "500px"}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, minHeight: e.target.value },
                  })
                }
                onKeyDown={(e) => handleSizeKeyDown(e, "minHeight", props.minHeight || "500px")}
                className="focus:ring-valasys-orange focus:ring-2"
              />
            </div>
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="text-xs font-semibold text-gray-700 mb-4 block">Headline Sizing</h3>
              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                  Headline Width
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="100%, 500px, etc."
                    value={props.headlineWidth ?? "100%"}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, headlineWidth: e.target.value },
                      })
                    }
                    onKeyDown={(e) => handleSizeKeyDown(e, "headlineWidth", props.headlineWidth ?? "100%")}
                    className="focus:ring-valasys-orange focus:ring-2 flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleUnit("headlineWidth", props.headlineWidth ?? "100%")}
                    className="px-2 text-xs"
                  >
                    {(props.headlineWidth ?? "100%").includes("%") ? "px" : "%"}
                  </Button>
                </div>
              </div>
              <div className="mt-3">
                <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                  Headline Height
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="auto, 200px, etc."
                    value={props.headlineHeight ?? "auto"}
                    onChange={(e) =>
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, headlineHeight: e.target.value },
                      })
                    }
                    onKeyDown={(e) => handleSizeKeyDown(e, "headlineHeight", props.headlineHeight ?? "auto")}
                    className="focus:ring-valasys-orange focus:ring-2 flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const current = props.headlineHeight ?? "auto";
                      if (current === "auto") {
                        onBlockUpdate({
                          ...block,
                          properties: { ...props, headlineHeight: "100px" },
                        });
                      } else {
                        toggleUnit("headlineHeight", current);
                      }
                    }}
                    className="px-2 text-xs"
                  >
                    {(props.headlineHeight ?? "auto") === "auto" ? "px/%" : (props.headlineHeight ?? "auto").includes("%") ? "px" : "%"}
                  </Button>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="text-xs font-semibold text-gray-700 mb-4 block">Subheading Sizing</h3>
              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                  Subheading Width
                </Label>
                <Input
                  type="text"
                  placeholder="100%, 500px, etc."
                  value={props.subheadingWidth ?? "100%"}
                  onChange={(e) =>
                    onBlockUpdate({
                      ...block,
                      properties: { ...props, subheadingWidth: e.target.value },
                    })
                  }
                  onKeyDown={(e) => handleSizeKeyDown(e, "subheadingWidth", props.subheadingWidth ?? "100%")}
                  className="focus:ring-valasys-orange focus:ring-2"
                />
              </div>
              <div className="mt-3">
                <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                  Subheading Height
                </Label>
                <Input
                  type="text"
                  placeholder="auto, 100px, etc."
                  value={props.subheadingHeight ?? "auto"}
                  onChange={(e) =>
                    onBlockUpdate({
                      ...block,
                      properties: { ...props, subheadingHeight: e.target.value },
                    })
                  }
                  onKeyDown={(e) => handleSizeKeyDown(e, "subheadingHeight", props.subheadingHeight ?? "auto")}
                  className="focus:ring-valasys-orange focus:ring-2"
                />
              </div>
            </div>
          </div>
        );

      case "features":
        return (
          <div className="space-y-5">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Heading
              </Label>
              <Input
                type="text"
                value={props.heading || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, heading: e.target.value },
                  })
                }
                className="focus:ring-valasys-orange focus:ring-2"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Description
              </Label>
              <textarea
                value={props.description || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, description: e.target.value },
                  })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Columns
              </Label>
              <select
                value={props.columns || 4}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, columns: parseInt(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
              >
                <option value={3}>3 Columns</option>
                <option value={4}>4 Columns</option>
              </select>
            </div>
          </div>
        );

      case "testimonials":
        return (
          <div className="space-y-5">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Section Heading
              </Label>
              <Input
                type="text"
                value={props.heading || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, heading: e.target.value },
                  })
                }
                className="focus:ring-valasys-orange focus:ring-2"
              />
            </div>
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs text-blue-700">
                💡 Testimonials can be edited by selecting individual
                testimonials
              </p>
            </div>
          </div>
        );

      case "about":
        return (
          <div className="space-y-5">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Heading
              </Label>
              <Input
                type="text"
                value={props.heading || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, heading: e.target.value },
                  })
                }
                className="focus:ring-valasys-orange focus:ring-2"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Content
              </Label>
              <textarea
                value={props.content || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, content: e.target.value },
                  })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                rows={4}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Image Position
              </Label>
              <select
                value={props.imagePosition || "right"}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, imagePosition: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                CTA Text
              </Label>
              <Input
                type="text"
                value={props.cta?.text || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: {
                      ...props,
                      cta: { ...props.cta, text: e.target.value },
                    },
                  })
                }
                className="focus:ring-valasys-orange focus:ring-2"
              />
            </div>
          </div>
        );

      case "contact-form":
        return (
          <div className="space-y-5">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Heading
              </Label>
              <Input
                type="text"
                value={props.heading || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, heading: e.target.value },
                  })
                }
                className="focus:ring-valasys-orange focus:ring-2"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Description
              </Label>
              <Input
                type="text"
                value={props.description || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, description: e.target.value },
                  })
                }
                className="focus:ring-valasys-orange focus:ring-2"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Submit Button Text
              </Label>
              <Input
                type="text"
                value={props.submitButtonText || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, submitButtonText: e.target.value },
                  })
                }
                className="focus:ring-valasys-orange focus:ring-2"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Button Color
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={props.submitButtonColor || "#FF6A00"}
                  onChange={(e) =>
                    onBlockUpdate({
                      ...block,
                      properties: {
                        ...props,
                        submitButtonColor: e.target.value,
                      },
                    })
                  }
                  className="w-12 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={props.submitButtonColor || "#FF6A00"}
                  onChange={(e) =>
                    onBlockUpdate({
                      ...block,
                      properties: {
                        ...props,
                        submitButtonColor: e.target.value,
                      },
                    })
                  }
                  className="flex-1 focus:ring-valasys-orange focus:ring-2"
                />
              </div>
            </div>
          </div>
        );

      case "footer":
        return (
          <div className="space-y-5">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Company Name
              </Label>
              <Input
                type="text"
                value={props.companyName || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, companyName: e.target.value },
                  })
                }
                className="focus:ring-valasys-orange focus:ring-2"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Description
              </Label>
              <textarea
                value={props.companyDescription || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: {
                      ...props,
                      companyDescription: e.target.value,
                    },
                  })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
                rows={2}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Email
              </Label>
              <Input
                type="email"
                value={props.contactInfo?.email || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: {
                      ...props,
                      contactInfo: {
                        ...props.contactInfo,
                        email: e.target.value,
                      },
                    },
                  })
                }
                className="focus:ring-valasys-orange focus:ring-2"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Phone
              </Label>
              <Input
                type="text"
                value={props.contactInfo?.phone || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: {
                      ...props,
                      contactInfo: {
                        ...props.contactInfo,
                        phone: e.target.value,
                      },
                    },
                  })
                }
                className="focus:ring-valasys-orange focus:ring-2"
              />
            </div>
          </div>
        );

      case "section-spacer":
        return (
          <div className="space-y-5">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Height (px)
              </Label>
              <Input
                type="text"
                value={props.height || "60px"}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, height: e.target.value },
                  })
                }
                className="focus:ring-valasys-orange focus:ring-2"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white border-l border-gray-200 h-full flex flex-col overflow-hidden">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <h3 className="font-semibold text-gray-900 text-sm capitalize">
          {block.type.replace("-", " ")}
        </h3>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
          onClick={onBlockDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <div className="p-4 overflow-y-auto flex-1">{renderSettings()}</div>
    </div>
  );
};
