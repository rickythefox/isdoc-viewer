import type React from "react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";

interface FileUploaderProps {
  onFileLoad: (content: string, filename: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileLoad }) => {
  const { t } = useTranslation();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileLoad(content, file.name);
      };
      reader.readAsText(file);
    },
    [onFileLoad],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/xml": [".xml", ".isdoc"],
      "text/xml": [".xml", ".isdoc"],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
        transition-colors duration-200
        ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
      `}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          role="img"
          aria-label="Upload file icon"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {isDragActive ? (
          <p className="text-lg text-blue-600">{t("upload.dragging")}</p>
        ) : (
          <>
            <p className="text-lg text-gray-600">{t("upload.dropzone")}</p>
            <p className="text-sm text-gray-500">{t("upload.formats")}</p>
          </>
        )}
      </div>
    </div>
  );
};
