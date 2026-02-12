import React from "react";
import { TextBlock } from "../types";
import { Edit2, Copy, Trash2 } from "lucide-react";

interface TextBlockComponentProps {
  block: TextBlock;
  isSelected: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onEditingChange?: (id: string | null) => void;
  onContentChange: (content: string) => void;
  onDuplicate?: (block: TextBlock, position: number) => void;
  onDelete?: (blockId: string) => void;
  blockIndex?: number;
}

export const TextBlockComponent: React.FC<TextBlockComponentProps> = ({
  block,
  isSelected,
  isEditing,
  onEdit,
  onEditingChange,
  onContentChange,
  onDuplicate,
  onDelete,
  blockIndex = 0,
}) => {
  const [isHovering, setIsHovering] = React.useState(false);

  const getWidthStyle = () => {
    if (block.widthUnit === "%") {
      return `${block.width}%`;
    }
    return `${block.width}px`;
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected && onEditingChange) {
      onEditingChange(block.id);
    }
  };

  const handleEditIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditingChange) {
      onEditingChange(block.id);
    }
  };

  return (
    <div
      className={`relative transition-all cursor-pointer user-select-none ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        margin: `${block.margin}px`,
        display: "block",
        userSelect: "none",
      }}
    >
      {isEditing ? (
        <textarea
          value={block.content}
          onChange={(e) => onContentChange(e.target.value)}
          onBlur={() => onEditingChange?.(null)}
          autoFocus
          className="w-full rounded px-2 py-1 font-serif outline-none"
          style={{
            fontSize: `${block.fontSize}px`,
            color: block.fontColor,
            backgroundColor: block.backgroundColor,
            textAlign: block.alignment as any,
            fontWeight: block.fontWeight as any,
            fontStyle: block.fontStyle as any,
            padding: `${block.padding}px`,
            width: getWidthStyle(),
            borderWidth: `${block.borderWidth}px`,
            borderColor: block.borderColor,
            borderStyle: block.borderWidth > 0 ? "solid" : "none",
            borderRadius: `${block.borderRadius}px`,
            userSelect: "text",
            boxSizing: "border-box",
            overflow: "auto",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "normal",
          }}
        />
      ) : (
        <p
          style={{
            fontSize: `${block.fontSize}px`,
            color: block.fontColor,
            backgroundColor: block.backgroundColor,
            textAlign: block.alignment as any,
            fontWeight: block.fontWeight as any,
            fontStyle: block.fontStyle as any,
            padding: `${block.padding}px`,
            width: getWidthStyle(),
            borderWidth: `${block.borderWidth}px`,
            borderColor: block.borderColor,
            borderStyle: block.borderWidth > 0 ? "solid" : "none",
            borderRadius: `${block.borderRadius}px`,
            margin: 0,
            userSelect: "none",
            boxSizing: "border-box",
            overflow: "hidden",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "normal",
          }}
        >
          {block.content}
        </p>
      )}
    </div>
  );
};
