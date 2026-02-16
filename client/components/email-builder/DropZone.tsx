import React from "react";
import { useDrop } from "react-dnd";
import { cn } from "@/lib/utils";
import { ContentBlock } from "./types";

interface DropZoneProps {
  position: number;
  onBlockDrop: (block: ContentBlock, position: number) => void;
  isEmpty?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  position,
  onBlockDrop,
  isEmpty = false,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "block",
    drop: (item: any) => {
      if (item && item.block) {
        onBlockDrop(item.block, position);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [position, onBlockDrop]);

  if (isEmpty) {
    return (
      <div
        ref={drop}
        className="w-full py-12 px-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center transition-all hover:border-valasys-orange hover:bg-orange-50"
        style={{
          backgroundColor: isOver ? "rgba(255, 106, 0, 0.1)" : "transparent",
          borderColor: isOver ? "rgb(255, 106, 0)" : "rgb(200, 200, 200)",
        }}
      >
        <p className="text-gray-600 font-medium mb-2">Drop content here</p>
        <p className="text-sm text-gray-400">
          Drag blocks from the left sidebar to add them to your email
        </p>
      </div>
    );
  }

  return (
    <div
      ref={drop}
      className="w-full my-2 rounded transition-all"
      style={{
        minHeight: isOver ? "40px" : "8px",
        backgroundColor: isOver ? "rgba(255, 106, 0, 0.2)" : "transparent",
        border: isOver ? "2px dashed rgb(255, 106, 0)" : "2px dashed transparent",
        cursor: canDrop ? "grab" : "default",
      }}
    >
      {isOver && (
        <div className="flex items-center justify-center h-full">
          <span className="text-xs font-medium text-valasys-orange">
            Drop here to insert block
          </span>
        </div>
      )}
    </div>
  );
};
