import React, { useState } from "react";
import { useDrag } from "react-dnd";
import {
  Type,
  Image,
  Grid2x2,
  MessageSquare,
  FileText,
  Phone,
  Layers,
  ChevronDown,
  ChevronRight,
  Layout,
  Settings,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  createContentImageBlock,
} from "./utils";
import { LandingPageBlock } from "./types";

interface BlocksPanelProps {
  onAddBlock: (block: LandingPageBlock) => void;
  onOpenSectionsPanel?: () => void;
}

interface BlockOption {
  id: string;
  icon: React.ReactNode;
  label: string;
  onCreate: () => LandingPageBlock;
}

interface Section {
  id: string;
  title: string;
  blocks: BlockOption[];
}

const DraggableBlockButton: React.FC<{
  block: BlockOption;
  onAddBlock: (block: LandingPageBlock) => void;
}> = ({ block, onAddBlock }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "panel-block",
    item: {
      blockType: block.id,
      blockData: block.onCreate(),
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const ref = React.useRef<HTMLButtonElement>(null);
  drag(ref);

  return (
    <button
      type="button"
      ref={ref}
      onClick={() => onAddBlock(block.onCreate())}
      className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all cursor-move ${
        isDragging
          ? "opacity-50 border-valasys-orange bg-orange-100"
          : "border-gray-200 hover:border-valasys-orange hover:bg-orange-50 hover:shadow-md"
      }`}
    >
      <div className="mb-2 text-valasys-orange">{block.icon}</div>
      <span className="text-xs font-medium text-gray-900 text-center">
        {block.label}
      </span>
    </button>
  );
};

export const BlocksPanel: React.FC<BlocksPanelProps> = ({
  onAddBlock,
  onOpenSectionsPanel,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["content-sections", "basics", "advanced", "footer"])
  );

  const sections: Section[] = [
    {
      id: "content-sections",
      title: "Content Sections",
      blocks: [
        {
          id: "dynamic-content",
          icon: <FileText className="w-6 h-6" />,
          label: "Dynamic content",
          onCreate: createDynamicContentBlock,
        },
        {
          id: "product",
          icon: <Grid2x2 className="w-6 h-6" />,
          label: "Product",
          onCreate: createProductBlock,
        },
        {
          id: "navigation",
          icon: <Layout className="w-6 h-6" />,
          label: "Navigation",
          onCreate: createNavigationBlock,
        },
        {
          id: "content-image",
          icon: <Image className="w-6 h-6" />,
          label: "Content + Image",
          onCreate: createContentImageBlock,
        },
      ],
    },
    {
      id: "basics",
      title: "Basic",
      blocks: [
        {
          id: "header",
          icon: <Layout className="w-6 h-6" />,
          label: "Header",
          onCreate: createHeaderBlock,
        },
        {
          id: "hero",
          icon: <Image className="w-6 h-6" />,
          label: "Hero",
          onCreate: createHeroBlock,
        },
        {
          id: "features",
          icon: <Grid2x2 className="w-6 h-6" />,
          label: "Features",
          onCreate: createFeaturesBlock,
        },
        {
          id: "cta-button",
          icon: <Type className="w-6 h-6" />,
          label: "Signup",
          onCreate: createSignupBlock,
        },
      ],
    },
    {
      id: "advanced",
      title: "Advanced",
      blocks: [
        {
          id: "testimonials",
          icon: <MessageSquare className="w-6 h-6" />,
          label: "Testimonials",
          onCreate: createTestimonialsBlock,
        },
        {
          id: "about",
          icon: <FileText className="w-6 h-6" />,
          label: "About",
          onCreate: createAboutBlock,
        },
        {
          id: "contact-form",
          icon: <Phone className="w-6 h-6" />,
          label: "Contact Form",
          onCreate: createContactFormBlock,
        },
        {
          id: "pricing",
          icon: <Settings className="w-6 h-6" />,
          label: "Pricing",
          onCreate: createPricingBlock,
        },
        {
          id: "faq",
          icon: <MessageSquare className="w-6 h-6" />,
          label: "FAQ",
          onCreate: createFaqBlock,
        },
      ],
    },
    {
      id: "footer",
      title: "Footer & Utility",
      blocks: [
        {
          id: "footer",
          icon: <Layers className="w-6 h-6" />,
          label: "Footer",
          onCreate: createFooterBlock,
        },
        {
          id: "pricing-footer",
          icon: <Settings className="w-6 h-6" />,
          label: "Pricing Footer",
          onCreate: createPricingFooterBlock,
        },
        {
          id: "spacer",
          icon: <Layers className="w-6 h-6" />,
          label: "Spacer",
          onCreate: createSectionSpacerBlock,
        },
      ],
    },
  ];

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const filteredSections = sections
    .map((section) => ({
      ...section,
      blocks: section.blocks.filter(
        (block) =>
          searchQuery === "" ||
          block.label.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((section) => section.blocks.length > 0);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <Input
          placeholder="Search blocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-sm"
        />
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto">
        {filteredSections.map((section) => (
          <div key={section.id} className="border-b border-gray-100 last:border-0">
            {/* Section Header */}
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">
                {section.title}
              </span>
              {expandedSections.has(section.id) ? (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )}
            </button>

            {/* Section Content */}
            {expandedSections.has(section.id) && (
              <div className="px-3 py-2 pb-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-2">
                  {section.blocks.map((block) => (
                    <DraggableBlockButton
                      key={block.id}
                      block={block}
                      onAddBlock={onAddBlock}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Templates Button */}
      {onOpenSectionsPanel && (
        <div className="border-t border-gray-200 p-4">
          <Button
            onClick={onOpenSectionsPanel}
            variant="outline"
            className="w-full"
            size="sm"
          >
            View Templates
          </Button>
        </div>
      )}
    </div>
  );
};
