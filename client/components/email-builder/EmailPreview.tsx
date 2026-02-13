import React, { useState } from "react";
import { EmailTemplate } from "./types";
import { renderBlockToHTML } from "./utils";
import { Button } from "@/components/ui/button";
import { Smartphone, Tablet, Monitor } from "lucide-react";

interface EmailPreviewProps {
  template: EmailTemplate;
}

type PreviewDevice = "mobile" | "tablet" | "desktop";

export const EmailPreview: React.FC<EmailPreviewProps> = ({ template }) => {
  const [device, setDevice] = useState<PreviewDevice>("desktop");

  const getDeviceWidth = () => {
    switch (device) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      default:
        return "600px";
    }
  };

  const getDeviceLabel = () => {
    switch (device) {
      case "mobile":
        return "Mobile (375px)";
      case "tablet":
        return "Tablet (768px)";
      default:
        return "Desktop (600px)";
    }
  };

  const filteredBlocks = template.blocks.filter((block) => {
    if (block.visibility === "all") return true;
    if (device === "mobile") return block.visibility === "mobile";
    // Treat tablet as desktop
    return block.visibility === "desktop";
  });

  // Group inline blocks together for proper rendering
  const groupedBlocks: (any)[] = [];
  let inlineGroup: any[] = [];

  for (const block of filteredBlocks) {
    const isInline = (block as any).displayMode === "inline";
    if (isInline) {
      inlineGroup.push(block);
    } else {
      if (inlineGroup.length > 0) {
        groupedBlocks.push({ _isInlineGroup: true, blocks: inlineGroup });
        inlineGroup = [];
      }
      groupedBlocks.push(block);
    }
  }

  // Add any remaining inline group
  if (inlineGroup.length > 0) {
    groupedBlocks.push({ _isInlineGroup: true, blocks: inlineGroup });
  }

  const htmlContent = groupedBlocks
    .map((item) => {
      if (item._isInlineGroup) {
        const inlineHtml = item.blocks
          .map((block: any) => {
            const blockHtml = renderBlockToHTML(block);
            return `<div style="flex: 0 0 auto;">${blockHtml}</div>`;
          })
          .join("");
        return `<div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 24px; width: 100%; margin: 0 auto;">${inlineHtml}</div>`;
      }
      return renderBlockToHTML(item);
    })
    .join("");

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Preview Controls */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-700 mr-auto">
          {getDeviceLabel()}
        </span>
        <Button
          variant={device === "mobile" ? "default" : "outline"}
          size="sm"
          onClick={() => setDevice("mobile")}
          className={
            device === "mobile"
              ? "bg-valasys-orange hover:bg-valasys-orange/90"
              : ""
          }
        >
          <Smartphone className="w-4 h-4 mr-1" />
          Mobile
        </Button>
        <Button
          variant={device === "tablet" ? "default" : "outline"}
          size="sm"
          onClick={() => setDevice("tablet")}
          className={
            device === "tablet"
              ? "bg-valasys-orange hover:bg-valasys-orange/90"
              : ""
          }
        >
          <Tablet className="w-4 h-4 mr-1" />
          Tablet
        </Button>
        <Button
          variant={device === "desktop" ? "default" : "outline"}
          size="sm"
          onClick={() => setDevice("desktop")}
          className={
            device === "desktop"
              ? "bg-valasys-orange hover:bg-valasys-orange/90"
              : ""
          }
        >
          <Monitor className="w-4 h-4 mr-1" />
          Desktop
        </Button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-8 flex items-start justify-center bg-gray-100">
        <div
          style={{
            width: getDeviceWidth(),
            backgroundColor: template.backgroundColor,
            padding: `${template.padding}px`,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "4px",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      </div>

      {/* HTML Source */}
      <div className="bg-white border-t border-gray-200 p-4">
        <details className="text-sm">
          <summary className="cursor-pointer font-semibold text-gray-700">
            View HTML Source
          </summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40 text-gray-600">
            {`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.subject}</title>
</head>
<body style="background-color: ${template.backgroundColor}; padding: ${template.padding}px; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto;">
    <!-- Showing blocks for: ${device === "mobile" ? "mobile" : device === "tablet" ? "tablet/desktop" : "desktop"} -->
    ${htmlContent}
  </div>
</body>
</html>`}
          </pre>
        </details>
      </div>
    </div>
  );
};
