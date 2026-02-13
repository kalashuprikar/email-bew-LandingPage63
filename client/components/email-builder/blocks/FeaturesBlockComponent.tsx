import React, { useState, useEffect, useRef } from "react";
import { FeaturesBlock } from "../types";
import { Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateId } from "../utils";

interface FeaturesBlockComponentProps {
  block: FeaturesBlock;
  isSelected: boolean;
  onUpdate: (block: FeaturesBlock) => void;
  onDuplicate?: (block: FeaturesBlock, position: number) => void;
  onDelete?: (blockId: string) => void;
  blockIndex?: number;
}

export const FeaturesBlockComponent: React.FC<FeaturesBlockComponentProps> = ({
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

  const handleUpdateField = (
    featureId: string,
    field: "icons" | "titles" | "descriptions",
    itemId: string,
    content: string
  ) => {
    const updatedFeatures = block.features.map((f) => {
      if (f.id === featureId) {
        const items = f[field] || [];
        const updatedItems = items.map((item) =>
          item.id === itemId ? { ...item, content } : item
        );
        
        const updates: any = { [field]: updatedItems };
        // Sync legacy fields
        if (field === "icons") updates.icon = updatedItems[0]?.content || "";
        if (field === "titles") updates.title = updatedItems[0]?.content || "";
        if (field === "descriptions") updates.description = updatedItems[0]?.content || "";
        
        return { ...f, ...updates };
      }
      return f;
    });
    onUpdate({ ...block, features: updatedFeatures });
  };

  const handleDuplicateField = (
    featureId: string,
    field: "icons" | "titles" | "descriptions",
    itemId: string
  ) => {
    const updatedFeatures = block.features.map((f) => {
      if (f.id === featureId) {
        const items = f[field] || [];
        const index = items.findIndex((item) => item.id === itemId);
        if (index > -1) {
          const newItems = [...items];
          newItems.splice(index + 1, 0, {
            id: generateId(),
            content: items[index].content,
          });
          return { ...f, [field]: newItems };
        }
      }
      return f;
    });
    onUpdate({ ...block, features: updatedFeatures });
  };

  const handleDeleteField = (
    featureId: string,
    field: "icons" | "titles" | "descriptions",
    itemId: string
  ) => {
    const updatedFeatures = block.features.map((f) => {
      if (f.id === featureId) {
        const items = f[field] || [];
        const newItems = items.filter((item) => item.id !== itemId);
        
        const updates: any = { [field]: newItems };
        // Sync legacy fields
        if (field === "icons") updates.icon = newItems[0]?.content || "";
        if (field === "titles") updates.title = newItems[0]?.content || "";
        if (field === "descriptions") updates.description = newItems[0]?.content || "";
        
        return { ...f, ...updates };
      }
      return f;
    });
    onUpdate({ ...block, features: updatedFeatures });
    setEditMode(null);
    setFocusedFieldId(null);
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

  const containerStyle = {
    width: `${block.width}${block.widthUnit}`,
    margin: "20px 0",
    display: "flex",
    flexWrap: "nowrap" as const,
    gap: "0",
    alignItems: "stretch",
  };

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      className={`rounded-lg transition-all group relative ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
    >
      {block.features.map((feature) => {
        const icons = feature.icons || (feature.icon ? [{ id: `${feature.id}-icon`, content: feature.icon }] : []);
        const titles = feature.titles || (feature.title ? [{ id: `${feature.id}-title`, content: feature.title }] : []);
        const descriptions = feature.descriptions || (feature.description ? [{ id: `${feature.id}-desc`, content: feature.description }] : []);

        return (
          <div
            key={feature.id}
            style={{
              flex: 1,
              minWidth: 0,
              textAlign: "center",
              padding: "0 10px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                backgroundColor: feature.backgroundColor,
                borderRadius: `${feature.borderRadius}px`,
                padding: `${feature.padding}px`,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                height: "100%",
              }}
            >
              {/* Icons */}
              <div className="space-y-2 mb-3">
                {icons.map((icon) => {
                  const isHovered = hoveredFieldId === icon.id;
                  const isFocused = focusedFieldId === icon.id;
                  const isEditing = editMode === icon.id;

                  return (
                    <div
                      key={icon.id}
                      className="relative"
                      onMouseEnter={() => setHoveredFieldId(icon.id)}
                      onMouseLeave={() => setHoveredFieldId(null)}
                    >
                      {isEditing ? (
                        <div className="space-y-1">
                          <Input
                            value={icon.content}
                            onChange={(e) => handleUpdateField(feature.id, "icons", icon.id, e.target.value)}
                            onBlur={() => setEditMode(null)}
                            autoFocus
                            className="text-center text-2xl"
                          />
                          <FieldToolbar
                            onCopy={() => handleDuplicateField(feature.id, "icons", icon.id)}
                            onDelete={() => handleDeleteField(feature.id, "icons", icon.id)}
                          />
                        </div>
                      ) : (
                        <div className="relative">
                          <div
                            style={{
                              fontSize: "32px",
                              lineHeight: "1",
                              cursor: "pointer",
                              border: isFocused
                                ? "2px solid rgb(255, 106, 0)"
                                : isHovered
                                ? "2px dotted rgb(255, 106, 0)"
                                : "2px solid transparent",
                            }}
                            className="p-1 rounded transition-all"
                            onClick={() => setFocusedFieldId(icon.id)}
                            onDoubleClick={() => {
                              setEditMode(icon.id);
                              setFocusedFieldId(icon.id);
                            }}
                          >
                            {icon.content}
                          </div>
                          {isFocused && (
                            <FieldToolbar
                              onCopy={() => handleDuplicateField(feature.id, "icons", icon.id)}
                              onDelete={() => handleDeleteField(feature.id, "icons", icon.id)}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Titles */}
              <div className="space-y-2 mb-2">
                {titles.map((title) => {
                  const isHovered = hoveredFieldId === title.id;
                  const isFocused = focusedFieldId === title.id;
                  const isEditing = editMode === title.id;

                  return (
                    <div
                      key={title.id}
                      className="relative"
                      onMouseEnter={() => setHoveredFieldId(title.id)}
                      onMouseLeave={() => setHoveredFieldId(null)}
                    >
                      {isEditing ? (
                        <div className="space-y-1">
                          <Input
                            value={title.content}
                            onChange={(e) => handleUpdateField(feature.id, "titles", title.id, e.target.value)}
                            onBlur={() => setEditMode(null)}
                            autoFocus
                            className="text-center font-bold"
                          />
                          <FieldToolbar
                            onCopy={() => handleDuplicateField(feature.id, "titles", title.id)}
                            onDelete={() => handleDeleteField(feature.id, "titles", title.id)}
                          />
                        </div>
                      ) : (
                        <div className="relative">
                          <h3
                            style={{
                              margin: 0,
                              fontSize: `${feature.titleFontSize}px`,
                              fontWeight: "bold",
                              color: feature.textColor,
                              cursor: "pointer",
                              border: isFocused
                                ? "2px solid rgb(255, 106, 0)"
                                : isHovered
                                ? "2px dotted rgb(255, 106, 0)"
                                : "2px solid transparent",
                            }}
                            className="p-1 rounded transition-all"
                            onClick={() => setFocusedFieldId(title.id)}
                            onDoubleClick={() => {
                              setEditMode(title.id);
                              setFocusedFieldId(title.id);
                            }}
                          >
                            {title.content}
                          </h3>
                          {isFocused && (
                            <FieldToolbar
                              onCopy={() => handleDuplicateField(feature.id, "titles", title.id)}
                              onDelete={() => handleDeleteField(feature.id, "titles", title.id)}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Descriptions */}
              <div className="space-y-2">
                {descriptions.map((desc) => {
                  const isHovered = hoveredFieldId === desc.id;
                  const isFocused = focusedFieldId === desc.id;
                  const isEditing = editMode === desc.id;

                  return (
                    <div
                      key={desc.id}
                      className="relative"
                      onMouseEnter={() => setHoveredFieldId(desc.id)}
                      onMouseLeave={() => setHoveredFieldId(null)}
                    >
                      {isEditing ? (
                        <div className="space-y-1">
                          <textarea
                            value={desc.content}
                            onChange={(e) => handleUpdateField(feature.id, "descriptions", desc.id, e.target.value)}
                            onBlur={() => setEditMode(null)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                            className="w-full text-center text-sm border rounded p-1"
                            style={{ color: feature.textColor }}
                          />
                          <FieldToolbar
                            onCopy={() => handleDuplicateField(feature.id, "descriptions", desc.id)}
                            onDelete={() => handleDeleteField(feature.id, "descriptions", desc.id)}
                          />
                        </div>
                      ) : (
                        <div className="relative">
                          <p
                            style={{
                              margin: 0,
                              fontSize: `${feature.fontSize}px`,
                              color: feature.textColor,
                              lineHeight: "1.5",
                              cursor: "pointer",
                              border: isFocused
                                ? "2px solid rgb(255, 106, 0)"
                                : isHovered
                                ? "2px dotted rgb(255, 106, 0)"
                                : "2px solid transparent",
                            }}
                            className="p-1 rounded transition-all"
                            onClick={() => setFocusedFieldId(desc.id)}
                            onDoubleClick={() => {
                              setEditMode(desc.id);
                              setFocusedFieldId(desc.id);
                            }}
                          >
                            {desc.content}
                          </p>
                          {isFocused && (
                            <FieldToolbar
                              onCopy={() => handleDuplicateField(feature.id, "descriptions", desc.id)}
                              onDelete={() => handleDeleteField(feature.id, "descriptions", desc.id)}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
