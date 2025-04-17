import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useFileDrop } from "./useFileDrop";

function FileDrop() {
  const {
    handleCancelTask,
    handleFileChange,
    handleSubmit,
    fileInputRef,
    selectedFile,
    fileError,
    submitMutation,
  } = useFileDrop();
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Simulate File Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file-upload">Select File</Label>
              <Input
                id="file-upload"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf,image/*"
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {selectedFile && fileError.status && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name} (
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
              {fileError && (
                <p className="text-sm text-red-600 dark:text-red-500">
                  {fileError.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={
                !selectedFile || !fileError.status || submitMutation.isPending
              }
            >
              {submitMutation.isPending ? "Submitting..." : "Start Processing"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default FileDrop;
