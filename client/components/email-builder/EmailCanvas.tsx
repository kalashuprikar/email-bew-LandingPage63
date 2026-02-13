import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { Mail, Copy, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmailTemplate, ContentBlock } from "./types";
import { DraggableBlock } from "./DraggableBlock";

interface EmailCanvasProps {
  template: EmailTemplate;
  templateSubject: string;
  selectedBlockId: string | null;
  editingBlockId: string | null;
  selectedFooterElement?: string | null;
  onAddBlock: (block: ContentBlock, position?: number) => void;
  onBlockUpdate: (block: ContentBlock) => void;
  onBlockSelect: (id: string) => void;
  onEditingBlockChange: (id: string | null) => void;
  onFooterElementSelect?: (element: string | null) => void;
  onTemplateSubjectChange: (subject: string) => void;
  onBackgroundColorChange: (color: string) => void;
  onMoveBlock: (dragIndex: number, hoverIndex: number) => void;
  onDuplicateBlock?: (block: ContentBlock, position: number) => void;
  onDeleteBlock?: (blockId: string) => void;
}

export const EmailCanvas: React.FC<EmailCanvasProps> = ({
  template,
  templateSubject,
  selectedBlockId,
  editingBlockId,
  selectedFooterElement,
  onAddBlock,
  onBlockUpdate,
  onBlockSelect,
  onEditingBlockChange,
  onFooterElementSelect,
  onTemplateSubjectChange,
  onBackgroundColorChange,
  onMoveBlock,
  onDuplicateBlock,
  onDeleteBlock,
}) => {
  const [hoveredInlineGroup, setHoveredInlineGroup] = useState<string | null>(null);
  const [selectedInlineGroup, setSelectedInlineGroup] = useState<string | null>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["block", "template"],
    drop: (item: any, monitor) => {
      // Only process if this is a direct drop on the canvas, not on a nested element
      const didDropInNestedZone = monitor.didDrop();
      if (didDropInNestedZone) {
        return; // A nested drop zone (like CardDropZone) already handled it
      }

      if (item.blocks) {
        // Template dropped - add all blocks at the end
        item.blocks.forEach((block: ContentBlock) => {
          onAddBlock(block);
        });
      } else if (item.block) {
        // Single block dropped at the end
        onAddBlock(item.block);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Template Settings */}
        <div className="bg-white border border-gray-200 rounded-t-lg p-4 overflow-x-hidden">
          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <label
                htmlFor="subject"
                className="text-xs font-medium text-gray-700 block"
              >
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={templateSubject}
                onChange={(e) => onTemplateSubjectChange(e.target.value)}
                placeholder="Email subject"
                className="text-sm mt-1 w-full border border-gray-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent"
              />
            </div>
            <div className="min-w-0">
              <label
                htmlFor="bgColor"
                className="text-xs font-medium text-gray-700 block"
              >
                Background
              </label>
              <div className="flex gap-2 mt-1 min-w-0">
                <input
                  id="bgColor"
                  type="color"
                  value={template.backgroundColor}
                  onChange={(e) => onBackgroundColorChange(e.target.value)}
                  className="text-sm w-10 h-10 border border-gray-300 rounded cursor-pointer flex-shrink-0 mr-2"
                />
                <input
                  type="text"
                  value={template.backgroundColor}
                  onChange={(e) => onBackgroundColorChange(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-valasys-orange focus:border-transparent flex-1 mr-2"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Blocks Canvas */}
        <div
          ref={drop}
          style={{
            backgroundColor: template.backgroundColor,
            padding: `${template.padding}px`,
          }}
          className={cn(
            "bg-white border border-t-0 border-gray-200 rounded-b-lg shadow-sm min-h-96 transition-all",
            isOver && "ring-2 ring-valasys-orange bg-orange-50",
          )}
          onClick={(e) => {
            // Only deselect inline group if clicking on empty canvas area
            if (e.target === e.currentTarget) {
              setSelectedInlineGroup(null);
            }
          }}
        >
          {template.blocks.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-8 h-8 text-gray-300" />
                </div>
              </div>
              <p className="mb-2 text-gray-600 font-medium">
                Drop content here
              </p>
              <p className="text-sm text-gray-400">
                Drag blocks from the left sidebar to add them to your email
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col">
              {template.blocks.map((block, index) => {
                const isInlineDisplay = (block as any).displayMode === "inline";
                const nextBlock = template.blocks[index + 1];
                const nextIsInline = nextBlock && (nextBlock as any).displayMode === "inline";
                const prevBlock = template.blocks[index - 1];
                const prevIsInline = prevBlock && (prevBlock as any).displayMode === "inline";

                // Skip if this block is inline and we're not at the start of an inline sequence
                if (isInlineDisplay && prevIsInline) {
                  return null;
                }

                // If this is the start of an inline sequence, create a wrapper
                if (isInlineDisplay) {
                  const inlineBlocks = [block];
                  let currentIndex = index + 1;
                  while (
                    currentIndex < template.blocks.length &&
                    (template.blocks[currentIndex] as any).displayMode === "inline"
                  ) {
                    inlineBlocks.push(template.blocks[currentIndex]);
                    currentIndex++;
                  }

                  // Determine layout direction based on alignment
                  // If blocks have left/right alignment → horizontal layout
                  // If blocks have center alignment → vertical layout
                  const firstBlockAlignment = (inlineBlocks[0] as any).alignment;
                  const hasLeftRightAlignment = inlineBlocks.some(b =>
                    (b as any).alignment === "left" || (b as any).alignment === "right"
                  );
                  const flexDirection = hasLeftRightAlignment ? "row" : "column";
                  const justifyContent = "center";
                  const alignItems = "center";

                  const groupId = `inline-group-${block.id}`;
                  const isGroupSelected = selectedInlineGroup === groupId;
                  const isGroupHovered = hoveredInlineGroup === groupId;

                  return (
                    <div
                      key={groupId}
                      className="relative w-full block mb-0"
                      style={{ display: "block", width: "100%" }}
                      onMouseEnter={() => setHoveredInlineGroup(groupId)}
                      onMouseLeave={() => setHoveredInlineGroup(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInlineGroup(groupId);
                      }}
                    >
                      <div className={cn(
                        "w-full transition-all rounded-lg",
                        isGroupHovered && !isGroupSelected ? "border-2 border-dashed border-valasys-orange" : "border-2 border-solid border-valasys-orange"
                      )}
                      style={{
                        display: "flex",
                        flexDirection: flexDirection,
                        alignItems: "center",
                        justifyContent: justifyContent,
                        gap: "24px",
                        flexWrap: "nowrap",
                      }}>
                        {inlineBlocks.map((inlineBlock, i) => (
                          <div
                            key={inlineBlock.id}
                            className="flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0
                            }}
                          >
                            <DraggableBlock
                              block={inlineBlock}
                              index={index + i}
                              totalBlocks={template.blocks.length}
                              isSelected={selectedBlockId === inlineBlock.id}
                              isEditing={editingBlockId === inlineBlock.id}
                              selectedFooterElement={selectedFooterElement}
                              onBlockUpdate={onBlockUpdate}
                              onBlockSelect={(id) => {
                                onBlockSelect(id);
                                setSelectedInlineGroup(null);
                              }}
                              onEditingBlockChange={onEditingBlockChange}
                              onFooterElementSelect={onFooterElementSelect}
                              onMoveBlock={onMoveBlock}
                              onAddBlock={(newBlock, position) => {
                                onAddBlock(newBlock, position);
                              }}
                              onDuplicate={(blockToDuplicate, position) => {
                                // Duplicate entire inline group, not just individual block
                                const lastInlineBlockIndex = index + inlineBlocks.length - 1;
                                inlineBlocks.forEach((block, idx) => {
                                  onDuplicateBlock?.(block, lastInlineBlockIndex + 1 + idx);
                                });
                              }}
                              onDelete={(blockId) => {
                                // If all blocks in group are deleted, it will be handled automatically
                                onDeleteBlock?.(blockId);
                              }}
                              isPartOfInlineGroup={true}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Group Actions */}
                      {isGroupSelected && (
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all">
                          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-lg">
                            {/* Duplicate Group */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                              onMouseDown={(e) => e.stopPropagation()}
                              onPointerDown={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                e.stopPropagation();
                                // Duplicate all blocks in the group after the last block
                                const lastInlineBlockIndex = index + inlineBlocks.length - 1;
                                inlineBlocks.forEach((block, idx) => {
                                  onDuplicateBlock?.(block, lastInlineBlockIndex + 1 + idx);
                                });
                              }}
                              type="button"
                              title="Duplicate section"
                            >
                              <Copy className="w-4 h-4 text-gray-700" />
                            </Button>

                            {/* Delete Group */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-red-50 rounded-full"
                              onMouseDown={(e) => e.stopPropagation()}
                              onPointerDown={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                e.stopPropagation();
                                // Delete all blocks in the group
                                inlineBlocks.forEach((block) => {
                                  onDeleteBlock?.(block.id);
                                });
                                setSelectedInlineGroup(null);
                              }}
                              type="button"
                              title="Delete section"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <DraggableBlock
                    key={block.id}
                    block={block}
                    index={index}
                    totalBlocks={template.blocks.length}
                    isSelected={selectedBlockId === block.id}
                    isEditing={editingBlockId === block.id}
                    selectedFooterElement={selectedFooterElement}
                    onBlockUpdate={onBlockUpdate}
                    onBlockSelect={onBlockSelect}
                    onEditingBlockChange={onEditingBlockChange}
                    onFooterElementSelect={onFooterElementSelect}
                    onMoveBlock={onMoveBlock}
                    onAddBlock={(newBlock, position) => {
                      onAddBlock(newBlock, position);
                    }}
                    onDuplicate={(blockToDuplicate, position) => {
                      onDuplicateBlock?.(blockToDuplicate, position);
                    }}
                    onDelete={(blockId) => onDeleteBlock?.(blockId)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
