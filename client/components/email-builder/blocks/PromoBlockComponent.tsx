import React, { useState, useEffect, useRef } from "react";
import { PromoBlock, ContentBlock } from "../types";
import { Plus, Copy, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTextBlock } from "../utils";

interface PromoBlockComponentProps {
  block: PromoBlock;
  isSelected: boolean;
  onBlockUpdate: (block: PromoBlock) => void;
  onAddBlock?: (block: ContentBlock, position: number) => void;
  onDuplicate?: (block: ContentBlock, position: number) => void;
  onDelete?: (blockId: string) => void;
  blockIndex?: number;
}

export const PromoBlockComponent: React.FC<PromoBlockComponentProps> = ({
  block,
  isSelected,
  onBlockUpdate,
  onAddBlock,
  onDuplicate,
  onDelete,
  blockIndex = 0,
}) => {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [hoveredFieldId, setHoveredFieldId] = useState<string | null>(null);
  const [focusedFieldId, setFocusedFieldId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setFocusedFieldId(null);
        setEditMode(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isSelected) {
      setFocusedFieldId(null);
      setEditMode(null);
    }
  }, [isSelected]);

  const texts = React.useMemo(
    () =>
      block.promoTexts ||
      (block.promoText ? [{ id: "text-0", content: block.promoText }] : []),
    [block.promoTexts, block.promoText],
  );

  const codes = React.useMemo(
    () =>
      block.promoCodes ||
      (block.promoCode ? [{ id: "code-0", content: block.promoCode }] : []),
    [block.promoCodes, block.promoCode],
  );

  const handleUpdateText = (id: string, content: string) => {
    const updatedTexts = texts.map((t) => (t.id === id ? { ...t, content } : t));
    onBlockUpdate({ ...block, promoTexts: updatedTexts });
  };

  const handleUpdateCode = (id: string, content: string) => {
    const updatedCodes = codes.map((c) => (c.id === id ? { ...c, content } : c));
    onBlockUpdate({ ...block, promoCodes: updatedCodes });
  };

  const handleDuplicateText = (id: string) => {
    const textToDuplicate = texts.find((t) => t.id === id);
    if (textToDuplicate) {
      const newTexts = [...texts];
      const index = texts.findIndex((t) => t.id === id);
      newTexts.splice(index + 1, 0, {
        content: textToDuplicate.content,
        id: createId(),
      });
      onBlockUpdate({ ...block, promoTexts: newTexts });
    }
  };

  const handleDuplicateCode = (id: string) => {
    const codeToDuplicate = codes.find((c) => c.id === id);
    if (codeToDuplicate) {
      const newCodes = [...codes];
      const index = codes.findIndex((c) => c.id === id);
      newCodes.splice(index + 1, 0, {
        content: codeToDuplicate.content,
        id: createId(),
      });
      onBlockUpdate({ ...block, promoCodes: newCodes });
    }
  };

  const handleDeleteText = (id: string) => {
    const newTexts = texts.filter((t) => t.id !== id);
    onBlockUpdate({ ...block, promoTexts: newTexts });
    setEditMode(null);
    setFocusedFieldId(null);
  };

  const handleDeleteCode = (id: string) => {
    const newCodes = codes.filter((c) => c.id !== id);
    onBlockUpdate({ ...block, promoCodes: newCodes });
    setEditMode(null);
    setFocusedFieldId(null);
  };

  const createId = () =>
    `promo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const containerStyle = {
    backgroundColor: block.backgroundColor,
    padding: `${block.padding}px`,
    textAlign: block.alignment as any,
    borderRadius: `${block.borderRadius}px`,
    margin: `${block.margin}px auto`,
    width: `${block.width}${block.widthUnit}`,
    border:
      block.borderWidth > 0
        ? `${block.borderWidth}px solid ${block.borderColor}`
        : "none",
    boxSizing: "border-box" as const,
    position: "relative" as const,
  };

  const textStyle = {
    margin: "0 0 12px 0",
    fontSize: `${block.fontSize}px`,
    color: block.fontColor,
    cursor: "pointer",
  };

  const codeStyle = {
    margin: 0,
    fontSize: `${block.promoCodeFontSize}px`,
    fontWeight: block.fontWeight as any,
    color: block.promoCodeColor,
    letterSpacing: `${block.letterSpacing}px`,
    cursor: "pointer",
  };

  const FieldToolbar = ({
    onCopy,
    onDelete,
  }: {
    onCopy: () => void;
    onDelete: () => void;
  }) => {
    return (
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-md mt-2 w-fit mx-auto z-[110]">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-gray-100"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCopy();
            }}
          >
          <Copy className="w-3.5 h-3.5 text-gray-700" />
        </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-red-50"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
          >
          <Trash2 className="w-3.5 h-3.5 text-red-600" />
        </Button>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      className={`transition-all group relative ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
    >
      <div className="space-y-4">
        {/* Texts */}
        <div className="space-y-2">
          {texts.map((text) => (
            <div
              key={text.id}
              className="relative"
              onMouseEnter={() => setHoveredFieldId(text.id)}
              onMouseLeave={() => setHoveredFieldId(null)}
            >
              {editMode === text.id ? (
                <div className="space-y-2">
                  <Input
                    value={text.content}
                    onChange={(e) => handleUpdateText(text.id, e.target.value)}
                    onBlur={() => setEditMode(null)}
                    autoFocus
                    className="text-center"
                  />
                  <FieldToolbar
                    onCopy={() => handleDuplicateText(text.id)}
                    onDelete={() => handleDeleteText(text.id)}
                  />
                </div>
              ) : (
                <div className="relative">
                  <p
                    style={{
                      ...textStyle,
                      border:
                        focusedFieldId === text.id
                          ? "2px solid rgb(255, 106, 0)"
                          : hoveredFieldId === text.id
                            ? "2px dotted rgb(255, 106, 0)"
                            : "none",
                    }}
                    className="p-2 rounded transition-all"
                    onClick={() => setFocusedFieldId(text.id)}
                    onDoubleClick={() => {
                      setEditMode(text.id);
                      setFocusedFieldId(text.id);
                    }}
                  >
                    {text.content}
                  </p>
                  {focusedFieldId === text.id && (
                    <FieldToolbar
                      onCopy={() => handleDuplicateText(text.id)}
                      onDelete={() => handleDeleteText(text.id)}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Codes */}
        <div className="space-y-2">
          {codes.map((code) => (
            <div
              key={code.id}
              className="relative"
              onMouseEnter={() => setHoveredFieldId(code.id)}
              onMouseLeave={() => setHoveredFieldId(null)}
            >
              {editMode === code.id ? (
                <div className="space-y-2">
                  <Input
                    value={code.content}
                    onChange={(e) => handleUpdateCode(code.id, e.target.value)}
                    onBlur={() => setEditMode(null)}
                    autoFocus
                    className="text-center font-bold"
                  />
                  <FieldToolbar
                    onCopy={() => handleDuplicateCode(code.id)}
                    onDelete={() => handleDeleteCode(code.id)}
                  />
                </div>
              ) : (
                <div className="relative">
                  <h2
                    style={{
                      ...codeStyle,
                      border:
                        focusedFieldId === code.id
                          ? "2px solid rgb(255, 106, 0)"
                          : hoveredFieldId === code.id
                            ? "2px dotted rgb(255, 106, 0)"
                            : "none",
                    }}
                    className="p-2 rounded transition-all"
                    onClick={() => setFocusedFieldId(code.id)}
                    onDoubleClick={() => {
                      setEditMode(code.id);
                      setFocusedFieldId(code.id);
                    }}
                  >
                    {code.content}
                  </h2>
                  {focusedFieldId === code.id && (
                    <FieldToolbar
                      onCopy={() => handleDuplicateCode(code.id)}
                      onDelete={() => handleDeleteCode(code.id)}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
