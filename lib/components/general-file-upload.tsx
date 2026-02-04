import { Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "~/lib/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "~/lib/components/ui/file-upload";

type GeneralFileUploadProps = {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  value?: File[];
  className?: string;
};

export const GeneralFileUpload = ({
  onFilesChange,
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024,
  accept = "image/*,application/pdf",
  value,
  className,
}: GeneralFileUploadProps) => {
  const [files, setFiles] = React.useState<File[]>(value || []);

  React.useEffect(() => {
    if (value) {
      setFiles(value);
    }
  }, [value]);

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  return (
    <FileUpload
      maxFiles={maxFiles}
      maxSize={maxSize}
      accept={accept}
      className={className}
      value={files}
      onValueChange={handleFilesChange}
      onFileReject={onFileReject}
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">Drag & drop files here</p>
          <p className="text-muted-foreground text-xs">
            Or click to browse (max {maxFiles} files, up to{" "}
            {maxSize / 1024 / 1024}MB each)
          </p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-fit">
            Browse files
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList>
        {files.map((file, index) => (
          <FileUploadItem key={index} value={file}>
            <FileUploadItemPreview />
            <FileUploadItemMetadata />
            <FileUploadItemDelete asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <X className="size-4" />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
};
