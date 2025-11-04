import type React from "react";
import { exportToPDF } from "../lib/pdf-exporter";

interface ActionBarProps {
  invoiceId: string;
  onReset: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({ invoiceId, onReset }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF("invoice-viewer", `Faktura_${invoiceId}.pdf`);
    } catch (error) {
      console.error("Failed to export PDF:", error);
      alert("Nepodařilo se exportovat PDF");
    }
  };

  return (
    <div className="flex gap-3 mb-6 no-print">
      <button
        onClick={handlePrint}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        🖨️ Tisknout
      </button>
      <button
        onClick={handleExportPDF}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      >
        📄 Export PDF
      </button>
      <button
        onClick={onReset}
        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors ml-auto"
      >
        ← Načíst jinou fakturu
      </button>
    </div>
  );
};
