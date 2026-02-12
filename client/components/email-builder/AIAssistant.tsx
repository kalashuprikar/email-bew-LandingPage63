import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, Send, Bot, User, Loader2, Plus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentBlock, EmailTemplate } from "./types";
import {
  generateId,
  createTitleBlock,
  createTextBlock,
  createButtonBlock,
  createDividerBlock,
  createImageBlock,
  createSpacerBlock,
  createLogoBlock,
  createFooterWithSocialBlock,
  createStatsBlock,
  createFeaturesBlock,
  createTwoColumnCardBlock,
  createPromoBlock
} from "./utils";

interface AIAssistantProps {
  onAddBlock: (block: ContentBlock) => void;
  onSetTemplate: (blocks: ContentBlock[]) => void;
  currentTemplate: EmailTemplate;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: ContentBlock[];
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  onAddBlock,
  onSetTemplate,
  currentTemplate,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your Email AI Assistant. I can help you build beautiful newsletters in seconds. Try one of these quick builds:",
    },
  ]);

  const quickBuilds = [
    "Build a monthly newsletter",
    "Build a welcome email",
    "Build a product promo",
    "Build a sales outreach",
    "Build a weekly update with stats",
    "Build an event invitation",
  ];
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Helper to hydrate blocks from AI with defaults
  const hydrateBlocks = (aiBlocks: any[]): ContentBlock[] => {
    return aiBlocks.map(block => {
      const id = generateId();
      switch (block.type) {
        case "title":
          return { ...createTitleBlock(block.content), ...block, id };
        case "text":
          return { ...createTextBlock(block.content), ...block, id };
        case "button":
          return { ...createButtonBlock(block.text), ...block, id };
        case "divider":
          return { ...createDividerBlock(), ...block, id };
        case "image":
          return { ...createImageBlock(block.src), ...block, id };
        case "spacer":
          return { ...createSpacerBlock(block.height), ...block, id };
        case "logo":
          return { ...createLogoBlock(block.src), ...block, id };
        case "footer-with-social":
          return { ...createFooterWithSocialBlock(), ...block, id };
        case "stats":
          return { ...createStatsBlock(), ...block, id };
        case "features":
          return { ...createFeaturesBlock(), ...block, id };
        case "twoColumnCard":
          return { ...createTwoColumnCardBlock(), ...block, id };
        case "promo":
          return { ...createPromoBlock(), ...block, id };
        default:
          return { ...block, id };
      }
    }) as ContentBlock[];
  };

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isGenerating) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!overrideInput) setInput("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/ai/email-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: textToSend }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      const blocks = hydrateBlocks(data.blocks || []);

      const aiMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: data.message,
        suggestions: blocks,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Auto-apply if it's a "build" command and template is currently empty
      const isBuildCommand = input.toLowerCase().includes("build") || input.toLowerCase().includes("newsletter");
      if (isBuildCommand && currentTemplate.blocks.length === 0 && blocks.length > 0) {
        handleApplyAll(blocks);
        const autoApplyMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: "I've automatically applied this template to your canvas since it was empty. You can now edit it manually!",
        };
        setMessages((prev) => [...prev, autoApplyMessage]);
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      const errorMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: "I'm sorry, I encountered an error while generating your content. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyAll = (blocks: ContentBlock[]) => {
    onSetTemplate(blocks);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h2 className="font-bold text-gray-900">Active Intelligence</h2>
          <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Beta</span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col gap-2",
                message.role === "user" ? "items-end" : "items-start"
              )}
            >
              <div className="flex items-start gap-2 max-w-[90%]">
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 mt-1 border border-purple-100">
                    <AvatarFallback className="bg-purple-600 text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                    message.role === "user"
                      ? "bg-purple-600 text-white rounded-tr-none"
                      : "bg-gray-100 text-gray-900 rounded-tl-none border border-gray-200"
                  )}
                >
                  {message.content}
                  {message.id === "welcome" && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {quickBuilds.map((build) => (
                        <Button
                          key={build}
                          variant="outline"
                          size="sm"
                          className="text-[10px] h-7 bg-white hover:bg-purple-50 hover:text-purple-700 border-purple-100"
                          onClick={() => {
                            handleSend(build);
                          }}
                        >
                          {build}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 mt-1 border border-gray-200">
                    <AvatarFallback className="bg-gray-200 text-gray-600">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>

              {message.suggestions && message.suggestions.length > 0 && (
                <div className="ml-10 mt-2 space-y-2 w-full max-w-[85%]">
                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-3">
                    <div className="text-xs font-semibold text-purple-700 mb-3 flex items-center justify-between">
                      AI GENERATED BLOCKS
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-[10px] hover:bg-purple-100 text-purple-700"
                        onClick={() => handleApplyAll(message.suggestions!)}
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Apply to Template
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {message.suggestions.map((block) => (
                        <div 
                          key={block.id} 
                          className="bg-white border border-purple-100 p-2 rounded-lg flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase font-medium">
                              {block.type}
                            </span>
                            <span className="text-xs text-gray-600 truncate">
                              {"content" in block ? block.content : block.type}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                            onClick={() => onAddBlock(block)}
                            title="Add to template"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {isGenerating && (
            <div className="flex items-start gap-2">
              <Avatar className="h-8 w-8 border border-purple-100">
                <AvatarFallback className="bg-purple-600 text-white">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 border border-gray-200 rounded-2xl px-4 py-2 rounded-tl-none">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what to build..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="pr-10 border-purple-100 focus:border-purple-600 focus:ring-purple-600/10 rounded-xl"
            disabled={isGenerating}
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            className="absolute right-1 top-1 h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          AI can make mistakes. Check important information for accuracy.
        </p>
      </div>
    </div>
  );
};
