import React, { useState, useCallback } from "react";
import { EmailTemplate } from "./types";
import { renderTemplateToHTML } from "./utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";

interface SourceCodeViewProps {
  template: EmailTemplate;
}

export const SourceCodeView: React.FC<SourceCodeViewProps> = ({ template }) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);
  const [openDownloadTooltip, setOpenDownloadTooltip] = useState(false);

  const htmlContent = renderTemplateToHTML(template);

  const handleCopy = useCallback(() => {
    if (!htmlContent) {
      toast.error("No content to copy");
      return;
    }

    const copyToClipboard = async () => {
      // Try modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(htmlContent);
          setCopied(true);
          setOpenTooltip(true);
          toast.success("Copied to clipboard");
          setTimeout(() => {
            setCopied(false);
            setOpenTooltip(false);
          }, 2000);
          return;
        } catch (err) {
          // Clipboard API failed, fall through to fallback
          console.debug("Clipboard API unavailable, using fallback");
        }
      }

      // Fallback: use execCommand method
      const textArea = document.createElement("textarea");
      textArea.value = htmlContent;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.select();

      try {
        document.execCommand("copy");
        setCopied(true);
        setOpenTooltip(true);
        toast.success("Copied to clipboard");
        setTimeout(() => {
          setCopied(false);
          setOpenTooltip(false);
        }, 2000);
      } catch (err) {
        console.error("Copy failed:", err);
      } finally {
        document.body.removeChild(textArea);
      }
    };

    copyToClipboard();
  }, [htmlContent]);

  const handleDownloadInlineHTML = () => {
    // Create pure HTML with inline CSS
    const inlineHTMLContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.subject}</title>
</head>
<body style="background-color: ${template.backgroundColor || "#ffffff"}; padding: ${template.padding || 0}px; font-family: Arial, sans-serif; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto;">
${htmlContent.substring(htmlContent.indexOf('<div style="max-width:'), htmlContent.lastIndexOf("</div>") + 6)}
  </div>
</body>
</html>`;

    const element = document.createElement("a");
    const file = new Blob([inlineHTMLContent], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = `${template.name || "template"}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setDownloaded(true);
    setOpenDownloadTooltip(true);
    toast.success("Pure HTML with inline CSS downloaded successfully");
    setTimeout(() => {
      setDownloaded(false);
      setOpenDownloadTooltip(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header with Actions */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-800">
            HTML Source Code
          </h2>
          <p className="text-sm text-gray-600 mt-1 truncate">
            Complete HTML for: {template.name || "Untitled Template"}
          </p>
        </div>
        <TooltipProvider delayDuration={200}>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Tooltip open={openTooltip} onOpenChange={setOpenTooltip}>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="font-medium" side="top">
                {copied ? "Copied!" : "Copy Code"}
              </TooltipContent>
            </Tooltip>
            <Tooltip
              open={openDownloadTooltip}
              onOpenChange={setOpenDownloadTooltip}
            >
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-max">
                    <DropdownMenuItem
                      onClick={handleDownloadInlineHTML}
                      className="py-2.5"
                    >
                      <Download className="w-4 h-4 mr-3" />
                      Download Pure HTML
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent className="font-medium" side="top">
                {downloaded ? "Downloaded!" : "Download"}
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      {/* Code Display */}
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <pre className="p-4 text-xs font-mono text-gray-800 overflow-auto max-h-full leading-relaxed">
            <code>{htmlContent}</code>
          </pre>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="bg-white border-t border-gray-200 p-4 text-sm text-gray-600 flex justify-between">
        <span>Lines: {htmlContent.split("\n").length}</span>
        <span>Characters: {htmlContent.length}</span>
        <span>Blocks: {template.blocks.length}</span>
      </div>
    </div>
  );
};
