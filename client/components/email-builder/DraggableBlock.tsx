import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { Trash2, Copy } from "lucide-react";
import { ContentBlock } from "./types";
import { BlockRenderer } from "./BlockRenderer";
import { BlockActions } from "./BlockActions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DraggableBlockProps {
  block: ContentBlock;
  index: number;
  totalBlocks: number;
  isSelected: boolean;
  isEditing?: boolean;
  selectedFooterElement?: string | null;
  onBlockUpdate: (block: ContentBlock) => void;
  onBlockSelect: (id: string) => void;
  onEditingBlockChange?: (id: string | null) => void;
  onFooterElementSelect?: (element: string | null) => void;
  onMoveBlock: (dragIndex: number, hoverIndex: number) => void;
  onAddBlock: (block: ContentBlock, position: number) => void;
  onDuplicate: (block: ContentBlock, position: number) => void;
  onDelete: (blockId: string) => void;
  isPartOfInlineGroup?: boolean;
}

export const DraggableBlock: React.FC<DraggableBlockProps> = ({
  block,
  index,
  totalBlocks,
  isSelected,
  isEditing,
  selectedFooterElement,
  onBlockUpdate,
  onBlockSelect,
  onEditingBlockChange,
  onFooterElementSelect,
  onMoveBlock,
  onAddBlock,
  onDuplicate,
  onDelete,
  isPartOfInlineGroup,
}) => {
  const [isHovering, setIsHovering] = React.useState(false);
  const [isBlockSelected, setIsBlockSelected] = React.useState(false);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "canvas-block",
      item: () => ({ index, blockId: block.id }),
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [index, block.id],
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "canvas-block",
      hover: (item: { index: number; blockId: string }) => {
        if (item.index !== index) {
          onMoveBlock(item.index, index);
          item.index = index;
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [index, onMoveBlock],
  );

  const ref = React.useRef<HTMLDivElement>(null);
  drag(drop(ref));

  // Sync local state with parent selection
  React.useEffect(() => {
    setIsBlockSelected(isSelected);
  }, [isSelected]);

  return (
    <div
      ref={ref}
      className={cn(
        "group relative cursor-move transition-all",
        isDragging && "opacity-50 scale-95",
        isOver && "ring-2 ring-valasys-orange rounded-lg",
        !isPartOfInlineGroup && isHovering && !isBlockSelected && "border-2 border-dashed border-valasys-orange rounded-lg",
        !isPartOfInlineGroup && isBlockSelected && "border-2 border-solid border-valasys-orange rounded-lg",
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={(e) => {
        e.stopPropagation();
        onBlockSelect(block.id);
        setIsBlockSelected(true);
      }}
    >
      <BlockRenderer
        block={block}
        isSelected={isSelected}
        isEditing={isEditing}
        selectedFooterElement={selectedFooterElement}
        onBlockUpdate={onBlockUpdate}
        onBlockSelect={onBlockSelect}
        onEditingBlockChange={onEditingBlockChange}
        onFooterElementSelect={onFooterElementSelect}
        onAddBlock={onAddBlock}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        blockIndex={index}
      />

      {!isPartOfInlineGroup && isBlockSelected && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all">
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-lg">
            {/* Copy Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(block, index + 1);
                setIsBlockSelected(false);
              }}
              type="button"
              title="Duplicate block"
            >
              <Copy className="w-4 h-4 text-gray-700" />
            </Button>

            {/* Delete Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-red-50 rounded-full"
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(block.id);
                setIsBlockSelected(false);
              }}
              type="button"
              title="Delete block"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </div>
      )}

      {isPartOfInlineGroup && isBlockSelected && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-[101] transition-all">
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-lg">
            {/* Copy Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(block, index + 1);
                setIsBlockSelected(false);
              }}
              type="button"
              title="Duplicate block"
            >
              <Copy className="w-4 h-4 text-gray-700" />
            </Button>

            {/* Delete Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-red-50 rounded-full"
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(block.id);
                setIsBlockSelected(false);
              }}
              type="button"
              title="Delete block"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
