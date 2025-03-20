import { read, utils, write } from "xlsx";
import { saveAs } from "file-saver";
import { Book } from "../../../types/libraryTypes";

interface BulkImportExportProps {
  onImport: (data: any[]) => void;
}

export const BulkImportExport = ({ onImport }: BulkImportExportProps) => {
  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = read(data, { type: "array" });
      const jsonData = utils.sheet_to_json<any>(
        workbook.Sheets[workbook.SheetNames[0]]
      );
      onImport(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  const books: Book[] = []; // Define the books array

  const handleExport = (books: Book[]) => {
    const worksheet = utils.json_to_sheet(books);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Books");
    const buffer = write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), "library_export.xlsx");
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .csv" onChange={handleFileImport} />
      <button onClick={() => handleExport(books)}>Export All</button>
    </div>
  );
};
