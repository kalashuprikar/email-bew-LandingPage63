import React from "react";
import { Menu, X } from "lucide-react";
import { LandingPageBlock } from "./types";
import { EditableLink } from "./EditableLink";

interface BlockPreviewProps {
  block: LandingPageBlock;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (props: Record<string, any>) => void;
  onLinkSelect?: (linkIndex: number, linkType: "navigation" | "quick") => void;
}

export const HeaderBlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  onSelect,
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
      onClick={onSelect}
      className={`border border-gray-200 cursor-pointer transition-all ${
        isSelected ? "border-orange-300" : "hover:border-gray-300"
      }`}
      style={{
        backgroundColor: props.backgroundColor || "#ffffff",
        width: props.width || "100%",
      }}
    >
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
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

        {/* Desktop Navigation (hidden on mobile) */}
        <div className="hidden md:flex preview-desktop-only gap-4 text-sm text-gray-600 items-center">
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
          ))}
          <button className="px-4 py-2 bg-valasys-orange text-white text-sm font-medium rounded hover:bg-orange-600 transition-colors whitespace-nowrap">
            {props.ctaButtonText}
          </button>
        </div>

        {/* Mobile Hamburger Menu (visible only on mobile) */}
        <div className="md:hidden preview-mobile-only flex items-center gap-2">
          <button className="px-3 py-2 bg-valasys-orange text-white text-xs font-medium rounded hover:bg-orange-600 transition-colors whitespace-nowrap">
            {props.ctaButtonText}
          </button>
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
  onSelect,
  onUpdate,
}) => {
  const props = block.properties;
  const [isEditingHeading, setIsEditingHeading] = React.useState(false);
  const [editHeadingText, setEditHeadingText] = React.useState(props.headline || "");
  const [isEditingSubheading, setIsEditingSubheading] = React.useState(false);
  const [editSubheadingText, setEditSubheadingText] = React.useState(props.subheading || "");
  const [isEditingButton, setIsEditingButton] = React.useState(false);
  const [editButtonText, setEditButtonText] = React.useState(props.ctaButtonText || "");
  const [hoveredElement, setHoveredElement] = React.useState<"heading" | "subheading" | "button" | null>(null);
  const [selectedElement, setSelectedElement] = React.useState<"heading" | "subheading" | "button" | null>(null);

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
    onUpdate?.({ ...props, headline: props.headline + " (Copy)" });
    setSelectedElement(null);
  };

  const handleDeleteHeading = () => {
    onUpdate?.({ ...props, headline: "" });
    setSelectedElement(null);
  };

  const handleCopySubheading = () => {
    onUpdate?.({ ...props, subheading: props.subheading + " (Copy)" });
    setSelectedElement(null);
  };

  const handleDeleteSubheading = () => {
    onUpdate?.({ ...props, subheading: "" });
    setSelectedElement(null);
  };

  const handleCopyButton = () => {
    onUpdate?.({ ...props, ctaButtonText: props.ctaButtonText + " (Copy)" });
    setSelectedElement(null);
  };

  const handleDeleteButton = () => {
    onUpdate?.({ ...props, ctaButtonText: "" });
    setSelectedElement(null);
  };

  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer transition-all border ${
        isSelected ? "border-valasys-orange" : "border-gray-200"
      }`}
      style={{
        backgroundColor: props.backgroundColor || "#f3f4f6",
        minHeight: props.minHeight || "500px",
        width: props.width || "100%",
      }}
    >
      <div className="flex flex-col items-center justify-center h-full px-4 md:px-8 py-8 md:py-16 text-center">
        {/* Heading */}
        <div
          className={`relative mb-4 px-4 py-2 rounded transition-all ${
            selectedElement === "heading" ? "border-2 border-solid border-valasys-orange" :
            hoveredElement === "heading" ? "border-2 border-dashed border-valasys-orange" : ""
          }`}
          onMouseEnter={() => setHoveredElement("heading")}
          onMouseLeave={() => setHoveredElement(null)}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedElement("heading");
          }}
        >
          {isEditingHeading ? (
            <input
              type="text"
              value={editHeadingText}
              onChange={(e) => setEditHeadingText(e.target.value)}
              onBlur={handleHeadlineSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleHeadlineSave();
                if (e.key === "Escape") {
                  setEditHeadingText(props.headline || "");
                  setIsEditingHeading(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full text-2xl md:text-5xl font-bold text-gray-900 border-2 border-valasys-orange rounded px-2 py-1 focus:outline-none"
              autoFocus
            />
          ) : (
            <h1
              className="text-2xl md:text-5xl font-bold text-gray-900 cursor-text"
              onDoubleClick={(e) => {
                e.stopPropagation();
                setEditHeadingText(props.headline || "");
                setIsEditingHeading(true);
              }}
            >
              {props.headline}
            </h1>
          )}

          {selectedElement === "heading" && !isEditingHeading && (
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex gap-1 bg-white rounded-lg border border-valasys-orange p-2 z-50 mt-2">
              <button
                className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-valasys-orange transition-colors flex items-center justify-center rounded"
                title="Copy heading"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyHeading();
                }}
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center rounded"
                title="Delete heading"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteHeading();
                }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Subheading */}
        <div
          className={`relative mb-8 px-4 py-2 rounded transition-all max-w-2xl ${
            selectedElement === "subheading" ? "border-2 border-solid border-valasys-orange" :
            hoveredElement === "subheading" ? "border-2 border-dashed border-valasys-orange" : ""
          }`}
          onMouseEnter={() => setHoveredElement("subheading")}
          onMouseLeave={() => setHoveredElement(null)}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedElement("subheading");
          }}
        >
          {isEditingSubheading ? (
            <input
              type="text"
              value={editSubheadingText}
              onChange={(e) => setEditSubheadingText(e.target.value)}
              onBlur={handleSubheadingSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubheadingSave();
                if (e.key === "Escape") {
                  setEditSubheadingText(props.subheading || "");
                  setIsEditingSubheading(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full text-sm md:text-xl text-gray-600 border-2 border-valasys-orange rounded px-2 py-1 focus:outline-none"
              autoFocus
            />
          ) : (
            <p
              className="text-sm md:text-xl text-gray-600 cursor-text"
              onDoubleClick={(e) => {
                e.stopPropagation();
                setEditSubheadingText(props.subheading || "");
                setIsEditingSubheading(true);
              }}
            >
              {props.subheading}
            </p>
          )}

          {selectedElement === "subheading" && !isEditingSubheading && (
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

        {/* CTA Button */}
        <div
          className={`relative px-4 py-2 rounded transition-all ${
            selectedElement === "button" ? "border-2 border-solid border-valasys-orange" :
            hoveredElement === "button" ? "border-2 border-dashed border-valasys-orange" : ""
          }`}
          onMouseEnter={() => setHoveredElement("button")}
          onMouseLeave={() => setHoveredElement(null)}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedElement("button");
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
              className="px-6 md:px-8 py-2 md:py-3 border-2 border-valasys-orange rounded focus:outline-none text-sm md:text-base"
              style={{ backgroundColor: props.ctaButtonColor || "#FF6A00", color: "white" }}
              autoFocus
            />
          ) : (
            <button
              style={{ backgroundColor: props.ctaButtonColor }}
              className="px-6 md:px-8 py-2 md:py-3 text-white font-medium rounded hover:opacity-90 transition-opacity text-sm md:text-base cursor-text"
              onDoubleClick={(e) => {
                e.stopPropagation();
                setEditButtonText(props.ctaButtonText || "");
                setIsEditingButton(true);
              }}
            >
              {props.ctaButtonText}
            </button>
          )}

          {selectedElement === "button" && !isEditingButton && (
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

export const FeaturesBlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  onSelect,
}) => {
  const props = block.properties;
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer transition-all border ${
        isSelected ? "border-valasys-orange" : "border-gray-200"
      }`}
      style={{
        backgroundColor: props.backgroundColor || "#ffffff",
        width: props.width || "100%",
      }}
    >
      <div className="px-4 md:px-8 py-8 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">
          {props.heading}
        </h2>
        <p className="text-center text-sm md:text-base text-gray-600 mb-8 md:mb-12">{props.description}</p>
        <div
          className="gap-4 md:gap-8"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))`,
          }}
        >
          {props.features?.map((feature: any) => (
            <div key={feature.id} className="text-center">
              <div className="text-3xl md:text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-600">{feature.description}</p>
            </div>
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
}) => {
  const props = block.properties;
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer transition-all border ${
        isSelected ? "border-valasys-orange" : "border-gray-200"
      }`}
      style={{
        backgroundColor: props.backgroundColor || "#ffffff",
        width: props.width || "100%",
      }}
    >
      <div className="px-4 md:px-8 py-8 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">
          {props.heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {props.testimonials?.map((testimonial: any) => (
            <div
              key={testimonial.id}
              className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200"
            >
              <p className="text-sm md:text-base text-gray-600 mb-4">{testimonial.quote}</p>
              <div>
                <p className="font-semibold text-sm md:text-base text-gray-900">
                  {testimonial.author}
                </p>
                <p className="text-xs md:text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
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
}) => {
  const props = block.properties;
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer transition-all border ${
        isSelected ? "border-valasys-orange" : "border-gray-200"
      }`}
      style={{
        backgroundColor: props.backgroundColor || "#ffffff",
        width: props.width || "100%",
      }}
    >
      <div className="px-4 md:px-8 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          {props.imagePosition === "left" && (
            <div className="h-40 md:h-64 bg-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Image</span>
            </div>
          )}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {props.heading}
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
              {props.content}
            </p>
            <button className="px-6 py-2 bg-valasys-orange text-white text-sm md:text-base font-medium rounded hover:bg-orange-600 transition-colors">
              {props.cta?.text}
            </button>
          </div>
          {props.imagePosition === "right" && (
            <div className="h-40 md:h-64 bg-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Image</span>
            </div>
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
}) => {
  const props = block.properties;
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer transition-all border ${
        isSelected ? "border-valasys-orange" : "border-gray-200"
      }`}
      style={{
        backgroundColor: props.backgroundColor || "#ffffff",
        width: props.width || "100%",
      }}
    >
      <div className="px-4 md:px-8 py-8 md:py-16 max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {props.heading}
        </h2>
        <p className="text-sm md:text-base text-gray-600 mb-8">{props.description}</p>
        <form className="space-y-4">
          {props.fields?.map((field: any) => (
            <div key={field.id}>
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
          ))}
          <button
            style={{ backgroundColor: props.submitButtonColor }}
            className="w-full py-3 text-white text-sm md:text-base font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            {props.submitButtonText}
          </button>
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
      onClick={onSelect}
      className={`cursor-pointer transition-all border ${
        isSelected ? "border-valasys-orange" : "border-gray-200"
      }`}
      style={{
        backgroundColor: props.backgroundColor || "#1f2937",
        color: props.textColor,
        width: props.width || "100%",
      }}
    >
      <div className="px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <h3 className="font-bold mb-2 text-sm md:text-base">{props.companyName}</h3>
            <p className="text-xs md:text-sm opacity-75">{props.companyDescription}</p>
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
}) => {
  const props = block.properties;
  return (
    <div
      onClick={onSelect}
      style={{ height: props.height || "60px" }}
      className={`border border-dashed cursor-pointer transition-all ${
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
}) => {
  const props = block.properties;
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer transition-all border ${
        isSelected ? "border-valasys-orange" : "border-gray-200"
      }`}
      style={{
        backgroundColor: props.backgroundColor || "#ffffff",
        width: props.width || "100%",
      }}
    >
      <div className="px-4 md:px-8 py-8 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">
          {props.heading}
        </h2>
        <p className="text-center text-sm md:text-base text-gray-600 mb-8 md:mb-12">{props.subheading}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {props.pricingTiers?.map((tier: any) => (
            <div
              key={tier.id}
              className={`rounded-lg p-6 md:p-8 text-center transition-all ${
                tier.isHighlighted
                  ? "bg-gray-900 text-white shadow-lg md:scale-105"
                  : "bg-white border border-gray-200"
              }`}
            >
              <h3 className="text-base md:text-lg font-semibold mb-2">{tier.name}</h3>
              <div className="text-3xl md:text-4xl font-bold mb-2">{tier.price}</div>
              <p
                className={`text-xs md:text-sm mb-6 ${tier.isHighlighted ? "text-gray-300" : "text-gray-600"}`}
              >
                {tier.description}
              </p>
              <ul
                className={`text-xs md:text-sm mb-6 md:mb-8 space-y-1 md:space-y-2 ${
                  tier.isHighlighted ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {tier.features?.map((feature: string, i: number) => (
                  <li key={i}>• {feature}</li>
                ))}
              </ul>
              <button
                style={{
                  backgroundColor: tier.buttonColor,
                  color: tier.buttonTextColor,
                }}
                className="w-full py-2 rounded font-medium hover:opacity-90 transition-opacity text-sm md:text-base"
              >
                {tier.buttonText}
              </button>
            </div>
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
      onClick={onSelect}
      className={`cursor-pointer transition-all border ${
        isSelected ? "border-valasys-orange" : "border-gray-200"
      }`}
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
      onClick={onSelect}
      className={`cursor-pointer transition-all border ${
        isSelected ? "border-valasys-orange" : "border-gray-200"
      }`}
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
      onClick={onSelect}
      className={`cursor-pointer transition-all border ${
        isSelected ? "border-valasys-orange" : "border-gray-200"
      }`}
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
