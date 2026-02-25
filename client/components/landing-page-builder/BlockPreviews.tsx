import React from "react";
import { Menu, X, Copy, Trash2, Zap, Palette, Lock, Globe } from "lucide-react";
import { LandingPageBlock } from "./types";
import { EditableLink } from "./EditableLink";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Context for managing selection within blocks
const SelectionContext = React.createContext<{
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}>({
  selectedId: null,
  setSelectedId: () => {},
});

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  // Clear selection when clicking outside
  React.useEffect(() => {
    const handleClick = () => setSelectedId(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <SelectionContext.Provider value={{ selectedId, setSelectedId }}>
      {children}
    </SelectionContext.Provider>
  );
};

const HoverBorderWrapper: React.FC<{
  children: React.ReactNode;
  onDelete?: () => void;
  onDuplicate?: () => void;
  className?: string;
  isSelected?: boolean;
}> = ({ children, onDelete, onDuplicate, className, isSelected: initialIsSelected }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const { selectedId, setSelectedId } = React.useContext(SelectionContext);
  const id = React.useId();

  const isSelected = selectedId === id || initialIsSelected;

  return (
    <div
      className={cn(
        "relative transition-all group/editable",
        isSelected
          ? "border-2 border-solid border-valasys-orange rounded p-1"
          : isHovered
            ? "border-2 border-dotted border-valasys-orange rounded p-1"
            : "border-2 border-transparent p-1",
        className
      )}
      onMouseEnter={(e) => {
        e.stopPropagation();
        setIsHovered(true);
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        setIsHovered(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (isSelected) {
          setSelectedId(null);
        } else {
          setSelectedId(id);
        }
      }}
    >
      {children}
      {isSelected && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 bg-white rounded-lg shadow-xl border border-valasys-orange p-1 z-[100]">
          {onDuplicate && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 hover:bg-orange-50 hover:text-valasys-orange"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
                setSelectedId(null);
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

interface BlockPreviewProps {
  block: LandingPageBlock;
  isSelected: boolean;
  selectedElement?: "heading" | "subheading" | "button" | null;
  onSelect: () => void;
  onElementSelect?: (element: "heading" | "subheading" | "button" | null) => void;
  onUpdate: (props: Record<string, any>) => void;
  onLinkSelect?: (linkIndex: number, linkType: "navigation" | "quick") => void;
}

export const HeaderBlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  selectedElement,
  onSelect,
  onElementSelect,
  onUpdate,
  onLinkSelect,
}) => {
  const props = block.properties;
  const [hoveredLinkIndex, setHoveredLinkIndex] = React.useState<number | null>(null);
  const [selectedNavLinkIndex, setSelectedNavLinkIndex] = React.useState<number | null>(null);
  const [isEditingLogoText, setIsEditingLogoText] = React.useState(false);
  const [editLogoText, setEditLogoText] = React.useState(props.logoText || "");
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLinkUpdate = (index: number, label: string, href: string) => {
    const updated = [...(props.navigationLinks || [])];
    updated[index] = { label, href };
    onUpdate({ ...props, navigationLinks: updated });
  };

  const handleLogoTextSave = () => {
    if (editLogoText.trim()) {
      onUpdate({ ...props, logoText: editLogoText });
    }
    setIsEditingLogoText(false);
  };

  return (
    <div
      className="transition-all"
      style={{
        backgroundColor: props.backgroundColor || "#ffffff",
        width: props.width || "100%",
      }}
    >
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <HoverBorderWrapper
            onDelete={() => onUpdate({ ...props, logoUrl: "", logoText: "" })}
          >
            <div className="flex items-center gap-2">
              {props.logoUrl && (
                <img
                  src={props.logoUrl}
                  alt="Logo"
                  className="h-8 object-contain"
                />
              )}
              {isEditingLogoText ? (
                <input
                  type="text"
                  value={editLogoText}
                  onChange={(e) => setEditLogoText(e.target.value)}
                  onBlur={handleLogoTextSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLogoTextSave();
                    if (e.key === 'Escape') {
                      setEditLogoText(props.logoText || "");
                      setIsEditingLogoText(false);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="font-bold text-gray-900 px-2 py-1 border border-orange-300 rounded focus:outline-none w-24"
                  autoFocus
                />
              ) : (
                <div
                  className="font-bold text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditLogoText(props.logoText || "");
                    setIsEditingLogoText(true);
                  }}
                >
                  {props.logoText}
                </div>
              )}
            </div>
          </HoverBorderWrapper>
        </div>

        {/* Desktop Navigation (hidden on mobile) */}
        <div className="hidden md:flex preview-desktop-only gap-4 text-sm text-gray-600 items-center">
          {props.navigationLinks?.map((link: any, i: number) => (
            <HoverBorderWrapper
              key={i}
              onDelete={() => {
                const updated = props.navigationLinks.filter((_: any, idx: number) => idx !== i);
                onUpdate({ ...props, navigationLinks: updated });
              }}
              onDuplicate={() => {
                const updated = [...props.navigationLinks];
                updated.splice(i + 1, 0, { ...link });
                onUpdate({ ...props, navigationLinks: updated });
              }}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNavLinkIndex(i);
                  onLinkSelect?.(i, "navigation");
                }}
                onMouseEnter={() => setHoveredLinkIndex(i)}
                onMouseLeave={() => setHoveredLinkIndex(null)}
                className="hover:text-gray-900 cursor-pointer transition-all"
              >
                <EditableLink
                  label={link.label}
                  href={link.href}
                  onUpdate={(label, href) => handleLinkUpdate(i, label, href)}
                  inline={true}
                  isSelected={selectedNavLinkIndex === i}
                  isHovered={hoveredLinkIndex === i}
                />
              </div>
            </HoverBorderWrapper>
          ))}
          <HoverBorderWrapper
            onDelete={() => onUpdate({ ...props, ctaButtonText: "" })}
          >
            <button className="px-4 py-2 bg-valasys-orange text-white text-sm font-medium rounded hover:bg-orange-600 transition-colors whitespace-nowrap">
              {props.ctaButtonText}
            </button>
          </HoverBorderWrapper>
        </div>

        {/* Mobile Hamburger Menu (visible only on mobile) */}
        <div className="md:hidden preview-mobile-only flex items-center gap-2">
          <HoverBorderWrapper
            onDelete={() => onUpdate({ ...props, ctaButtonText: "" })}
          >
            <button className="px-3 py-2 bg-valasys-orange text-white text-xs font-medium rounded hover:bg-orange-600 transition-colors whitespace-nowrap">
              {props.ctaButtonText}
            </button>
          </HoverBorderWrapper>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Menu Dropdown - Visible when hamburger is clicked (mobile only) */}
      {isMenuOpen && (
        <div className="bg-gray-700 border-t border-gray-600">
          <div className="flex flex-col px-4 py-4 space-y-3">
            {props.navigationLinks?.map((link: any, i: number) => (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNavLinkIndex(i);
                  onLinkSelect?.(i, "navigation");
                }}
                onMouseEnter={() => setHoveredLinkIndex(i)}
                onMouseLeave={() => setHoveredLinkIndex(null)}
                className={`py-2 px-3 rounded text-base font-medium cursor-pointer transition-all ${
                  selectedNavLinkIndex === i
                    ? "bg-valasys-orange text-white"
                    : "text-gray-100 hover:bg-gray-600"
                }`}
              >
                {link.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const HeroBlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  selectedElement,
  onSelect,
  onElementSelect,
  onUpdate,
}) => {
  const props = block.properties;
  const [isEditingHeading, setIsEditingHeading] = React.useState(false);
  const [editHeadingText, setEditHeadingText] = React.useState(props.headline || "");
  const [isEditingSubheading, setIsEditingSubheading] = React.useState(false);
  const [editSubheadingText, setEditSubheadingText] = React.useState(props.subheading || "");
  const [isEditingButton, setIsEditingButton] = React.useState(false);
  const [editButtonText, setEditButtonText] = React.useState(props.ctaButtonText || "");
  const [hoveredElement, setHoveredElement] = React.useState<"heading" | "subheading" | "button" | null | string>(null);
  const [selectedCopyElement, setSelectedCopyElement] = React.useState<string | null>(null);
  const headingTextareaRef = React.useRef<HTMLTextAreaElement>(null);
  const subheadingTextareaRef = React.useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // Element order management - default order is heading, subheading, button
  const elementOrder = props.elementOrder || ["heading", "subheading", "button"];

  const handleElementDrop = (draggedElementId: string, targetElementId: string) => {
    const draggedIdx = elementOrder.indexOf(draggedElementId as any);
    const targetIdx = elementOrder.indexOf(targetElementId as any);

    if (draggedIdx !== -1 && targetIdx !== -1 && draggedIdx !== targetIdx) {
      const newOrder = [...elementOrder];
      newOrder.splice(draggedIdx, 1);
      newOrder.splice(targetIdx, 0, draggedElementId as any);
      onUpdate?.({ ...props, elementOrder: newOrder });
    }
  };

  const handleHeadlineSave = () => {
    if (editHeadingText.trim()) {
      onUpdate?.({ ...props, headline: editHeadingText });
    }
    setIsEditingHeading(false);
  };

  const handleSubheadingSave = () => {
    if (editSubheadingText.trim()) {
      onUpdate?.({ ...props, subheading: editSubheadingText });
    }
    setIsEditingSubheading(false);
  };

  const handleButtonSave = () => {
    if (editButtonText.trim()) {
      onUpdate?.({ ...props, ctaButtonText: editButtonText });
    }
    setIsEditingButton(false);
  };

  const handleCopyHeading = () => {
    const headlines = props.headlines || [];
    onUpdate?.({ ...props, headlines: [...headlines, { text: props.headline }] });
    onElementSelect?.(null);
  };

  const handleDeleteHeading = (index?: number) => {
    if (index === undefined) {
      onUpdate?.({ ...props, headline: "" });
    } else {
      const headlines = props.headlines || [];
      onUpdate?.({ ...props, headlines: headlines.filter((_, i) => i !== index) });
    }
    onElementSelect?.(null);
  };

  const handleCopySubheading = () => {
    const subheadings = props.subheadings || [];
    onUpdate?.({ ...props, subheadings: [...subheadings, { text: props.subheading }] });
    onElementSelect?.(null);
  };

  const handleDeleteSubheading = (index?: number) => {
    if (index === undefined) {
      onUpdate?.({ ...props, subheading: "" });
    } else {
      const subheadings = props.subheadings || [];
      onUpdate?.({ ...props, subheadings: subheadings.filter((_, i) => i !== index) });
    }
    onElementSelect?.(null);
  };

  const handleCopyButton = () => {
    const buttons = props.buttons || [];
    onUpdate?.({ ...props, buttons: [...buttons, { text: props.ctaButtonText, color: props.ctaButtonColor }] });
    onElementSelect?.(null);
  };

  const handleDeleteButton = (index?: number) => {
    if (index === undefined) {
      onUpdate?.({ ...props, ctaButtonText: "" });
    } else {
      const buttons = props.buttons || [];
      onUpdate?.({ ...props, buttons: buttons.filter((_, i) => i !== index) });
    }
    onElementSelect?.(null);
  };

  const renderHeadingElement = () => {
    // Only render if heading has content or is being edited
    if (!props.headline && !isEditingHeading) {
      return null;
    }

    return (
      <HoverBorderWrapper
        onDelete={() => handleDeleteHeading()}
        onDuplicate={() => handleCopyHeading()}
        className="mb-4 w-full"
      >
        <div
          draggable
          className="relative px-4 py-2 rounded transition-all w-full cursor-move"
          onDragStart={(e) => {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", "heading");
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          }}
          onDrop={(e) => {
            e.preventDefault();
            const draggedId = e.dataTransfer.getData("text/plain");
            if (draggedId && draggedId !== "heading") {
              handleElementDrop(draggedId, "heading");
            }
          }}
        >
          {isEditingHeading ? (
            <textarea
              ref={headingTextareaRef}
              value={editHeadingText}
              onChange={(e) => {
                setEditHeadingText(e.target.value);
                adjustTextareaHeight(headingTextareaRef.current);
              }}
              onBlur={handleHeadlineSave}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setEditHeadingText(props.headline || "");
                  setIsEditingHeading(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="text-2xl md:text-5xl font-bold text-gray-900 px-2 py-1 focus:outline-none bg-transparent resize-none overflow-hidden whitespace-pre-wrap break-words"
              style={{
                width: props.headlineWidth ?? "100%",
                height: props.headlineHeight ?? "auto",
                textAlign: (props.headlineAlign || "center") as any,
              }}
              autoFocus
              onFocus={(e) => {
                setTimeout(() => adjustTextareaHeight(e.target as HTMLTextAreaElement), 0);
              }}
            />
          ) : (
            <h1
              className="text-2xl md:text-5xl font-bold cursor-text break-words"
              style={{
                color: props.headlineColor || "#1f2937",
                wordBreak: "break-word",
                width: props.headlineWidth ?? "100%",
                height: props.headlineHeight ?? "auto",
                textAlign: (props.headlineAlign || "center") as any,
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setEditHeadingText(props.headline || "");
                setIsEditingHeading(true);
              }}
            >
              {props.headline}
            </h1>
          )}
        </div>
      </HoverBorderWrapper>
    );
  };

  const renderSubheadingElement = () => {
    // Only render if subheading has content or is being edited
    if (!props.subheading && !isEditingSubheading) {
      return null;
    }

    return (
      <div
        draggable
        className={`relative mb-8 px-4 py-2 rounded transition-all w-full cursor-move group ${
          selectedElement === "subheading" ? "border-2 border-solid border-valasys-orange" :
          hoveredElement === "subheading" ? "border-2 border-dotted border-valasys-orange" : ""
        }`}
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", "subheading");
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        onDrop={(e) => {
          e.preventDefault();
          const draggedId = e.dataTransfer.getData("text/plain");
          if (draggedId && draggedId !== "subheading") {
            handleElementDrop(draggedId, "subheading");
          }
        }}
        onMouseEnter={() => !isEditingSubheading && setHoveredElement("subheading")}
        onMouseLeave={() => setHoveredElement(null)}
        onClick={(e) => {
          e.stopPropagation();
          onElementSelect?.("subheading");
        }}
      >
        {isEditingSubheading ? (
          <textarea
            ref={subheadingTextareaRef}
            value={editSubheadingText}
            onChange={(e) => {
              setEditSubheadingText(e.target.value);
              adjustTextareaHeight(subheadingTextareaRef.current);
            }}
            onBlur={handleSubheadingSave}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setEditSubheadingText(props.subheading || "");
                setIsEditingSubheading(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="text-sm md:text-xl text-gray-600 px-2 py-1 focus:outline-none bg-transparent resize-none overflow-hidden whitespace-pre-wrap break-words"
            style={{
              width: props.subheadingWidth ?? "100%",
              height: props.subheadingHeight ?? "auto",
              textAlign: (props.subheadingAlign || "center") as any,
            }}
            autoFocus
            onFocus={(e) => {
              setTimeout(() => adjustTextareaHeight(e.target as HTMLTextAreaElement), 0);
            }}
          />
        ) : (
          <p
            className="text-sm md:text-xl cursor-text break-words"
            style={{
              color: props.subheadingColor || "#4b5563",
              wordBreak: "break-word",
              width: props.subheadingWidth ?? "100%",
              height: props.subheadingHeight ?? "auto",
              textAlign: (props.subheadingAlign || "center") as any,
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setEditSubheadingText(props.subheading || "");
              setIsEditingSubheading(true);
            }}
          >
            {props.subheading}
          </p>
        )}

        {selectedElement === "subheading" && (
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex gap-1 bg-white rounded-lg border border-valasys-orange p-2 z-50 mt-2">
            <button
              className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-valasys-orange transition-colors flex items-center justify-center rounded"
              title="Copy subheading"
              onClick={(e) => {
                e.stopPropagation();
                handleCopySubheading();
              }}
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center rounded"
              title="Delete subheading"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSubheading();
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderButtonElement = () => {
    // Only render if button has content or is being edited
    if (!props.ctaButtonText && !isEditingButton) {
      return null;
    }

    return (
      <div
        draggable
        className={`relative w-full px-4 py-2 rounded transition-all cursor-move group ${
          selectedElement === "button" ? "border-2 border-solid border-valasys-orange" :
          hoveredElement === "button" ? "border-2 border-dotted border-valasys-orange" : ""
        }`}
        style={{
          textAlign: (props.ctaButtonAlign || "center") as any,
        }}
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", "button");
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        onDrop={(e) => {
          e.preventDefault();
          const draggedId = e.dataTransfer.getData("text/plain");
          if (draggedId && draggedId !== "button") {
            handleElementDrop(draggedId, "button");
          }
        }}
        onMouseEnter={() => !isEditingButton && setHoveredElement("button")}
        onMouseLeave={() => setHoveredElement(null)}
        onClick={(e) => {
          e.stopPropagation();
          onElementSelect?.("button");
        }}
      >
        {isEditingButton ? (
          <input
            type="text"
            value={editButtonText}
            onChange={(e) => setEditButtonText(e.target.value)}
            onBlur={handleButtonSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleButtonSave();
              if (e.key === "Escape") {
                setEditButtonText(props.ctaButtonText || "");
                setIsEditingButton(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="px-6 md:px-8 py-2 md:py-3 rounded focus:outline-none text-sm md:text-base"
            style={{ backgroundColor: props.ctaButtonColor || "#FF6A00", color: "white" }}
            autoFocus
          />
        ) : (
          <button
            style={{
              backgroundColor: props.ctaButtonColor,
              color: props.ctaButtonTextColor || "#ffffff",
              width: props.ctaButtonWidth || "auto",
              height: props.ctaButtonHeight || "auto"
            }}
            className="px-6 md:px-8 py-2 md:py-3 font-medium rounded hover:opacity-90 transition-opacity text-sm md:text-base cursor-text"
            onDoubleClick={(e) => {
              e.stopPropagation();
              setEditButtonText(props.ctaButtonText || "");
              setIsEditingButton(true);
            }}
          >
            {props.ctaButtonText}
          </button>
        )}

        {selectedElement === "button" && (
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex gap-1 bg-white rounded-lg border border-valasys-orange p-2 z-50 mt-2">
            <button
              className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-valasys-orange transition-colors flex items-center justify-center rounded"
              title="Copy button"
              onClick={(e) => {
                e.stopPropagation();
                handleCopyButton();
              }}
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center rounded"
              title="Delete button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteButton();
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="transition-all bg-cover bg-center relative"
      style={{
        backgroundColor: props.backgroundColor || "#f3f4f6",
        backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: props.minHeight || "500px",
        width: props.width || "100%",
      }}
    >
      {props.backgroundImage && props.overlayOpacity > 0 && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: props.overlayOpacity / 100, zIndex: 1 }}
        />
      )}
      <div className="relative flex flex-col items-center justify-center h-full px-4 md:px-8 py-8 md:py-16 text-center" style={{ zIndex: 2 }}>
        {/* Dynamically render elements in order */}
        {elementOrder.map((elementType) => {
          if (elementType === "heading") return <React.Fragment key="heading">{renderHeadingElement()}</React.Fragment>;
          if (elementType === "subheading") return <React.Fragment key="subheading">{renderSubheadingElement()}</React.Fragment>;
          if (elementType === "button") return <React.Fragment key="button">{renderButtonElement()}</React.Fragment>;
          return null;
        })}

        {/* Additional Copied Headlines */}
        {props.headlines?.map((heading: any, idx: number) => (
          <div
            key={idx}
            className={`relative mb-4 px-4 py-2 rounded transition-all ${
              selectedCopyElement === `heading-${idx}` ? "border-2 border-solid border-valasys-orange" :
              hoveredElement === `heading-${idx}` ? "border-2 border-dotted border-valasys-orange" : ""
            }`}
            onMouseEnter={() => setHoveredElement(`heading-${idx}`)}
            onMouseLeave={() => setHoveredElement(null)}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCopyElement(`heading-${idx}`);
            }}
          >
            <h1 className="text-2xl md:text-5xl font-bold text-gray-900">
              {heading.text}
            </h1>

            {selectedCopyElement === `heading-${idx}` && (
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex gap-1 bg-white rounded-lg border border-valasys-orange p-2 z-50 mt-2">
                <button
                  className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-valasys-orange transition-colors flex items-center justify-center rounded"
                  title="Copy heading"
                  onClick={(e) => {
                    e.stopPropagation();
                    const headlines = props.headlines || [];
                    onUpdate?.({ ...props, headlines: [...headlines, { text: heading.text }] });
                  }}
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center rounded"
                  title="Delete heading"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteHeading(idx);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Additional Copied Subheadings */}
        {props.subheadings?.map((subheading: any, idx: number) => (
          <div
            key={idx}
            className={`relative mb-8 px-4 py-2 rounded transition-all max-w-2xl ${
              selectedCopyElement === `subheading-${idx}` ? "border-2 border-solid border-valasys-orange" :
              hoveredElement === `subheading-${idx}` ? "border-2 border-dotted border-valasys-orange" : ""
            }`}
            onMouseEnter={() => setHoveredElement(`subheading-${idx}`)}
            onMouseLeave={() => setHoveredElement(null)}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCopyElement(`subheading-${idx}`);
            }}
          >
            <p className="text-sm md:text-xl text-gray-600">
              {subheading.text}
            </p>

            {selectedCopyElement === `subheading-${idx}` && (
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex gap-1 bg-white rounded-lg border border-valasys-orange p-2 z-50 mt-2">
                <button
                  className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-valasys-orange transition-colors flex items-center justify-center rounded"
                  title="Copy subheading"
                  onClick={(e) => {
                    e.stopPropagation();
                    const subheadings = props.subheadings || [];
                    onUpdate?.({ ...props, subheadings: [...subheadings, { text: subheading.text }] });
                  }}
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center rounded"
                  title="Delete subheading"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSubheading(idx);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Additional Copied Buttons */}
        {props.buttons?.map((button: any, idx: number) => (
          <div
            key={idx}
            className={`relative px-4 py-2 rounded transition-all mt-3 ${
              selectedCopyElement === `button-${idx}` ? "border-2 border-solid border-valasys-orange" :
              hoveredElement === `button-${idx}` ? "border-2 border-dotted border-valasys-orange" : ""
            }`}
            onMouseEnter={() => !isEditingButton && setHoveredElement(`button-${idx}`)}
            onMouseLeave={() => setHoveredElement(null)}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCopyElement(`button-${idx}`);
            }}
          >
            <button
              style={{ backgroundColor: button.color || props.ctaButtonColor || "#FF6A00" }}
              className="px-6 md:px-8 py-2 md:py-3 text-white font-medium rounded hover:opacity-90 transition-opacity text-sm md:text-base cursor-text"
            >
              {button.text}
            </button>

            {selectedCopyElement === `button-${idx}` && (
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex gap-1 bg-white rounded-lg border border-valasys-orange p-2 z-50 mt-2">
                <button
                  className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-valasys-orange transition-colors flex items-center justify-center rounded"
                  title="Copy button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const buttons = props.buttons || [];
                    onUpdate?.({ ...props, buttons: [...buttons, { text: button.text, color: button.color }] });
                  }}
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center rounded"
                  title="Delete button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteButton(idx);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}

        {props.secondaryButtonText && (
          <button
            style={{
              backgroundColor: props.secondaryButtonColor,
              color: props.secondaryButtonTextColor,
            }}
            className="px-6 md:px-8 py-2 md:py-3 font-medium rounded hover:opacity-90 transition-opacity border border-gray-300 text-sm md:text-base mt-3"
          >
            {props.secondaryButtonText}
          </button>
        )}
      </div>
    </div>
  );
};

const FeatureIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case "⚡":
    case "Zap":
      return <Zap className="w-10 h-10 md:w-12 md:h-12 text-yellow-500 fill-yellow-400 stroke-black stroke-[1.5px]" />;
    case "🎨":
    case "Palette":
      return <Palette className="w-10 h-10 md:w-12 md:h-12 text-yellow-500 fill-yellow-400 stroke-black stroke-[1.5px]" />;
    case "🔒":
    case "Lock":
      return <Lock className="w-10 h-10 md:w-12 md:h-12 text-yellow-500 fill-yellow-400 stroke-black stroke-[1.5px]" />;
    case "🌐":
    case "Globe":
      return <Globe className="w-10 h-10 md:w-12 md:h-12 text-blue-500 fill-blue-400 stroke-black stroke-[1.5px]" />;
    default:
      return <div className="text-3xl md:text-4xl">{icon}</div>;
  }
};

export const FeaturesBlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const props = block.properties;
  return (
    <div
      className="transition-all"
      style={{
        backgroundColor: props.backgroundColor || "#ffffff",
        width: props.width || "100%",
      }}
    >
      <div className="px-4 md:px-8 py-8 md:py-16">
        <HoverBorderWrapper
          onDelete={() => onUpdate({ ...props, heading: "" })}
          onDuplicate={() => {
            const headlines = props.extraHeadlines || [];
            onUpdate({ ...props, extraHeadlines: [...headlines, props.heading] });
          }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">
            {props.heading}
          </h2>
        </HoverBorderWrapper>

        {props.extraHeadlines?.map((h: string, i: number) => (
          <HoverBorderWrapper
            key={i}
            onDelete={() => {
              const headlines = props.extraHeadlines.filter((_: any, idx: number) => idx !== i);
              onUpdate({ ...props, extraHeadlines: headlines });
            }}
            onDuplicate={() => {
              const headlines = [...props.extraHeadlines];
              headlines.splice(i + 1, 0, h);
              onUpdate({ ...props, extraHeadlines: headlines });
            }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">
              {h}
            </h2>
          </HoverBorderWrapper>
        ))}

        <HoverBorderWrapper
          onDelete={() => onUpdate({ ...props, description: "" })}
          onDuplicate={() => {
            const descriptions = props.extraDescriptions || [];
            onUpdate({ ...props, extraDescriptions: [...descriptions, props.description] });
          }}
        >
          <p className="text-center text-sm md:text-base text-gray-600 mb-8 md:mb-12">{props.description}</p>
        </HoverBorderWrapper>

        {props.extraDescriptions?.map((d: string, i: number) => (
          <HoverBorderWrapper
            key={i}
            onDelete={() => {
              const descriptions = props.extraDescriptions.filter((_: any, idx: number) => idx !== i);
              onUpdate({ ...props, extraDescriptions: descriptions });
            }}
            onDuplicate={() => {
              const descriptions = [...props.extraDescriptions];
              descriptions.splice(i + 1, 0, d);
              onUpdate({ ...props, extraDescriptions: descriptions });
            }}
          >
            <p className="text-center text-sm md:text-base text-gray-600 mb-8 md:mb-12">{d}</p>
          </HoverBorderWrapper>
        ))}
        <div
          className="gap-4 md:gap-8"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))`,
          }}
        >
          {props.features?.map((feature: any, featureIndex: number) => (
            <HoverBorderWrapper
              key={feature.id}
              onDelete={() => {
                const newFeatures = props.features.filter((f: any) => f.id !== feature.id);
                onUpdate({ ...props, features: newFeatures });
              }}
              onDuplicate={() => {
                const newFeature = { ...feature, id: `feature-${Date.now()}` };
                const newFeatures = [...props.features];
                newFeatures.splice(featureIndex + 1, 0, newFeature);
                onUpdate({ ...props, features: newFeatures });
              }}
            >
              <div className="text-center flex flex-col items-center">
                <HoverBorderWrapper
                  className="mb-4"
                  onDelete={() => {
                    const newFeatures = [...props.features];
                    newFeatures[featureIndex] = { ...feature, icon: "" };
                    onUpdate({ ...props, features: newFeatures });
                  }}
                >
                  <FeatureIcon icon={feature.icon} />
                </HoverBorderWrapper>
                <HoverBorderWrapper
                  onDelete={() => {
                    const newFeatures = [...props.features];
                    newFeatures[featureIndex] = { ...feature, title: "" };
                    onUpdate({ ...props, features: newFeatures });
                  }}
                >
                  <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                </HoverBorderWrapper>
                <HoverBorderWrapper
                  onDelete={() => {
                    const newFeatures = [...props.features];
                    newFeatures[featureIndex] = { ...feature, description: "" };
                    onUpdate({ ...props, features: newFeatures });
                  }}
                >
                  <p className="text-xs md:text-sm text-gray-600">{feature.description}</p>
                </HoverBorderWrapper>
              </div>
            </HoverBorderWrapper>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TestimonialsBlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const props = block.properties;
  return (
    <div
      className="transition-all"
      style={{
        backgroundColor: props.backgroundColor || "#ffffff",
        width: props.width || "100%",
      }}
    >
      <div className="px-4 md:px-8 py-8 md:py-16">
        <HoverBorderWrapper
          onDelete={() => onUpdate({ ...props, heading: "" })}
          onDuplicate={() => {
            onUpdate({ ...props, heading: props.heading + " (Copy)" });
          }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">
            {props.heading}
          </h2>
        </HoverBorderWrapper>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {props.testimonials?.map((testimonial: any, index: number) => (
            <HoverBorderWrapper
              key={testimonial.id}
              onDelete={() => {
                const newTestimonials = props.testimonials.filter((t: any) => t.id !== testimonial.id);
                onUpdate({ ...props, testimonials: newTestimonials });
              }}
              onDuplicate={() => {
                const newTestimonial = { ...testimonial, id: `testimonial-${Date.now()}` };
                const newTestimonials = [...props.testimonials];
                newTestimonials.splice(index + 1, 0, newTestimonial);
                onUpdate({ ...props, testimonials: newTestimonials });
              }}
            >
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200 h-full">
                <HoverBorderWrapper
                  onDelete={() => {
                    const newTestimonials = [...props.testimonials];
                    newTestimonials[index] = { ...testimonial, quote: "" };
                    onUpdate({ ...props, testimonials: newTestimonials });
                  }}
                >
                  <p className="text-sm md:text-base text-gray-600 mb-4">{testimonial.quote}</p>
                </HoverBorderWrapper>
                <div>
                  <HoverBorderWrapper
                    onDelete={() => {
                      const newTestimonials = [...props.testimonials];
                      newTestimonials[index] = { ...testimonial, author: "" };
                      onUpdate({ ...props, testimonials: newTestimonials });
                    }}
                  >
                    <p className="font-semibold text-sm md:text-base text-gray-900">
                      {testimonial.author}
                    </p>
                  </HoverBorderWrapper>
                  <HoverBorderWrapper
                    onDelete={() => {
                      const newTestimonials = [...props.testimonials];
                      newTestimonials[index] = { ...testimonial, role: "" };
                      onUpdate({ ...props, testimonials: newTestimonials });
                    }}
                  >
                    <p className="text-xs md:text-sm text-gray-600">{testimonial.role}</p>
                  </HoverBorderWrapper>
                </div>
              </div>
            </HoverBorderWrapper>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AboutBlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const props = block.properties;
  return (
    <div
      className="transition-all"
      style={{
        backgroundColor: props.backgroundColor || "#ffffff",
        width: props.width || "100%",
      }}
    >
      <div className="px-4 md:px-8 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          {props.imagePosition === "left" && (
            <HoverBorderWrapper
              onDelete={() => onUpdate({ ...props, imageUrl: "" })}
            >
              <div className="h-40 md:h-64 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Image</span>
              </div>
            </HoverBorderWrapper>
          )}
          <div>
            <HoverBorderWrapper
              onDelete={() => onUpdate({ ...props, heading: "" })}
              onDuplicate={() => {
                onUpdate({ ...props, heading: props.heading + " (Copy)" });
              }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {props.heading}
              </h2>
            </HoverBorderWrapper>
            <HoverBorderWrapper
              onDelete={() => onUpdate({ ...props, content: "" })}
              onDuplicate={() => {
                onUpdate({ ...props, content: props.content + " (Copy)" });
              }}
            >
              <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
                {props.content}
              </p>
            </HoverBorderWrapper>
            {props.cta && (
              <HoverBorderWrapper
                onDelete={() => onUpdate({ ...props, cta: null })}
              >
                <button className="px-6 py-2 bg-valasys-orange text-white text-sm md:text-base font-medium rounded hover:bg-orange-600 transition-colors">
                  {props.cta?.text}
                </button>
              </HoverBorderWrapper>
            )}
          </div>
          {props.imagePosition === "right" && (
            <HoverBorderWrapper
              onDelete={() => onUpdate({ ...props, imageUrl: "" })}
            >
              <div className="h-40 md:h-64 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Image</span>
              </div>
            </HoverBorderWrapper>
          )}
        </div>
      </div>
    </div>
  );
};

export const ContactFormBlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const props = block.properties;
  return (
    <div
      className="transition-all"
      style={{
        backgroundColor: props.backgroundColor || "#ffffff",
        width: props.width || "100%",
      }}
    >
      <div className="px-4 md:px-8 py-8 md:py-16 max-w-2xl mx-auto">
        <HoverBorderWrapper
          onDelete={() => onUpdate({ ...props, heading: "" })}
          onDuplicate={() => {
            onUpdate({ ...props, heading: props.heading + " (Copy)" });
          }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {props.heading}
          </h2>
        </HoverBorderWrapper>
        <HoverBorderWrapper
          onDelete={() => onUpdate({ ...props, description: "" })}
          onDuplicate={() => {
            onUpdate({ ...props, description: props.description + " (Copy)" });
          }}
        >
          <p className="text-sm md:text-base text-gray-600 mb-8">{props.description}</p>
        </HoverBorderWrapper>
        <form className="space-y-4">
          {props.fields?.map((field: any, index: number) => (
            <HoverBorderWrapper
              key={field.id}
              onDelete={() => {
                const newFields = props.fields.filter((f: any) => f.id !== field.id);
                onUpdate({ ...props, fields: newFields });
              }}
              onDuplicate={() => {
                const newField = { ...field, id: `field-${Date.now()}` };
                const newFields = [...props.fields];
                newFields.splice(index + 1, 0, newField);
                onUpdate({ ...props, fields: newFields });
              }}
            >
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-900 mb-2">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-valasys-orange text-sm"
                    rows={4}
                  />
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-valasys-orange text-sm"
                  />
                )}
              </div>
            </HoverBorderWrapper>
          ))}
          <HoverBorderWrapper
            onDelete={() => onUpdate({ ...props, submitButtonText: "" })}
          >
            <button
              type="button"
              style={{ backgroundColor: props.submitButtonColor }}
              className="w-full py-3 text-white text-sm md:text-base font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              {props.submitButtonText}
            </button>
          </HoverBorderWrapper>
        </form>
      </div>
    </div>
  );
};

export const FooterBlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onLinkSelect,
}) => {
  const props = block.properties;
  const [hoveredQuickLinkIndex, setHoveredQuickLinkIndex] = React.useState<number | null>(null);
  const [selectedQuickLinkIndex, setSelectedQuickLinkIndex] = React.useState<number | null>(null);

  const handleQuickLinkUpdate = (index: number, label: string, href: string) => {
    const updated = [...(props.quickLinks || [])];
    updated[index] = { label, href };
    onUpdate({ ...props, quickLinks: updated });
  };

  return (
    <div
      className="transition-all"
      style={{
        backgroundColor: props.backgroundColor || "#1f2937",
        color: props.textColor,
        width: props.width || "100%",
      }}
    >
      <div className="px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <HoverBorderWrapper
              onDelete={() => onUpdate({ ...props, companyName: "" })}
            >
              <h3 className="font-bold mb-2 text-sm md:text-base">{props.companyName}</h3>
            </HoverBorderWrapper>
            <HoverBorderWrapper
              onDelete={() => onUpdate({ ...props, companyDescription: "" })}
            >
              <p className="text-xs md:text-sm opacity-75">{props.companyDescription}</p>
            </HoverBorderWrapper>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm md:text-base">Quick Links</h4>
            <div className="space-y-2">
              {props.quickLinks?.map((link: any, i: number) => (
                <div
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedQuickLinkIndex(i);
                    onLinkSelect?.(i, "quick");
                  }}
                  onMouseEnter={() => setHoveredQuickLinkIndex(i)}
                  onMouseLeave={() => setHoveredQuickLinkIndex(null)}
                  className="text-xs md:text-sm opacity-75 hover:opacity-100 cursor-pointer transition-all"
                >
                  <EditableLink
                    label={link.label}
                    href={link.href}
                    onUpdate={(label, href) => handleQuickLinkUpdate(i, label, href)}
                    inline={true}
                    isSelected={selectedQuickLinkIndex === i}
                    isHovered={hoveredQuickLinkIndex === i}
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm md:text-base">Contact</h4>
            <p className="text-xs md:text-sm opacity-75 mb-2">
              {props.contactInfo?.email}
            </p>
            <p className="text-xs md:text-sm opacity-75">{props.contactInfo?.phone}</p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 md:pt-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <p className="text-xs md:text-sm opacity-75 text-center md:text-left">
            © 2024 {props.companyName}. All rights reserved.
          </p>
          <div className="flex gap-4">
            {props.socialLinks?.map((social: any) => (
              <span key={social.platform} className="text-xs md:text-sm opacity-75">
                {social.platform}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SpacerBlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const props = block.properties;
  return (
    <div
      onClick={onSelect}
      style={{ height: props.height || "60px" }}
      className={`border border-dotted cursor-pointer transition-all ${
        isSelected
          ? "border-orange-300 bg-orange-50"
          : "border-gray-300 bg-gray-50"
      }`}
    />
  );
};

export const PricingBlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const props = block.properties;
  return (
    <div
      className="transition-all"
      style={{
        backgroundColor: props.backgroundColor || "#ffffff",
        width: props.width || "100%",
      }}
    >
      <div className="px-4 md:px-8 py-8 md:py-16">
        <HoverBorderWrapper
          onDelete={() => onUpdate({ ...props, heading: "" })}
          onDuplicate={() => {
            onUpdate({ ...props, heading: props.heading + " (Copy)" });
          }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">
            {props.heading}
          </h2>
        </HoverBorderWrapper>
        <HoverBorderWrapper
          onDelete={() => onUpdate({ ...props, subheading: "" })}
          onDuplicate={() => {
            onUpdate({ ...props, subheading: props.subheading + " (Copy)" });
          }}
        >
          <p className="text-center text-sm md:text-base text-gray-600 mb-8 md:mb-12">{props.subheading}</p>
        </HoverBorderWrapper>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {props.pricingTiers?.map((tier: any, index: number) => (
            <HoverBorderWrapper
              key={tier.id}
              onDelete={() => {
                const newTiers = props.pricingTiers.filter((t: any) => t.id !== tier.id);
                onUpdate({ ...props, pricingTiers: newTiers });
              }}
              onDuplicate={() => {
                const newTier = { ...tier, id: `tier-${Date.now()}` };
                const newTiers = [...props.pricingTiers];
                newTiers.splice(index + 1, 0, newTier);
                onUpdate({ ...props, pricingTiers: newTiers });
              }}
            >
              <div
                className={`rounded-lg p-6 md:p-8 text-center transition-all h-full ${
                  tier.isHighlighted
                    ? "bg-gray-900 text-white shadow-lg md:scale-105"
                    : "bg-white border border-gray-200"
                }`}
              >
                <HoverBorderWrapper
                  onDelete={() => {
                    const newTiers = [...props.pricingTiers];
                    newTiers[index] = { ...tier, name: "" };
                    onUpdate({ ...props, pricingTiers: newTiers });
                  }}
                >
                  <h3 className="text-base md:text-lg font-semibold mb-2">{tier.name}</h3>
                </HoverBorderWrapper>
                <HoverBorderWrapper
                  onDelete={() => {
                    const newTiers = [...props.pricingTiers];
                    newTiers[index] = { ...tier, price: "" };
                    onUpdate({ ...props, pricingTiers: newTiers });
                  }}
                >
                  <div className="text-3xl md:text-4xl font-bold mb-2">{tier.price}</div>
                </HoverBorderWrapper>
                <HoverBorderWrapper
                  onDelete={() => {
                    const newTiers = [...props.pricingTiers];
                    newTiers[index] = { ...tier, description: "" };
                    onUpdate({ ...props, pricingTiers: newTiers });
                  }}
                >
                  <p
                    className={`text-xs md:text-sm mb-6 ${tier.isHighlighted ? "text-gray-300" : "text-gray-600"}`}
                  >
                    {tier.description}
                  </p>
                </HoverBorderWrapper>
                <ul
                  className={`text-xs md:text-sm mb-6 md:mb-8 space-y-1 md:space-y-2 ${
                    tier.isHighlighted ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {tier.features?.map((feature: string, i: number) => (
                    <HoverBorderWrapper
                      key={i}
                      onDelete={() => {
                        const newFeatures = tier.features.filter((_: any, idx: number) => idx !== i);
                        const newTiers = [...props.pricingTiers];
                        newTiers[index] = { ...tier, features: newFeatures };
                        onUpdate({ ...props, pricingTiers: newTiers });
                      }}
                    >
                      <li>• {feature}</li>
                    </HoverBorderWrapper>
                  ))}
                </ul>
                <HoverBorderWrapper
                  onDelete={() => {
                    const newTiers = [...props.pricingTiers];
                    newTiers[index] = { ...tier, buttonText: "" };
                    onUpdate({ ...props, pricingTiers: newTiers });
                  }}
                >
                  <button
                    style={{
                      backgroundColor: tier.buttonColor,
                      color: tier.buttonTextColor,
                    }}
                    className="w-full py-2 rounded font-medium hover:opacity-90 transition-opacity text-sm md:text-base"
                  >
                    {tier.buttonText}
                  </button>
                </HoverBorderWrapper>
              </div>
            </HoverBorderWrapper>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FaqBlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  onSelect,
}) => {
  const props = block.properties;
  return (
    <div
      className="transition-all"
      style={{
        backgroundColor: props.backgroundColor || "#ffffff",
        width: props.width || "100%",
      }}
    >
      <div className="px-4 md:px-8 py-8 md:py-16 max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">
          {props.heading}
        </h2>
        <div className="space-y-4">
          {props.faqs?.map((faq: any) => (
            <details
              key={faq.id}
              className="group border border-gray-200 rounded-lg p-4 md:p-6 cursor-pointer hover:border-valasys-orange transition-colors"
            >
              <summary className="flex items-center justify-between font-semibold text-sm md:text-base text-gray-900 group-open:text-valasys-orange">
                {faq.question}
                <span className="text-lg md:text-xl group-open:rotate-180 transition-transform ml-2 flex-shrink-0">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-xs md:text-sm text-gray-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SignupBlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  onSelect,
}) => {
  const props = block.properties;
  return (
    <div
      className="transition-all"
      style={{
        backgroundColor: props.backgroundColor || "#ffffff",
        width: props.width || "100%",
      }}
    >
      <div className="px-4 md:px-8 py-8 md:py-16 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {props.heading}
        </h2>
        <p className="text-sm md:text-base text-gray-600 mb-8">{props.subheading}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder={props.inputPlaceholder}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-valasys-orange text-sm"
          />
          <button
            style={{
              backgroundColor: props.buttonColor,
              color: props.buttonTextColor,
            }}
            className="px-6 md:px-8 py-3 font-medium rounded-lg hover:opacity-90 transition-opacity text-sm md:text-base whitespace-nowrap"
          >
            {props.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export const PricingFooterBlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  onSelect,
}) => {
  const props = block.properties;
  return (
    <div
      className="transition-all"
      style={{
        backgroundColor: props.backgroundColor || "#ffffff",
        width: props.width || "100%",
      }}
    >
      <div className="px-4 md:px-8 py-8 md:py-12">
        <div
          className="grid gap-4 md:gap-8"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))`,
          }}
        >
          {props.columns?.map((column: any) => (
            <div key={column.id}>
              <h4 className="font-semibold text-sm md:text-base text-gray-900 mb-4">
                {column.title}
              </h4>
              <div className="space-y-2">
                {column.links?.map((link: any, i: number) => (
                  <p
                    key={i}
                    className="text-xs md:text-sm text-gray-600 hover:text-valasys-orange transition-colors cursor-pointer"
                  >
                    {link.label}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const HeadingBlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const props = block.properties;
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(props.text || "");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate({ ...props, text: editText });
    }
    setIsEditing(false);
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div
      className="transition-all"
      style={{
        backgroundColor: props.backgroundColor || "#ffffff",
        padding: props.padding || "20px",
      }}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editText}
          onChange={(e) => {
            setEditText(e.target.value);
            adjustHeight();
          }}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setEditText(props.text || "");
              setIsEditing(false);
            }
          }}
          className="w-full focus:outline-none bg-transparent resize-none overflow-hidden whitespace-pre-wrap break-words"
          style={{
            color: props.textColor || "#1f2937",
            fontSize: props.fontSize || "2rem",
            fontWeight: props.fontWeight || "bold",
            textAlign: props.textAlign || "left" as any,
          }}
          autoFocus
        />
      ) : (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setEditText(props.text || "");
            setIsEditing(true);
          }}
          style={{
            color: props.textColor || "#1f2937",
            fontSize: props.fontSize || "2rem",
            fontWeight: props.fontWeight || "bold",
            textAlign: props.textAlign || "left" as any,
          }}
          className="cursor-text break-words whitespace-pre-wrap"
        >
          {props.text || "Heading Text"}
        </div>
      )}
    </div>
  );
};

export const ParagraphBlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const props = block.properties;
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(props.text || "");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate({ ...props, text: editText });
    }
    setIsEditing(false);
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div
      className="transition-all"
      style={{
        backgroundColor: props.backgroundColor || "#ffffff",
        padding: props.padding || "20px",
      }}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editText}
          onChange={(e) => {
            setEditText(e.target.value);
            adjustHeight();
          }}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setEditText(props.text || "");
              setIsEditing(false);
            }
          }}
          className="w-full focus:outline-none bg-transparent resize-none overflow-hidden whitespace-pre-wrap break-words"
          style={{
            color: props.textColor || "#4b5563",
            fontSize: props.fontSize || "1rem",
            lineHeight: props.lineHeight || "1.6",
            textAlign: props.textAlign || "left" as any,
          }}
          autoFocus
        />
      ) : (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setEditText(props.text || "");
            setIsEditing(true);
          }}
          style={{
            color: props.textColor || "#4b5563",
            fontSize: props.fontSize || "1rem",
            lineHeight: props.lineHeight || "1.6",
            textAlign: props.textAlign || "left" as any,
          }}
          className="cursor-text break-words whitespace-pre-wrap"
        >
          {props.text || "Paragraph Text"}
        </div>
      )}
    </div>
  );
};

export const RichTextBlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const props = block.properties;
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(props.text || "");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate({ ...props, text: editText });
    }
    setIsEditing(false);
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div
      className="transition-all"
      style={{
        backgroundColor: props.backgroundColor || "#ffffff",
        padding: props.padding || "20px",
      }}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editText}
          onChange={(e) => {
            setEditText(e.target.value);
            adjustHeight();
          }}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setEditText(props.text || "");
              setIsEditing(false);
            }
          }}
          className="w-full focus:outline-none bg-transparent resize-none overflow-hidden whitespace-pre-wrap break-words font-mono text-xs"
          style={{
            color: props.textColor || "#4b5563",
            fontSize: props.fontSize || "1rem",
            lineHeight: props.lineHeight || "1.6",
          }}
          autoFocus
        />
      ) : (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setEditText(props.text || "");
            setIsEditing(true);
          }}
          style={{
            color: props.textColor || "#4b5563",
            fontSize: props.fontSize || "1rem",
            lineHeight: props.lineHeight || "1.6",
          }}
          className="cursor-text break-words"
          dangerouslySetInnerHTML={{ __html: props.text || "<p>Rich text content</p>" }}
        />
      )}
    </div>
  );
};

export const QuoteBlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const props = block.properties;
  const [isEditing, setIsEditing] = React.useState(false);
  const [editQuote, setEditQuote] = React.useState(props.quoteText || "");
  const [editAuthor, setEditAuthor] = React.useState(props.authorName || "");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSave = () => {
    if (editQuote.trim()) {
      onUpdate({ ...props, quoteText: editQuote, authorName: editAuthor });
    }
    setIsEditing(false);
  };

  const borderStyle: React.CSSProperties = {
    borderLeft:
      props.borderPosition === "left"
        ? `${props.borderWidth || "4px"} solid ${props.borderColor || "#FF6A00"}`
        : undefined,
    borderTop:
      props.borderPosition === "top"
        ? `${props.borderWidth || "4px"} solid ${props.borderColor || "#FF6A00"}`
        : undefined,
    borderRight:
      props.borderPosition === "right"
        ? `${props.borderWidth || "4px"} solid ${props.borderColor || "#FF6A00"}`
        : undefined,
    borderBottom:
      props.borderPosition === "bottom"
        ? `${props.borderWidth || "4px"} solid ${props.borderColor || "#FF6A00"}`
        : undefined,
  };

  return (
    <div
      className="transition-all"
      style={{
        backgroundColor: props.backgroundColor || "#f3f4f6",
        padding: props.padding || "24px",
        ...borderStyle,
      }}
    >
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            ref={textareaRef}
            value={editQuote}
            onChange={(e) => setEditQuote(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setEditQuote(props.quoteText || "");
                setEditAuthor(props.authorName || "");
                setIsEditing(false);
              }
            }}
            className="w-full focus:outline-none bg-transparent resize-none overflow-hidden whitespace-pre-wrap break-words italic"
            style={{
              color: props.textColor || "#1f2937",
              fontSize: props.quoteSize || "1.5rem",
            }}
            placeholder="Quote text"
            autoFocus
          />
          <input
            type="text"
            value={editAuthor}
            onChange={(e) => setEditAuthor(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setEditQuote(props.quoteText || "");
                setEditAuthor(props.authorName || "");
                setIsEditing(false);
              }
            }}
            className="w-full focus:outline-none bg-transparent text-sm"
            style={{
              color: props.textColor || "#1f2937",
              fontSize: props.authorSize || "0.875rem",
            }}
            placeholder="Author name"
          />
        </div>
      ) : (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setEditQuote(props.quoteText || "");
            setEditAuthor(props.authorName || "");
            setIsEditing(true);
          }}
          className="cursor-text"
        >
          <blockquote
            style={{
              color: props.textColor || "#1f2937",
              fontSize: props.quoteSize || "1.5rem",
              marginBottom: "0.5rem",
            }}
            className="italic break-words whitespace-pre-wrap"
          >
            "{props.quoteText}"
          </blockquote>
          <p
            style={{
              color: props.textColor || "#1f2937",
              fontSize: props.authorSize || "0.875rem",
            }}
          >
            — {props.authorName}
          </p>
        </div>
      )}
    </div>
  );
};

export const DynamicContentBlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const props = block.properties;
  const [isEditing, setIsEditing] = React.useState(false);
  const [editHeading, setEditHeading] = React.useState(props.heading || "");

  const handleSave = () => {
    if (editHeading.trim()) {
      onUpdate({ ...props, heading: editHeading });
    }
    setIsEditing(false);
  };

  return (
    <div
      className="transition-all"
      style={{
        backgroundColor: props.backgroundColor || "#ffffff",
        borderColor: props.borderColor || "#e5e7eb",
        borderWidth: props.borderWidth || "1px",
        padding: props.padding || "24px",
      }}
    >
      {isEditing ? (
        <input
          type="text"
          value={editHeading}
          onChange={(e) => setEditHeading(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setEditHeading(props.heading || "");
              setIsEditing(false);
            }
          }}
          className="w-full focus:outline-none bg-transparent text-lg font-semibold"
          style={{ color: props.textColor || "#1f2937" }}
          autoFocus
        />
      ) : (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setEditHeading(props.heading || "");
            setIsEditing(true);
          }}
          className="cursor-text mb-4"
          style={{ color: props.textColor || "#1f2937" }}
        >
          <h3 className="text-lg font-semibold">{props.heading}</h3>
        </div>
      )}
      <p
        className="text-sm mb-4"
        style={{ color: props.textColor || "#6b7280" }}
      >
        {props.description}
      </p>
      <div className="space-y-2">
        {props.items?.map((item: any) => (
          <div
            key={item.id}
            className="p-3 rounded-lg bg-gray-50 border border-gray-200"
          >
            <span className="font-medium text-sm">{item.label}:</span>
            <span className="text-sm ml-2">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ProductBlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const props = block.properties;
  const [isEditingHeading, setIsEditingHeading] = React.useState(false);
  const [editHeading, setEditHeading] = React.useState(props.heading || "");

  const handleSave = () => {
    if (editHeading.trim()) {
      onUpdate({ ...props, heading: editHeading });
    }
    setIsEditingHeading(false);
  };

  return (
    <div
      className="transition-all"
      style={{
        backgroundColor: props.backgroundColor || "#ffffff",
        padding: "32px 24px",
      }}
    >
      {isEditingHeading ? (
        <input
          type="text"
          value={editHeading}
          onChange={(e) => setEditHeading(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setEditHeading(props.heading || "");
              setIsEditingHeading(false);
            }
          }}
          className="w-full focus:outline-none bg-transparent text-2xl font-bold mb-8 text-center"
          autoFocus
        />
      ) : (
        <h2
          onClick={(e) => {
            e.stopPropagation();
            setEditHeading(props.heading || "");
            setIsEditingHeading(true);
          }}
          className="cursor-text text-2xl font-bold mb-8 text-center"
        >
          {props.heading}
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {props.products?.map((product: any) => (
          <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
            {product.imageUrl && (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              {props.showDescription && (
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
              )}
              {props.showPrice && (
                <p className="text-lg font-bold text-valasys-orange mb-4">{product.price}</p>
              )}
              <button
                style={{ backgroundColor: product.buttonColor }}
                className="w-full text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
              >
                {product.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const NavigationBlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const props = block.properties;

  const getFlexDirection = () => {
    return props.orientation === "vertical" ? "flex-col" : "flex-row";
  };

  const getJustifyClass = () => {
    if (props.alignment === "center") return "justify-center";
    if (props.alignment === "right") return "justify-end";
    return "justify-start";
  };

  return (
    <div
      className="transition-all"
      style={{
        backgroundColor: props.backgroundColor || "#1f2937",
        color: props.textColor || "#ffffff",
        padding: props.padding || "16px",
      }}
    >
      <div className={`flex ${getFlexDirection()} ${getJustifyClass()} gap-6`}>
        {props.links?.map((link: any) => (
          <a
            key={link.id}
            href={link.href}
            className="text-sm md:text-base font-medium hover:opacity-75 transition-opacity"
            style={{ color: props.textColor || "#ffffff" }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export const ContentImageBlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const props = block.properties;

  return (
    <div
      onClick={onSelect}
      className="cursor-pointer transition-all shadow-none"
      style={{
        backgroundColor: props.backgroundColor || "#ffffff",
        border: "none",
        boxShadow: "none"
      }}
    >
      <div className="p-6 shadow-none" style={{ border: "none", boxShadow: "none" }}>
        <div className={`flex gap-6 items-center ${
          props.imagePosition === "right" ? "flex-row-reverse" : "flex-row"
        }`}>
          {/* Image */}
          <div className="flex-shrink-0">
            {props.imageUrl && (
              <img
                src={props.imageUrl}
                alt="Product"
                className="w-48 h-40 object-cover rounded"
              />
            )}
            {!props.imageUrl && (
              <div className="w-48 h-40 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {props.title || "Some title here"}
            </h3>
            <p className="text-gray-600 text-sm mb-4 whitespace-pre-wrap">
              {props.description || "Your description here"}
            </p>
            <button
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded text-sm"
              style={{ backgroundColor: props.buttonColor || "#FF6A00" }}
            >
              {props.buttonText || "Call to action"}
            </button>
          </div>
        </div>

        {/* Swap Position Button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const newPosition = props.imagePosition === "left" ? "right" : "left";
              onUpdate({ ...props, imagePosition: newPosition });
            }}
            className="text-xs text-gray-600 hover:text-gray-900 underline"
          >
            Swap Image Position
          </button>
        </div>
      </div>
    </div>
  );
};
