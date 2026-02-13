import React, { useState, useEffect, useRef } from "react";
import { StatsBlock } from "../types";
import { Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateId } from "../utils";

interface StatsBlockComponentProps {
  block: StatsBlock;
  isSelected: boolean;
  onUpdate: (block: StatsBlock) => void;
  onDuplicate?: (block: StatsBlock, position: number) => void;
  onDelete?: (blockId: string) => void;
  blockIndex?: number;
}

export const StatsBlockComponent: React.FC<StatsBlockComponentProps> = ({
  block,
  isSelected,
  onUpdate,
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

  const handleUpdateValue = (statId: string, valueId: string, content: string) => {
    const updatedStats = block.stats.map((s) => {
      if (s.id === statId) {
        const values = s.values || [{ id: `${s.id}-val`, content: s.value }];
        const updatedValues = values.map((v) =>
          v.id === valueId ? { ...v, content } : v
        );
        return { ...s, values: updatedValues, value: updatedValues[0]?.content || "" };
      }
      return s;
    });
    onUpdate({ ...block, stats: updatedStats });
  };

  const handleDuplicateValue = (statId: string, valueId: string) => {
    const updatedStats = block.stats.map((s) => {
      if (s.id === statId) {
        const values = s.values || [{ id: `${s.id}-val`, content: s.value }];
        const index = values.findIndex((v) => v.id === valueId);
        if (index > -1) {
          const newValues = [...values];
          newValues.splice(index + 1, 0, {
            id: generateId(),
            content: values[index].content,
          });
          return { ...s, values: newValues };
        }
      }
      return s;
    });
    onUpdate({ ...block, stats: updatedStats });
  };

  const handleDeleteValue = (statId: string, valueId: string) => {
    const updatedStats = block.stats.map((s) => {
      if (s.id === statId) {
        const values = s.values || [{ id: `${s.id}-val`, content: s.value }];
        const newValues = values.filter((v) => v.id !== valueId);
        return { ...s, values: newValues, value: newValues[0]?.content || "" };
      }
      return s;
    });
    onUpdate({ ...block, stats: updatedStats });
    setEditMode(null);
    setFocusedFieldId(null);
  };

  const handleUpdateLabel = (statId: string, labelId: string, content: string) => {
    const updatedStats = block.stats.map((s) => {
      if (s.id === statId) {
        const labels = s.labels || [{ id: `${s.id}-lab`, content: s.label }];
        const updatedLabels = labels.map((l) =>
          l.id === labelId ? { ...l, content } : l
        );
        return { ...s, labels: updatedLabels, label: updatedLabels[0]?.content || "" };
      }
      return s;
    });
    onUpdate({ ...block, stats: updatedStats });
  };

  const handleDuplicateLabel = (statId: string, labelId: string) => {
    const updatedStats = block.stats.map((s) => {
      if (s.id === statId) {
        const labels = s.labels || [{ id: `${s.id}-lab`, content: s.label }];
        const index = labels.findIndex((l) => l.id === labelId);
        if (index > -1) {
          const newLabels = [...labels];
          newLabels.splice(index + 1, 0, {
            id: generateId(),
            content: labels[index].content,
          });
          return { ...s, labels: newLabels };
        }
      }
      return s;
    });
    onUpdate({ ...block, stats: updatedStats });
  };

  const handleDeleteLabel = (statId: string, labelId: string) => {
    const updatedStats = block.stats.map((s) => {
      if (s.id === statId) {
        const labels = s.labels || [{ id: `${s.id}-lab`, content: s.label }];
        const newLabels = labels.filter((l) => l.id !== labelId);
        return { ...s, labels: newLabels, label: newLabels[0]?.content || "" };
      }
      return s;
    });
    onUpdate({ ...block, stats: updatedStats });
    setEditMode(null);
    setFocusedFieldId(null);
  };

  const containerStyle = {
    width: `${block.width}${block.widthUnit}`,
    margin: "20px 0",
    display: "flex",
    flexWrap: "wrap" as const,
  };

  const FieldToolbar = ({
    onCopy,
    onDelete,
  }: {
    onCopy: () => void;
    onDelete: () => void;
  }) => {
    return (
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-md mt-1 w-fit mx-auto z-[110]">
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
      className={`rounded-lg transition-all group relative ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
    >
      {block.stats.map((stat, sIndex) => {
        const borderStyle =
          sIndex !== block.stats.length - 1
            ? { borderRight: "1px solid #e0e0e0" }
            : {};
        
        const values = stat.values || (stat.value ? [{ id: `${stat.id}-val`, content: stat.value }] : []);
        const labels = stat.labels || (stat.label ? [{ id: `${stat.id}-lab`, content: stat.label }] : []);

        return (
          <div
            key={stat.id}
            style={{
              width: "33%",
              textAlign: "center",
              padding: `${stat.padding}px`,
              boxSizing: "border-box",
              ...borderStyle,
              position: "relative",
            }}
          >
            {/* Values */}
            <div className="space-y-2 mb-2">
              {values.map((v) => {
                const isHovered = hoveredFieldId === v.id;
                const isFocused = focusedFieldId === v.id;
                const isEditing = editMode === v.id;

                return (
                  <div
                    key={v.id}
                    className="relative"
                    onMouseEnter={() => setHoveredFieldId(v.id)}
                    onMouseLeave={() => setHoveredFieldId(null)}
                  >
                    {isEditing ? (
                      <div className="space-y-1">
                        <Input
                          value={v.content}
                          onChange={(e) => handleUpdateValue(stat.id, v.id, e.target.value)}
                          onBlur={() => setEditMode(null)}
                          autoFocus
                          className="text-center font-bold text-lg"
                        />
                        <FieldToolbar
                          onCopy={() => handleDuplicateValue(stat.id, v.id)}
                          onDelete={() => handleDeleteValue(stat.id, v.id)}
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <h3
                          style={{
                            margin: 0,
                            fontSize: `${stat.fontSize}px`,
                            fontWeight: "bold",
                            color: stat.textColor,
                            cursor: "pointer",
                            border: isFocused
                              ? "2px solid rgb(255, 106, 0)"
                              : isHovered
                              ? "2px dotted rgb(255, 106, 0)"
                              : "2px solid transparent",
                          }}
                          className="p-1 rounded transition-all"
                          onClick={() => setFocusedFieldId(v.id)}
                          onDoubleClick={() => {
                            setEditMode(v.id);
                            setFocusedFieldId(v.id);
                          }}
                        >
                          {v.content}
                        </h3>
                        {isFocused && (
                          <FieldToolbar
                            onCopy={() => handleDuplicateValue(stat.id, v.id)}
                            onDelete={() => handleDeleteValue(stat.id, v.id)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Labels */}
            <div className="space-y-2">
              {labels.map((l) => {
                const isHovered = hoveredFieldId === l.id;
                const isFocused = focusedFieldId === l.id;
                const isEditing = editMode === l.id;

                return (
                  <div
                    key={l.id}
                    className="relative"
                    onMouseEnter={() => setHoveredFieldId(l.id)}
                    onMouseLeave={() => setHoveredFieldId(null)}
                  >
                    {isEditing ? (
                      <div className="space-y-1">
                        <Input
                          value={l.content}
                          onChange={(e) => handleUpdateLabel(stat.id, l.id, e.target.value)}
                          onBlur={() => setEditMode(null)}
                          autoFocus
                          className="text-center text-sm"
                        />
                        <FieldToolbar
                          onCopy={() => handleDuplicateLabel(stat.id, l.id)}
                          onDelete={() => handleDeleteLabel(stat.id, l.id)}
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <p
                          style={{
                            margin: 0,
                            fontSize: `${stat.labelFontSize}px`,
                            color: "#666",
                            cursor: "pointer",
                            border: isFocused
                              ? "2px solid rgb(255, 106, 0)"
                              : isHovered
                              ? "2px dotted rgb(255, 106, 0)"
                              : "2px solid transparent",
                          }}
                          className="p-1 rounded transition-all"
                          onClick={() => setFocusedFieldId(l.id)}
                          onDoubleClick={() => {
                            setEditMode(l.id);
                            setFocusedFieldId(l.id);
                          }}
                        >
                          {l.content}
                        </p>
                        {isFocused && (
                          <FieldToolbar
                            onCopy={() => handleDuplicateLabel(stat.id, l.id)}
                            onDelete={() => handleDeleteLabel(stat.id, l.id)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
