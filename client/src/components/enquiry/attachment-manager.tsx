import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, File, Image, X, Download, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface AttachmentManagerProps {
  attachments?: any[];
  onAttachmentsChange?: (attachments: any[]) => void;
  maxFiles?: number;
  maxSizeBytes?: number;
  allowedTypes?: string[];
  readOnly?: boolean;
}

export default function AttachmentManager({
  attachments = [],
  onAttachmentsChange,
  maxFiles = 10,
  maxSizeBytes = 10 * 1024 * 1024, // 10MB
  allowedTypes = ["image/*", "application/pdf", ".doc", ".docx", ".txt"],
  readOnly = false,
}: AttachmentManagerProps) {
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadFiles = async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Upload response error:', errorData);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      return result.files || result;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (readOnly || uploading) return;

    if (acceptedFiles.length + attachments.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      console.log('Starting upload for files:', acceptedFiles.map(f => f.name));
      const uploadedFiles = await uploadFiles(acceptedFiles);
      console.log('Upload response:', uploadedFiles);
      
      const newAttachments = (Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles]).map((file: any) => ({
        id: file.id || file.filename?.split('.')[0] || Date.now().toString(),
        name: file.name || file.originalname,
        filename: file.filename,
        size: file.size,
        type: file.mimetype || file.type,
        url: file.path || `/api/files/download/${file.filename}`,
        uploadedAt: file.uploadedAt || new Date().toISOString(),
      }));

      const updatedAttachments = [...attachments, ...newAttachments];
      onAttachmentsChange?.(updatedAttachments);
      
      toast({
        title: "Files uploaded",
        description: `${acceptedFiles.length} file(s) uploaded successfully`,
      });
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, [attachments, onAttachmentsChange, readOnly, uploading, maxFiles, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles: maxFiles - attachments.length,
    maxSize: maxSizeBytes,
    disabled: readOnly || uploading,
  });

  const removeAttachment = async (id: string) => {
    if (readOnly) return;
    
    const attachment = attachments.find(att => att.id === id);
    if (attachment && attachment.filename) {
      try {
        // Delete file from server
        await fetch(`/api/files/${attachment.filename}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Failed to delete file from server:', error);
      }
    }
    
    const updatedAttachments = attachments.filter(attachment => attachment.id !== id);
    onAttachmentsChange?.(updatedAttachments);
  };

  const downloadAttachment = (attachment: any) => {
    // Use the server URL for download
    const downloadUrl = attachment.url || `/api/files/download/${attachment.filename}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = attachment.name;
    link.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <Image className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  const isImage = (type: string) => type.startsWith("image/");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Attachments
          {attachments.length > 0 && (
            <Badge variant="secondary">{attachments.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!readOnly && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : uploading
                ? "border-muted-foreground/25 bg-muted/50 cursor-not-allowed"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            data-testid="dropzone-upload"
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            {uploading ? (
              <p className="text-primary">Uploading files...</p>
            ) : isDragActive ? (
              <p className="text-primary">Drop files here...</p>
            ) : (
              <div>
                <p className="font-medium">Drop files here or click to browse</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Max {maxFiles} files, {formatFileSize(maxSizeBytes)} each
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supported: Images, PDF, Word documents, Text files
                </p>
              </div>
            )}
          </div>
        )}

        {attachments.length > 0 && (
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-3 p-3 border rounded-lg"
                data-testid={`attachment-${attachment.id}`}
              >
                <div className="flex-shrink-0">
                  {getFileIcon(attachment.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate" data-testid={`attachment-name-${attachment.id}`}>
                    {attachment.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(attachment.size)}
                    {attachment.uploadedAt && (
                      <span className="ml-2">
                        • {new Date(attachment.uploadedAt).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex gap-1">
                  {isImage(attachment.type) && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          data-testid={`button-preview-${attachment.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>{attachment.name}</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-96 overflow-auto">
                          <img
                            src={attachment.url}
                            alt={attachment.name}
                            className="w-full h-auto"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadAttachment(attachment)}
                    data-testid={`button-download-${attachment.id}`}
                  >
                    <Download className="h-4 w-4" />
                  </Button>

                  {!readOnly && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(attachment.id)}
                      data-testid={`button-remove-${attachment.id}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {attachments.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            No attachments added yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}