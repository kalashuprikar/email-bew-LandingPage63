import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { LandingPageBuilder } from "@/components/landing-page-builder/LandingPageBuilder";
import { LandingPage } from "@/components/landing-page-builder/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  getLandingPagesFromLocalStorage,
  deleteLandingPageFromLocalStorage,
} from "@/components/landing-page-builder/utils";
import { Layers, Plus, Trash2, Edit2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

type View = "list" | "editor";

export default function LandingPages() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [view, setView] = useState<View>("list");
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Load pages from localStorage
  useEffect(() => {
    const loaded = getLandingPagesFromLocalStorage();
    setPages(loaded);
  }, []);

  const handleNewPage = () => {
    setSelectedPageId(null);
    setView("editor");
  };

  const handleEditPage = (id: string) => {
    setSelectedPageId(id);
    setView("editor");
  };

  const handleDeletePage = (id: string) => {
    deleteLandingPageFromLocalStorage(id);
    setPages(pages.filter((p) => p.id !== id));
    setShowDeleteDialog(false);
    setDeleteTargetId(null);
  };

  const handleBackToList = () => {
    // Refresh pages from localStorage
    const loaded = getLandingPagesFromLocalStorage();
    setPages(loaded);
    setView("list");
    setSelectedPageId(null);
  };

  const filteredPages = pages.filter(
    (page) =>
      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Sort pages by most recently updated
  const sortedPages = [...filteredPages].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (view === "editor") {
    return (
      <LandingPageBuilder
        pageId={selectedPageId || undefined}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Layers className="w-8 h-8 text-valasys-orange" />
              Landing Pages
            </h1>
            <p className="text-gray-600 mt-2">
              Create and manage custom landing pages with drag and drop blocks
            </p>
          </div>
          <Button
            onClick={handleNewPage}
            className="bg-valasys-orange hover:bg-orange-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Page
          </Button>
        </div>

        {/* Search Bar */}
        <div className="flex gap-4">
          <Input
            placeholder="Search landing pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Empty State */}
        {filteredPages.length === 0 && pages.length === 0 && (
          <Alert>
            <AlertDescription>
              No landing pages yet. Click "Create New Page" to get started with
              a drag-and-drop page builder.
            </AlertDescription>
          </Alert>
        )}

        {/* Continue Editing Section */}
        {pages.length > 0 && !searchQuery && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Continue Editing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-valasys-orange">
                {/* Preview Area */}
                <div className="w-full h-40 bg-gradient-to-br from-valasys-orange/20 to-orange-100 flex items-center justify-center">
                  <div className="text-center">
                    <Layers className="w-12 h-12 text-valasys-orange mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">{pages[0].blocks.length} blocks</p>
                  </div>
                </div>

                {/* Content */}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{pages[0].name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{pages[0].description}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-gray-600 border-t pt-4">
                      <div>
                        <span className="font-medium">Updated:</span> {formatDate(pages[0].updatedAt)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        onClick={() => handleEditPage(pages[0].id)}
                        className="flex-1 gap-2 bg-valasys-orange hover:bg-orange-600"
                      >
                        <Edit2 className="w-4 h-4" />
                        Continue Editing
                      </Button>
                      <Button
                        onClick={() => {
                          setDeleteTargetId(pages[0].id);
                          setShowDeleteDialog(true);
                        }}
                        variant="outline"
                        size="sm"
                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Pages Grid */}
        {sortedPages.length > 0 && (
          <>
            {sortedPages.length > 1 && pages.length > 1 && (
              <h2 className="text-lg font-semibold text-gray-900 mb-4">All Pages</h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPages.map((page) => (
                <Card
                  key={page.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Preview Area */}
                  <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <Layers className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        {page.blocks.length} blocks
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{page.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {page.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs text-gray-600 border-t pt-4">
                        <div>
                          <span className="font-medium">Created:</span>{" "}
                          {formatDate(page.createdAt)}
                        </div>
                        <div>
                          <span className="font-medium">Updated:</span>{" "}
                          {formatDate(page.updatedAt)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          onClick={() => handleEditPage(page.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            setDeleteTargetId(page.id);
                            setShowDeleteDialog(true);
                          }}
                          variant="outline"
                          size="sm"
                          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* No Results */}
        {filteredPages.length === 0 && pages.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No landing pages match your search. Try adjusting your search
              query.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Landing Page</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this landing page? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteTargetId && handleDeletePage(deleteTargetId)
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
