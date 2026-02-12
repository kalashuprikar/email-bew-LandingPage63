import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Copy, Trash2 } from "lucide-react";
import { ContentBlock } from "./types";
import {
  createTitleBlock,
  createTextBlock,
  createImageBlock,
  createButtonBlock,
  createDividerBlock,
  createSpacerBlock,
  createLogoBlock,
  createSocialBlock,
  createProductBlock,
  createNavigationBlock,
  createHtmlBlock,
  createVideoBlock,
  createDynamicContentBlock,
  createCenteredImageCardBlock,
  createSplitImageCardBlock,
  createPromoBlock,
} from "./utils";

interface BlockActionsProps {
  block: ContentBlock;
  blockIndex: number;
  totalBlocks: number;
  onAddBlock: (block: ContentBlock, position: number) => void;
  onDuplicate: (block: ContentBlock, position: number) => void;
  onDelete: () => void;
}

export const BlockActions: React.FC<BlockActionsProps> = ({
  block,
  blockIndex,
  totalBlocks,
  onAddBlock,
  onDuplicate,
  onDelete,
}) => {
  const handleAddBlockType = (blockType: string) => {
    let newBlock: ContentBlock;
    const insertPosition = blockIndex + 1;

    switch (blockType) {
      case "title":
        newBlock = createTitleBlock();
        break;
      case "text":
        newBlock = createTextBlock();
        break;
      case "image":
        newBlock = createImageBlock();
        break;
      case "video":
        newBlock = createVideoBlock();
        break;
      case "button":
        newBlock = createButtonBlock();
        break;
      case "divider":
        newBlock = createDividerBlock();
        break;
      case "spacer":
        newBlock = createSpacerBlock();
        break;
      case "logo":
        newBlock = createLogoBlock();
        break;
      case "social":
        newBlock = createSocialBlock();
        break;
      case "html":
        newBlock = createHtmlBlock();
        break;
      case "product":
        newBlock = createProductBlock();
        break;
      case "navigation":
        newBlock = createNavigationBlock();
        break;
      case "dynamicContent":
        newBlock = createDynamicContentBlock();
        break;
      case "centeredImageCard":
        newBlock = createCenteredImageCardBlock();
        break;
      case "splitImageCard":
        newBlock = createSplitImageCardBlock();
        break;
      case "promo":
        newBlock = createPromoBlock();
        break;
      default:
        newBlock = createTextBlock();
    }

    onAddBlock(newBlock, insertPosition);
  };

  return (
    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-lg whitespace-nowrap">
      {/* Add Block */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            title="Add new block"
          >
            <Plus className="w-4 h-4 text-gray-700" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-48">
          <DropdownMenuItem onClick={() => handleAddBlockType("title")}>
            Title
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddBlockType("text")}>
            Text
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddBlockType("image")}>
            Image
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddBlockType("video")}>
            Video
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddBlockType("button")}>
            Button
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddBlockType("divider")}>
            Divider
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddBlockType("spacer")}>
            Spacer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddBlockType("logo")}>
            Logo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddBlockType("social")}>
            Social Links
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddBlockType("product")}>
            Product
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddBlockType("navigation")}>
            Navigation
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleAddBlockType("dynamicContent")}
          >
            Dynamic Content
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddBlockType("html")}>
            HTML
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleAddBlockType("centeredImageCard")}
          >
            Image Card (Centered)
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleAddBlockType("splitImageCard")}
          >
            Image Card (Split)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddBlockType("promo")}>
            Promo Code
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Duplicate */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate(block, blockIndex + 1);
        }}
        type="button"
        title="Duplicate block"
      >
        <Copy className="w-4 h-4 text-gray-700" />
      </Button>

      {/* Delete */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-red-50 rounded-full"
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        type="button"
        title="Delete block"
      >
        <Trash2 className="w-4 h-4 text-red-600" />
      </Button>
    </div>
  );
};
