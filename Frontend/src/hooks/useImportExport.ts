import { useState } from "react";

export const useImportExport = () => {
  const [importProgress, setImportProgress] = useState(0);

  const handleBulkImport = async (file: File) => {
    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        setImportProgress((e.loaded / e.total) * 100);
      }
    };
    reader.readAsText(file);
  };

  return {
    importProgress,
    handleBulkImport,
  };
};
