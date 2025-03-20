import { useState, useEffect } from "react";

export const useScanner = () => {
  const [scanData, setScanData] = useState<string>("");
  const [scanType, setScanType] = useState<"barcode" | "rfid">("barcode");

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && scanData.length > 3) {
        //process scan
        setScanData("");
      } else {
        setScanData((prev) => prev + e.key);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [scanData]);

  return {
    scanData,
    scanType,
    setScanType,
  };
};
