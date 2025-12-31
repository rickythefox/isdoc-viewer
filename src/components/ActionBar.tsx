import type React from "react";
import { useTranslation } from "react-i18next";
import { exportToPDF } from "../lib/pdf-exporter";

interface ActionBarProps {
  invoiceId: string;
  onReset: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({ invoiceId, onReset }) => {
  const { t } = useTranslation();

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF("invoice-viewer", `Faktura_${invoiceId}.pdf`);
    } catch (error) {
      console.error("Failed to export PDF:", error);
      alert(t("errors.pdfExportFailed"));
    }
  };

  return (
    <div className="flex gap-3 mb-6 no-print">
      <button
        type="button"
        onClick={handlePrint}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        🖨️ {t("actions.print")}
      </button>
      <button
        type="button"
        onClick={handleExportPDF}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      >
        📄 {t("actions.exportPdf")}
      </button>
      <button
        type="button"
        onClick={onReset}
        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors ml-auto"
      >
        ← {t("actions.loadAnother")}
      </button>
    </div>
  );
};
