import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Trash2, Copy, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LandingPage, LandingPageBlock } from "./types";
import {
  HeaderBlockPreview,
  HeroBlockPreview,
  FeaturesBlockPreview,
  TestimonialsBlockPreview,
  AboutBlockPreview,
  ContactFormBlockPreview,
  FooterBlockPreview,
  SpacerBlockPreview,
  PricingBlockPreview,
  FaqBlockPreview,
  SignupBlockPreview,
  PricingFooterBlockPreview,
  HeadingBlockPreview,
  ParagraphBlockPreview,
  RichTextBlockPreview,
  QuoteBlockPreview,
  DynamicContentBlockPreview,
  ProductBlockPreview,
  NavigationBlockPreview,
} from "./BlockPreviews";
import {
  createHeaderBlock,
  createHeroBlock,
  createFeaturesBlock,
  createTestimonialsBlock,
  createAboutBlock,
  createContactFormBlock,
  createFooterBlock,
  createSectionSpacerBlock,
  createPricingBlock,
  createFaqBlock,
  createSignupBlock,
  createPricingFooterBlock,
  createHeadingBlock,
  createParagraphBlock,
  createRichTextBlock,
  createQuoteBlock,
  createDynamicContentBlock,
  createProductBlock,
  createNavigationBlock,
} from "./utils";

interface DraggableLandingPagePreviewProps {
  page: LandingPage;
  selectedBlockId: string | null;
  selectedElement?: "heading" | "subheading" | "button" | null;
  onSelectBlock: (blockId: string | null) => void;
  onElementSelect?: (element: "heading" | "subheading" | "button" | null) => void;
  onUpdateBlock: (blockId: string, properties: Record<string, any>) => void;
  onDeleteBlock: (blockId: string) => void;
  onMoveBlock: (blockId: string, direction: "up" | "down") => void;
  onDuplicateBlock?: (blockId: string) => void;
  onReorderBlocks: (blocks: LandingPageBlock[]) => void;
  onAddBlock?: (blockIndex: number, block: LandingPageBlock) => void;
  onLinkSelect?: (blockId: string, linkIndex: number, linkType: "navigation" | "quick") => void;
}

const BLOCK_CREATORS = {
  header: createHeaderBlock,
  hero: createHeroBlock,
  features: createFeaturesBlock,
  testimonials: createTestimonialsBlock,
  about: createAboutBlock,
  "contact-form": createContactFormBlock,
  footer: createFooterBlock,
  "section-spacer": createSectionSpacerBlock,
  pricing: createPricingBlock,
  faq: createFaqBlock,
  signup: createSignupBlock,
  "pricing-footer": createPricingFooterBlock,
  heading: () => createHeadingBlock("h2"),
  paragraph: createParagraphBlock,
  "rich-text": createRichTextBlock,
  quote: createQuoteBlock,
  "dynamic-content": createDynamicContentBlock,
  product: createProductBlock,
  navigation: createNavigationBlock,
};

const DragItem: React.FC<{
  block: LandingPageBlock;
  index: number;
  isSelected: boolean;
  selectedElement?: "heading" | "subheading" | "button" | null;
  onSelect: () => void;
  onElementSelect?: (element: "heading" | "subheading" | "button" | null) => void;
  onUpdate: (props: Record<string, any>) => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  onAddBlock?: (blockIndex: number, block: LandingPageBlock) => void;
  onLinkSelect?: (linkIndex: number, linkType: "navigation" | "quick") => void;
  moveBlock: (dragIndex: number, hoverIndex: number) => void;
}> = ({
  block,
  index,
  isSelected,
  selectedElement,
  onSelect,
  onElementSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onAddBlock,
  onLinkSelect,
  moveBlock,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ["block", "panel-block"],
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: any) {
      if (!ref.current) return;

      // Handle reordering of existing blocks
      if (item.index !== undefined) {
        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) return;

        moveBlock(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
    },
    drop(item: any) {
      // Handle adding new block from panel
      if (item.blockData && onAddBlock && item.index === undefined) {
        onAddBlock(index + 1, item.blockData);
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "block",
    item: () => ({
      index,
      id: block.id,
    }),
    collect(monitor) {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });

  drag(drop(ref));

  const blockProps = {
    block,
    isSelected,
    selectedElement,
    onSelect,
    onElementSelect,
    onUpdate,
    onLinkSelect,
  };

  let blockContent;

  switch (block.type) {
    case "header":
      blockContent = <HeaderBlockPreview {...blockProps} />;
      break;
    case "hero":
      blockContent = <HeroBlockPreview {...blockProps} />;
      break;
    case "features":
      blockContent = <FeaturesBlockPreview {...blockProps} />;
      break;
    case "testimonials":
      blockContent = <TestimonialsBlockPreview {...blockProps} />;
      break;
    case "about":
      blockContent = <AboutBlockPreview {...blockProps} />;
      break;
    case "contact-form":
      blockContent = <ContactFormBlockPreview {...blockProps} />;
      break;
    case "footer":
      blockContent = <FooterBlockPreview {...blockProps} />;
      break;
    case "section-spacer":
      blockContent = <SpacerBlockPreview {...blockProps} />;
      break;
    case "pricing":
      blockContent = <PricingBlockPreview {...blockProps} />;
      break;
    case "faq":
      blockContent = <FaqBlockPreview {...blockProps} />;
      break;
    case "signup":
      blockContent = <SignupBlockPreview {...blockProps} />;
      break;
    case "pricing-footer":
      blockContent = <PricingFooterBlockPreview {...blockProps} />;
      break;
    case "heading":
      blockContent = <HeadingBlockPreview {...blockProps} />;
      break;
    case "paragraph":
      blockContent = <ParagraphBlockPreview {...blockProps} />;
      break;
    case "rich-text":
      blockContent = <RichTextBlockPreview {...blockProps} />;
      break;
    case "quote":
      blockContent = <QuoteBlockPreview {...blockProps} />;
      break;
    case "dynamic-content":
      blockContent = <DynamicContentBlockPreview {...blockProps} />;
      break;
    case "product":
      blockContent = <ProductBlockPreview {...blockProps} />;
      break;
    case "navigation":
      blockContent = <NavigationBlockPreview {...blockProps} />;
      break;
    default:
      blockContent = <div>Unknown block type</div>;
  }

  const handleAddBlock = (blockType: string) => {
    const creator =
      BLOCK_CREATORS[blockType as keyof typeof BLOCK_CREATORS];
    if (creator && onAddBlock) {
      const newBlock = creator();
      onAddBlock(index + 1, newBlock);
    }
  };

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={`relative transition-all rounded cursor-pointer group mb-8 ${
        isDragging ? "opacity-50" : ""
      } ${
        isSelected
          ? "border-2 border-solid border-valasys-orange shadow-lg shadow-orange-200"
          : isHovered
            ? "border-2 border-dashed border-valasys-orange"
            : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div onClick={onSelect}>{blockContent}</div>

      {isSelected && (
        <>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1 bg-white rounded-lg shadow-xl border border-valasys-orange p-3 z-50">
          <Button
            size="sm"
            variant="ghost"
            className="h-9 w-9 p-0 hover:bg-orange-50 hover:text-valasys-orange transition-colors"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            title="Duplicate block"
            onClick={(e) => {
              e.stopPropagation();
              if (onDuplicate) onDuplicate();
            }}
          >
            <Copy className="w-4 h-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-9 w-9 p-0 hover:bg-orange-50 hover:text-valasys-orange transition-colors"
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                title="Add block below"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem onClick={() => handleAddBlock("dynamic-content")}>
                Dynamic content
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("product")}>
                Product
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("navigation")}>
                Navigation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("header")}>
                Header
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("hero")}>
                Hero
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("features")}>
                Features
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("testimonials")}>
                Testimonials
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("about")}>
                About
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAddBlock("contact-form")}
              >
                Contact Form
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("footer")}>
                Footer
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAddBlock("section-spacer")}
              >
                Spacer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("pricing")}>
                Pricing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("faq")}>
                FAQ
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("signup")}>
                Signup
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAddBlock("pricing-footer")}
              >
                Pricing Footer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("heading")}>
                Heading
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("paragraph")}>
                Paragraph
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("rich-text")}>
                Rich Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("quote")}>
                Quote
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size="sm"
            variant="ghost"
            className="h-9 w-9 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            title="Delete block"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        </>
      )}
    </div>
  );
};

export const DraggableLandingPagePreview: React.FC<
  DraggableLandingPagePreviewProps
> = ({
  page,
  selectedBlockId,
  selectedElement,
  onSelectBlock,
  onElementSelect,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
  onDuplicateBlock,
  onReorderBlocks,
  onAddBlock,
  onLinkSelect,
}) => {
  const [blocks, setBlocks] = React.useState(page.blocks);

  React.useEffect(() => {
    setBlocks(page.blocks);
  }, [page.blocks]);

  const moveBlock = (dragIndex: number, hoverIndex: number) => {
    const dragBlock = blocks[dragIndex];
    const newBlocks = [...blocks];
    newBlocks.splice(dragIndex, 1);
    newBlocks.splice(hoverIndex, 0, dragBlock);
    setBlocks(newBlocks);
    onReorderBlocks(newBlocks);
  };

  const handleAddBlockAtIndex = (blockIndex: number, newBlock: LandingPageBlock) => {
    const newBlocks = [...blocks];
    newBlocks.splice(blockIndex, 0, newBlock);
    setBlocks(newBlocks);
    onReorderBlocks(newBlocks);
  };

  const renderBlock = (block: LandingPageBlock, index: number) => {
    const isSelected = selectedBlockId === block.id;

    return (
      <DragItem
        key={block.id}
        block={block}
        index={index}
        isSelected={isSelected}
        selectedElement={isSelected ? selectedElement : null}
        onSelect={() => {
          onSelectBlock(block.id);
        }}
        onElementSelect={onElementSelect}
        onUpdate={(props: Record<string, any>) =>
          onUpdateBlock(block.id, props)
        }
        onDelete={() => onDeleteBlock(block.id)}
        onDuplicate={() => onDuplicateBlock?.(block.id)}
        onAddBlock={onAddBlock ? handleAddBlockAtIndex : undefined}
        onLinkSelect={onLinkSelect ? (linkIndex, linkType) => onLinkSelect(block.id, linkIndex, linkType) : undefined}
        moveBlock={moveBlock}
      />
    );
  };

  // Drop zone at the end of canvas
  const EndDropZone: React.FC = () => {
    const ref = React.useRef<HTMLDivElement>(null);

    const [{ isOver }, drop] = useDrop({
      accept: "panel-block",
      collect(monitor) {
        return {
          isOver: monitor.isOver(),
        };
      },
      drop(item: any) {
        if (item.blockData && onAddBlock) {
          onAddBlock(blocks.length, item.blockData);
        }
      },
    });

    drop(ref);

    return (
      <div
        ref={ref}
        className={`transition-all py-8 border-2 border-dashed rounded-lg ${
          isOver
            ? "border-valasys-orange bg-orange-50"
            : "border-gray-300 bg-gray-50"
        }`}
      >
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {isOver
              ? "Drop block here"
              : "Drag blocks from left panel to add here"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden flex flex-col gap-4 p-4">
      {blocks.length === 0 && <EndDropZone />}
      {blocks.map((block, index) => renderBlock(block, index))}
      {blocks.length > 0 && <EndDropZone />}
    </div>
  );
};
